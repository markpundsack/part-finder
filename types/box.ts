export interface Box {
  id: string;
  name: string;
  status: 'active' | 'completed';
  createdAt: Date;
  lastAccessed: Date;
  sprues: Sprue[];
}

export interface Sprue {
  id: string;
  letter?: string;
  imageUri: string;
  backImageUri?: string;
  parts: Part[];
}

export interface Part {
  number: number;
  locations: Location[];
}

export interface Location {
  x: number;
  y: number;
}
