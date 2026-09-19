$ErrorActionPreference = "Stop"

$files = @(
  "mobile/src/screens/HomeScreen.tsx",
  "mobile/src/screens/LoginScreen.tsx",
  "mobile/src/screens/EstablishmentListScreen.tsx",
  "mobile/src/screens/RegisterScreen.tsx",
  "mobile/src/screens/EstablishmentDetailScreen.tsx",
  "mobile/src/screens/EstablishmentFormScreen.tsx",
  "mobile/src/components/MapLocationPicker.tsx",
  "mobile/__tests__/EstablishmentListScreen.test.tsx"
)

$replacements = [ordered]@{
  "Ã¡" = "á"
  "Ã©" = "é"
  "Ã­" = "í"
  "Ã³" = "ó"
  "Ãº" = "ú"
  "Ã±" = "ñ"
  "Ã" = "Á"
  "Ã‰" = "É"
  "Ã" = "Í"
  "Ã“" = "Ó"
  "Ãš" = "Ú"
  "Ã‘" = "Ñ"
  "Â¿" = "¿"
  "Â¡" = "¡"
  "â€º" = ">"
  "â€¹" = "<"
  "â€”" = "-"
  "â†’" = ""
  "â–ª" = ""
  "ï¼‹" = "+"
  "ðŸŒ¿" = ""
  "ðŸ“" = ""
  "ðŸ“Š" = ""
  "ðŸ " = ""
  "Buen dìa" = "Buen día"
  "🌿" = ""
  "📍" = ""
  "📊" = ""
  "🏠" = ""
  "🔒" = ""
  "🙈" = "Ocultar"
  "👁" = "Ver"
  "✉" = "@"
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($path in $files) {
  if (-not (Test-Path $path)) { continue }

  $text = [System.IO.File]::ReadAllText((Resolve-Path $path))
  $original = $text

  foreach ($entry in $replacements.GetEnumerator()) {
    $text = $text.Replace([string]$entry.Key, [string]$entry.Value)
  }

  if ($text -ne $original) {
    [System.IO.File]::WriteAllText((Resolve-Path $path), $text, $utf8NoBom)
    Write-Host "Normalized: $path"
  }
}

Write-Host "Deterministic mobile text normalization complete."
