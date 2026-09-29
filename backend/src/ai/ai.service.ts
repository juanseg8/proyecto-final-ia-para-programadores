import { Injectable, NotFoundException } from '@nestjs/common';
import { AiProviderService } from './ai-provider.service';
import { AiGuardrailsService } from './ai-guardrails.service';
import { AiAuditService } from '../ai-audit/ai-audit.service';
import { EstablishmentService } from '../establishments/establishment.service';
import { IndicatorsService } from '../indicators/indicators.service';
import { BenchmarkService } from '../benchmark/benchmark.service';
import { AlertsService } from '../alerts/alerts.service';
import { WeatherService } from '../weather/weather.service';

export interface AiAskResult {
  answer: string | null;
  deterministicContext: any;
  guardrailPassed: boolean;
  model: string | null;
  unavailableReason?: string;
}

@Injectable()
export class AiService {
  constructor(
    private readonly provider: AiProviderService,
    private readonly guardrails: AiGuardrailsService,
    private readonly audit: AiAuditService,
    private readonly establishmentService: EstablishmentService,
    private readonly indicatorsService: IndicatorsService,
    private readonly benchmarkService: BenchmarkService,
    private readonly alertsService: AlertsService,
    private readonly weatherService: WeatherService,
  ) {}

  async ask(userId: string, establishmentId: string, question: string): Promise<AiAskResult> {
    const from = new Date();
    from.setMonth(from.getMonth() - 1); // 1 mes atras
    const to = new Date();

    const toolsUsed = [
      'getEstablishmentSummary',
      'getIndicatorsContext',
      'getBenchmarkContext',
      'getAlertsContext',
      'getWeatherContext'
    ];

    let context: any = {};
    
    try {
      const establishment = await this.establishmentService.findById(establishmentId);
      if (!establishment) throw new NotFoundException('Establecimiento no encontrado');
      context.establishment = {
        name: establishment.name,
        activity: establishment.activity,
        productionSystem: establishment.productionSystem,
        superficieHa: establishment.superficieHa,
      };

      context.indicators = await this.indicatorsService.calculateIndicators(establishmentId, from, to);
      context.alerts = await this.alertsService.getAlerts(establishmentId, from, to);
      context.weather = await this.weatherService.getWeather(establishmentId);
      
      // Intentamos conseguir un benchmark (ejemplo GMD)
      if (establishment.participatesInBenchmark && establishment.activity && establishment.productionSystem) {
        context.benchmark = await this.benchmarkService.calculateBenchmark(establishmentId, 'gmdGramsDay', from, to);
      }
    } catch (e) {
      console.error('Error fetching context for AI', e);
    }

    let answer: string | null = null;
    let guardrailPassed = false;
    let errorCode: string | null = null;
    let unavailableReason: string | undefined = undefined;

    if (!this.provider.isAvailable()) {
      unavailableReason = 'AI_PROVIDER_NOT_CONFIGURED';
    } else {
      const systemPrompt = `
Eres Agro IA, un experto ingeniero agrónomo y asistente virtual para productores ganaderos.
El usuario te hará preguntas sobre su establecimiento. Tienes el siguiente contexto real de su campo:
${JSON.stringify(context, null, 2)}

Tu objetivo es ANALIZAR estos datos y dar RECOMENDACIONES útiles, no te limites a repetir los números como un robot.
Reglas:
1. Responde siempre en español, con un tono amable, profesional y proactivo.
2. Si notas métricas inusuales, adviértelo y sugiere acciones agronómicas prácticas.
3. PROHIBIDO: Bajo ninguna circunstancia uses asteriscos (*), numerales (#) ni guiones (-). Escribe todo en texto plano puro. Usa emojis (🐄, 🌱) para adornar.
4. NO proveas diagnósticos clínicos veterinarios definitivos.
5. NO inventes métricas que no estén en el contexto.
      `;

      // Definición de las herramientas disponibles para el LLM
      const tools = [
        {
          type: "function",
          function: {
            name: "search_internet",
            description: "Busca en internet información agronómica, mercados, o clima.",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string", description: "Término de búsqueda" }
              },
              required: ["query"]
            }
          }
        },
        {
          type: "function",
          function: {
            name: "query_database",
            description: "Consulta información histórica del establecimiento directamente en la base de datos.",
            parameters: {
              type: "object",
              properties: {
                sql_query: { type: "string", description: "Consulta SQL para ejecutar" }
              },
              required: ["sql_query"]
            }
          }
        }
      ];

      answer = await this.provider.ask(systemPrompt, question, tools);

      if (answer) {
        answer = answer.replace(/[*#]/g, '');
        guardrailPassed = this.guardrails.validate(answer, context);
        if (!guardrailPassed) {
          errorCode = 'GUARDRAIL_FAILED';
          answer = null;
          unavailableReason = 'Respuesta bloqueada por políticas de seguridad (guardrails).';
        }
      } else {
        errorCode = 'PROVIDER_TIMEOUT_OR_ERROR';
        unavailableReason = 'El proveedor de IA no respondió a tiempo o falló.';
      }
    }

    await this.audit.logInteraction({
      userId,
      establishmentId,
      question,
      answer,
      contextJson: context,
      toolsJson: toolsUsed,
      model: this.provider.getModel(),
      guardrailPassed,
      errorCode,
    });

    return {
      answer,
      deterministicContext: context,
      guardrailPassed,
      model: this.provider.getModel(),
      unavailableReason,
    };
  }
}
