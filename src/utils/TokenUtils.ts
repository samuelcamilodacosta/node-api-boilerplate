// JWT
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectID } from 'typeorm';

export class TokenUtils {
    public static verify(token: string): string | JwtPayload {
        return jwt.verify(token, 'secret');
    }

    public static sign(id: ObjectID, email: string): string {
        return jwt.sign({ id, email }, 'secret', { expiresIn: '10h' });
    }
}
