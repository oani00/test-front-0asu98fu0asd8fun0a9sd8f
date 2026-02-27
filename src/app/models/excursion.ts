export interface PictureRef {
  _id: string;
  name: string;
  contentType: string;
}

export interface Excursion {
  _id?: string; // MongoDB ObjectId as string
  name: string;
  description?: string;
  date?: Date;
  location?: string;
  price?: number;
  type: 'passeio' | 'viagem';
  pictures?: (string | PictureRef)[]; // Array of Picture ObjectId strings or populated Picture objects
  users?: string[];    // Array of User ObjectId strings
}

