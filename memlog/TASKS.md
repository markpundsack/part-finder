# Task Log

## Active Tasks

### Navigation Overhaul (High Priority)
- [ ] Remove tab-based navigation
- [ ] Implement new box detail screen:
  * Add search bar at top
  * Create scrollable part number grid
  * Add fixed sprue thumbnail row at bottom
  * Implement "+" button for adding sprues
  * Persist scroll position between searches
  * Add ability to rename box
- [ ] Create new search results screen:
  * Modal presentation with full-size sprue view
  * Clear part location highlighting
  * Easy switching between matches
  * Return to same scroll position
- [ ] Update navigation flow:
  * Direct to part finding on box open
  * Simplified sprue management
  * Optimize for sequential part finding

### Sprue Capture Improvements (High Priority)
- [ ] Implement new camera view:
  * Add real-time perspective guide overlay
  * Simplify to capture/cancel buttons
- [ ] Create sprue confirmation screen:
  * Show captured image with detected numbers
  * Highlight missing numbers in sequence
  * Add retake/save/done options
- [ ] Implement quick multi-sprue workflow:
  * Immediate OCR feedback
  * Quick transition to next capture
  * Clear completion path

### OCR Enhancements
- [ ] Improve part number detection accuracy
- [ ] Add missing number detection
- [ ] Enhance sprue letter recognition
- [ ] Support "A12" format consistently
- [ ] Add validation for detected numbers

### Image Processing
- [ ] Implement real-time perspective guide
- [ ] Add automatic perspective correction
- [ ] Optimize image quality vs. size balance
- [ ] Add manual perspective adjustment backup

### Future Features
- [ ] Add sprue sharing functionality
- [ ] Implement box search
- [ ] Support back-of-sprue photography
- [ ] Add 3D model generation
- [ ] Implement box image OCR
- [ ] Add more optional details for boxes such as cover art and publish date

## Completed Tasks

### Core Functionality ✅
- [x] Set up Expo Router navigation
- [x] Implement box creation and management
- [x] Add camera integration
- [x] Implement basic OCR functionality
- [x] Add search capability
- [x] Create test OCR screen

### Data Storage ✅
- [x] Implement AsyncStorage for box data
- [x] Add active box selection
- [x] Create data types and interfaces
- [x] Add test data for development

### UI Components ✅
- [x] Create themed components
- [x] Implement box list view
- [x] Add sprue detail view
- [x] Create camera capture screen
- [x] Add search results view

## Known Issues

### High Priority
1. Navigation Structure
   - Tab-based navigation to be removed
   - Part number grid scrolling performance
   - Scroll position persistence between searches

2. OCR Accuracy
   - Part numbers sometimes misread
   - Missing numbers not detected
   - Sprue letters not consistently detected

### Medium Priority
1. Performance
   - Image processing can be slow
   - OCR takes time to initialize
   - Need to optimize for multiple sprues

2. UI/UX
   - Part number grid layout optimization
   - Sprue thumbnail sizing and layout
   - Search results modal transitions

## Notes
- Consider using ML Kit as alternative to Tesseract.js
- May need to implement custom OCR training for Warhammer-specific fonts
- Consider adding barcode scanning for box identification

## Last Updated
2/11/2025, 12:08 PM (America/Chicago)
