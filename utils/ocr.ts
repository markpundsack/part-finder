import { createWorker, createScheduler } from 'tesseract.js';
import type { RecognizeResult } from 'tesseract.js';
import type { Location } from '../types/box';

interface OCRWord {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

interface OCRLine {
  words: OCRWord[];
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

interface OCRResult {
  data: {
    lines: OCRLine[];
    text: string;
    blocks: any[];
    confidence: number;
    words: OCRWord[];
  };
}

interface DetectedPart {
  number: number;
  location: Location;
}

export async function detectPartNumbers(imageUri: string): Promise<DetectedPart[]> {
  const scheduler = createScheduler();
  const worker = await createWorker();
  const detectedParts: DetectedPart[] = [];

  try {
    await scheduler.addWorker(worker);
    
    // Perform OCR on the image
    const result = await scheduler.addJob('recognize', imageUri);
    const { data } = result as unknown as OCRResult;

    // Process each line and word
    data.lines.forEach((line) => {
      line.words.forEach((word) => {
        const number = parseInt(word.text, 10);
        if (!isNaN(number) && number > 0 && number < 1000) {
          // Convert bounding box to normalized coordinates (0-1)
          const { bbox } = word;
          const x = (bbox.x0 + (bbox.x1 - bbox.x0) / 2) / data.lines[0].bbox.x1;
          const y = (bbox.y0 + (bbox.y1 - bbox.y0) / 2) / data.lines[data.lines.length - 1].bbox.y1;

          detectedParts.push({
            number,
            location: { x, y },
          });
        }
      });
    });

    await scheduler.terminate();
    return detectedParts;
  } catch (error) {
    console.error('Error detecting part numbers:', error);
    await scheduler.terminate();
    throw error;
  }
}

export async function detectSprueLetter(imageUri: string): Promise<string | null> {
  const scheduler = createScheduler();
  const worker = await createWorker();

  try {
    await scheduler.addWorker(worker);
    
    const result = await scheduler.addJob('recognize', imageUri);
    const { data } = result as unknown as OCRResult;

    // Look for single letters that are likely sprue identifiers
    const possibleLetters = data.lines
      .flatMap((line) => line.words)
      .filter((word) => 
        word.text.length === 1 && 
        word.confidence > 80 && // High confidence threshold
        word.text.match(/[A-Z]/)
      )
      .sort((a: OCRWord, b: OCRWord) => b.confidence - a.confidence); // Sort by confidence

    await scheduler.terminate();
    return possibleLetters.length > 0 ? possibleLetters[0].text : null;
  } catch (error) {
    console.error('Error detecting sprue letter:', error);
    await scheduler.terminate();
    throw error;
  }
}
