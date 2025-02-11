# Part Finder

A mobile app for Warhammer model builders to quickly locate parts on their sprues. Built with React Native and Expo.

## Features

- Take pictures of your sprues and automatically detect part numbers
- Search for specific parts and see their exact location
- Manage multiple boxes of sprues
- Real-time perspective guide for capturing sprues
- Support for lettered sprues (e.g., "A12" format)
- Quick multi-sprue capture workflow

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- iOS device or simulator (for iOS development)
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/part-finder.git
cd part-finder
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### iOS Development

1. Install iOS dependencies:
```bash
cd ios
pod install
cd ..
```

2. Open the iOS simulator:
```bash
npm run ios
```

Or to run on a physical device:
1. Open `ios/PartFinder.xcworkspace` in Xcode
2. Select your device in the device dropdown
3. Press the Play button or `Cmd + R`

### Android Development

Android previews are defined as a `workspace.onStart` hook and started as a vscode task when the workspace is opened/started.


```
npm run android -- --tunnel
```

In the output of this command/task, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You'll also find options to open the app's developer menu, reload the app, and more.

#### Web

Web previews will be started and managred automatically. Use the toolbar to manually refresh.

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).


## Development

The app uses:
- [Expo Router](https://docs.expo.dev/router/introduction/) for navigation
- [Tesseract.js](https://tesseract.projectnaptha.com/) for OCR
- AsyncStorage for data persistence
- React Native's camera and image picker APIs

Key directories:
- `app/`: Main application code with file-based routing
- `components/`: Reusable React components
- `utils/`: Helper functions and utilities
- `types/`: TypeScript type definitions
- `assets/`: Images, fonts, and other static files

## Learn More

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)
- [Expo Router documentation](https://docs.expo.dev/router/introduction/)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to the Warhammer community for inspiration
- Built with [Expo](https://expo.dev)
- OCR powered by [Tesseract.js](https://tesseract.projectnaptha.com/)
