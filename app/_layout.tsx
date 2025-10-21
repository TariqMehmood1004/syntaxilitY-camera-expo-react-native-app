import { DarkTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

const _layout = () => {
  return (
    <GestureHandlerRootView>
      <ThemeProvider value={DarkTheme}>
        <Stack>

          <Stack.Screen name="index" options={
            {
              headerShown: false,
              title: 'Camera',
              headerLargeTitle: false,
              headerShadowVisible: false,
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

          <Stack.Screen name="media" options={
            {
              headerShown: true,
              title: 'Media',
              headerLargeTitle: true,
              headerShadowVisible: false,
              headerBlurEffect: 'dark',
              presentation: 'modal'
            }
          } />

          <Stack.Screen name="settings" options={
            {
              headerShown: true,
              title: 'Settings',
              headerLargeTitle: true,
              headerShadowVisible: false,
              headerBlurEffect: 'dark',
              presentation: 'modal'
            }
          } />


        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}

export default _layout