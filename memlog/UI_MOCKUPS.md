# UI Mockups

## Box Detail Screen
```
[Search: _______________]

// Scrollable area for part numbers
[1] [2] [3] [4] [5] [6] [7] [8]
[9] [10] [11] [12] [13] [14]
[15] [16] [17] [18] [19] [20]
[21] [22] [23] [24] [25] [26]
[27] [28] [29] [30] [31] [32]
[33] [34] [35] [36] [37] [38]
...

// Fixed at bottom
+-----+ +-----+ +-----+ [+]
|  A  | |  B  | |  C  |
+-----+ +-----+ +-----+
```

## Empty Box State
```
[Box Name]

Let's add some sprues!

    [Take Pictures of Sprues]
```

## Sprue Capture Flow

### Camera View
```
[Camera View]
   +----------------+
   |     /---------+
   |    /          |  // Perspective guide overlay
   |   /           |  // adjusts in real-time
   |  /-----------/
   
[Cancel]     [📷]  // Camera icon
```

### Sprue Confirmation
```
[Cancel] Confirm Sprue [Save]

+------------------------+
|     Captured Image     |
|    (with detected     |
|    part numbers       |
|     highlighted)      |
+------------------------+

Parts Detected: 1-25
Missing: 5, 9  // Highlighted in red
         
[Retake] [Save & Add Another] [Done]
```

## Part Search Results
```
[Close] Part 12 Location

+------------------------+
|        Sprue A        |
|                       |
|          •←[12]       |
|                       |
+------------------------+

Also appears on:
[Sprue B] [Sprue C]  // Tappable to switch view
```

## Sprue Detail View
```
[Back] [Sprue A] [Edit]

+------------------------+
|     Full-size         |
|     Sprue Image       |
|    (with all part     |
|     numbers shown)    |
+------------------------+

[Sprue Letter: A_]
Parts: 1-25

[Adjust Perspective]
[Delete Sprue]

Part List:
[1] [2] [3] [4]...  // Tappable to highlight
```

## Notes
- All part numbers should use "A12" format when sprue has a letter
- Part number pills should be easily tappable
- Sprue thumbnails should be recognizable but compact
- Perspective guide should be prominent but not obstructive
- Missing numbers should be clearly highlighted in red
- Consider animation for part location highlighting

### Part Number Display
- Scrollable grid of part numbers fills main screen area
- Persist scroll location between part search results so sequential searches are efficient
- Consider grouping by sprue (e.g., "Sprue A: 1-25")
- Handle gaps in sequences (e.g., missing numbers)
- Use consistent "A12" format when applicable

### Sprue Thumbnails
- Fixed row at bottom with compact thumbnails
- Always show "+" button for adding new sprues
- Consider showing part range in thumbnail (e.g., "A: 1-25")
- Horizontal scrolling if many sprues

## Last Updated
2/11/2025, 12:00 PM (America/Chicago)
