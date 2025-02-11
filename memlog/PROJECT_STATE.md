# Project State

## Current Status
- React Native + Expo app for cataloging Warhammer model sprues
- OCR functionality implemented using Tesseract.js
- Box and sprue management system in place
- AsyncStorage used for data persistence

## Components
1. Box Management
   - Create and view boxes
   - Box status management (active/completed):
     * Swipe gestures for quick actions
     * Subtle toggle for completed boxes at list bottom
     * Visual feedback for box status
   - Box organization:
     * Alphabetical sorting by name
     * Active boxes shown by default
     * Completed boxes accessible but not prominent
   - Delete boxes with proper state handling:
     * Maintains active box if deleting non-active box
     * Returns to box list when deleting active box
     * Handles edge cases in both list and detail views
   - Active box selection with visual feedback
   - Box details view with:
     * Clean header with box name
     * Header-based options menu
     * Simplified sprue list view
     * Quick actions for sprue management

2. Sprue Management
   - Capture sprue images
   - OCR detection of part numbers and sprue letters
   - Sprue detail view with part markers

3. Search Functionality
   - Search within active box
   - Part number search with letter prefix support
   - Visual results with part locations

## Dependencies
- expo-camera@13.4.4
- expo-image-picker
- tesseract.js
- @react-native-async-storage/async-storage
- expo-router
- Other Expo standard libraries

## Storage Locations
- Box data: AsyncStorage with keys
  - '@boxes' - List of all boxes
  - '@activeBoxId' - Currently selected box ID

## Testing
- OCR test screen with:
  * Image picking and test data options
  * Visual part number markers
  * Simplified results display
  * Modal presentation with close button
- Test data available in app/(box)/sprue/test-data.ts

## User Requirements

1. Primary Flow
   - First launch: Create box and add sprues
   - Subsequent launches: Go directly to part finding
   - Focus on quick part location within sprues

2. Box Detail Screen
   - Search bar for direct part number input
   - Part number grid with wrapping (1-99+)
   - Compact sprue thumbnails (horizontal scroll)
   - Easy access to add more sprues

3. Sprue Capture Flow
   - Camera view:
     * Real-time perspective guide overlay
     * Simple capture and cancel buttons
   - Confirmation screen:
     * Show captured image
     * Display detected part numbers
     * Highlight missing numbers in sequence
     * Options: retake, save & add another, done

4. Part Finding
   - Search results in modal/screen:
     * Show relevant sprue(s)
     * Clear part location highlighting
     * Easy switching between matches
   - Support "A12" format consistently

## Pending Features
1. UI/UX Overhaul
   - Remove tab-based navigation
   - Implement part number grid
   - Add compact sprue thumbnails
   - Improve search results view
   - Streamline multi-sprue workflow

2. Image Processing
   - Real-time perspective guide overlay
   - Automatic perspective correction
   - Missing number detection
   - OCR accuracy improvements

3. Sprue Management
   - Optional letter assignment
   - Better perspective correction
   - Quick multi-sprue capture
   - Part number validation

4. Future Enhancements
   - Sprue sharing between users
   - Box search functionality
   - Back-of-sprue photography
   - 3D model generation
   - Box image OCR for metadata

## Known Issues
1. OCR Accuracy
   - Part number detection needs improvement
   - Missing number detection reliability
   - Sprue letter detection reliability varies

2. Navigation and UI
   - Some TypeScript issues with Expo Router paths
   - Using @ts-ignore for certain navigation calls
   - Tab-based navigation not optimal for workflow
   - Back navigation needs improvement
   - Large part number sets need better handling

## Last Updated
2/11/2025, 11:16 AM (America/Chicago)
