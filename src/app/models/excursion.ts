export interface PictureRef {
  _id: string;
  name: string;
  contentType: string;
}

/** Populated user on excursion (GET /excursions with populate users) */
export interface ExcursionUserRef {
  _id: string;
  name?: string;
  phone?: string;
}

export interface Excursion {
  _id?: string; 
  name: string;
  description?: string;
  date?: Date;
  returnDate?: Date;
  location?: string;
  price?: number;
  type: 'passeio' | 'viagem';
  pictures?: (string | PictureRef)[]; 
  users?: (string | ExcursionUserRef)[];
  paidUsers?: string[];
}

