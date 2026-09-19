# React Native Implementation Rules

- Respect Safe Areas on every top-level screen.
- Forms obscurable by keyboard need appropriate KeyboardAvoidingView/ScrollView behavior.
- Do not hardcode device dimensions when flex/layout can express intent.
- Use `useWindowDimensions` only when responsive breakpoints are genuinely necessary.
- Reuse theme tokens.
- Use one icon library/system.
- Preserve accessibilityRole, accessibilityLabel and disabled state through wrappers.
- Avoid giant TouchableOpacity wrappers and accidental nested pressables.
- Maps/GPS must keep manual fallback.
- Do not treat Expo Go as proof of native Google Maps configuration when a development build is required.
- External selectors/services need loading, error, retry and disabled states.
