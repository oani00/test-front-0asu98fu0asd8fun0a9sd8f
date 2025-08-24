export interface Excursion {
  _id?: string; // MongoDB ObjectId as string
  name: string;
  description?: string;
  date?: Date;
  location?: string;
  price?: number;
  type: 'tour' | 'trip';
  pictures?: string[]; // Array of Picture ObjectId strings
  users?: string[];    // Array of User ObjectId strings
}