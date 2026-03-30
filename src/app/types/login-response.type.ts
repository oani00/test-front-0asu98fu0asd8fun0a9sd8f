export type LoginResponse = {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    phone?: string;
    type?: string;
    picture?: string | null;
  }
};