// src/entities/user/model/types.ts
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: { city: string; street: string };
  company: { name: string };
}
