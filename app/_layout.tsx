import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <ThemeProvider value={DarkTheme}>
      <Stack>

        <Stack.Screen name="index" options={
          {
            headerShown: true,
            title: 'Permissions',
            headerLargeTitle: true,
            headerShadowVisible: false,
            headerBlurEffect: 'dark'
          }
        } />

        <Stack.Screen name="camera" options={
          {
            headerShown: true,
            title: 'Camera',
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