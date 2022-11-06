import jwt from 'jsonwebtoken';
// interface DateConstructor {
//     new(): Date;
//     new(value: number | string): Date;
//     new(year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): Date;
// }

export const generateLoginToken = (user: { [key: string]: unknown }): string => {
  const pass = process.env.JWT_SECRET as string;
  return jwt.sign(user, pass, { expiresIn: process.env.TOKEN_EXP });
};

const pass=process.env.COOKIE_EXP as any 
export const options = { expires : new Date(Date.now() + 
 pass * 24 * 60 * 60 * 1000 )}



