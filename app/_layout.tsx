import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>

        <Stack.Screen name="index" options={
          {
            headerShown: false,
            title: 'Camera',
          }
        } />

        <Stack.Screen name="permissions" options={
          {
            headerShown: true,
            title: 'Permissions',
            headerLargeTitle: true,
            headerShadowVisible: false,
            headerBlurEffect: 'dark'
          }
        } />
      </Stack>
    </ThemeProvider>
  )
}

export default _layout