# Changelog

## [Unreleased]
### Added
- OCR test screen for verifying part detection
- Sprue detail view with part number markers
- Box management system with active box selection
- Camera integration with image capture and processing
- Search functionality for finding parts within active box

### Changed
- Switched from expo-camera to expo-image-picker for better compatibility
- Updated camera screen to use image picker for photo capture
- Improved navigation with proper Expo Router configuration
- Enhanced UI and navigation:
  - Simplified box list cards to show only essential info
  - Added swipe gestures for box completion and deletion
  - Added subtle toggle for completed boxes at list bottom
  - Moved box options to header menu
  - Added proper modal close buttons
  - Improved OCR test screen layout
  - Sorted boxes alphabetically by name
  - Fixed navigation header labels and back buttons
  - Improved header configuration for nested navigation
  - Fixed back button visibility in box detail screen

### Fixed
- Camera permission handling and state management
- Box creation with proper data persistence
- Navigation type issues with temporary ts-ignore workaround
- Box deletion behavior improved:
  - Proper handling of active box state
  - Consistent navigation after deletion
  - Fixed edge cases in box list updates

## [0.1.0] - 2025-02-10
### Added
- Initial project setup with Expo Router
- Basic box management functionality
- Camera integration for sprue capture
- OCR implementation with Tesseract.js
- AsyncStorage for data persistence
- Themed components for consistent UI
- Test data for OCR verification

### Dependencies
- Added expo-camera@13.4.4
- Added expo-image-picker
- Added tesseract.js
- Added react-native-gesture-handler
- Added other standard Expo dependencies

## Last Updated
2/10/2025, 10:54 PM (America/Chicago)
