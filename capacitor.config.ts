import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Punto Plebes',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    BluetoothSerial: {
      android: {
        permissions: [
          'android.permission.BLUETOOTH',
          'android.permission.BLUETOOTH_ADMIN',
          'android.permission.BLUETOOTH_CONNECT',
          'android.permission.BLUETOOTH_SCAN'
        ]
      }
    }
  }
}

export default config
