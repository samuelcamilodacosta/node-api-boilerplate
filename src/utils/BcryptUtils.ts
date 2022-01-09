import bcrypt from 'bcryptjs';

export class BcryptUtils {
    public static compare(password: string, userPassword: string): Promise<boolean> {
        return bcrypt.compare(password, userPassword);
    }

    public static hashSync(password: string): string {
        return bcrypt.hashSync(password, 8);
    }
}
