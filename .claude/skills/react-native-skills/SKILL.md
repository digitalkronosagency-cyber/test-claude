# react-native-skills

React Native and Expo best practices — 8 priority categories for performant mobile apps.

**License:** MIT | **Version:** 1.0.0 | **Author:** Vercel

## When to Apply

Working on React Native or Expo projects, especially for list optimization, animations, and native module integration.

## Categories (Priority Order)

### 1. List Performance (CRITICAL)
- Use `FlatList` or `FlashList` — never map into `ScrollView` for long lists
- Memoize list items with `React.memo`
- Stabilize callbacks with `useCallback` before passing as props
- Set `keyExtractor` explicitly; avoid index-based keys
- Use `getItemLayout` for fixed-height items to skip measurement

### 2. Animation (HIGH)
- Use `react-native-reanimated` for GPU-optimized animations
- Animate only `transform` and `opacity` — never layout properties
- Use `useAnimatedStyle` + `useSharedValue` for worklet-based animations
- Handle gestures with `react-native-gesture-handler`

### 3. Navigation (HIGH)
- Use native navigators (`react-navigation` with native stack) over JS alternatives
- Avoid heavy computation during navigation transitions
- Lazy-load screens with `React.lazy` or `import()`

### 4. UI Patterns (HIGH)
- Use `expo-image` instead of `<Image>` for caching and performance
- Use `Modal` sparingly — prefer bottom sheets (`@gorhom/bottom-sheet`)
- Use `StyleSheet.create()` — never inline style objects in JSX

### 5. State Management (MEDIUM)
- Minimize subscription scope — subscribe only to the slice you need
- Use `zustand` or `jotai` over Redux for simpler stores
- Keep server state separate from UI state (React Query / SWR)

### 6. Rendering (MEDIUM)
- Always wrap text in `<Text>` — never render string literals directly
- Use conditional rendering with `&&` carefully; use ternaries for clarity
- Avoid anonymous functions in JSX render methods

### 7. Monorepo (MEDIUM)
- Use `metro.config.js` `watchFolders` to include shared packages
- Deduplicate React Native dependencies across workspace packages

### 8. Configuration (LOW)
- Load custom fonts with `expo-font` and `useFonts` before rendering
- Define design tokens (colors, spacing, typography) in a shared constants file
