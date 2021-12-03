import { RequestHandler, Request, Response, NextFunction } from 'express';

// JWT
import jwt from 'jsonwebtoken';

// Validators
import { UserValidator } from '../../../users/v1/middlewares/UserValidator';
import { BaseValidator } from '../../../../library';

// Routes
import { RouteResponse } from '../../../../routes';

// Interfaces
import { ITokenPayload } from '../../../../models';

/**
 * AuthValidator
 *
 * Classe de validação que autentica token de acesso
 */
export class AuthValidator extends BaseValidator {
    public static authMiddleware(req: Request, res: Response, next: NextFunction): void {
        const { authorization } = req.headers;

        if (!authorization) {
            RouteResponse.unauthorizedError(res, 'Erro ao tentar logar');
        } else {
            const token = authorization.replace('Bearer', '').trim();

            try {
                const data = jwt.verify(token, 'secret');
                const { id, email } = data as ITokenPayload;
                req.userId = id;
                req.userEmail = email;
                next();
            } catch {
                RouteResponse.unauthorizedError(res, 'Erro ao tentar logar');
            }
        }
    }

    /**
     * decodeTokenEmail
     *
     * @returns Decodifica o token retornando o e-mail
     */
    public static decodeTokenEmail(req: Request, res: Response): string | undefined {
        const { authorization } = req.headers;

        if (!authorization) {
            RouteResponse.unauthorizedError(res, 'Erro ao tentar logar');
        } else {
            const token = authorization.replace('Bearer', '').trim();
            const data = jwt.verify(token, 'secret');
            const { email } = data as ITokenPayload;
            req.userEmail = email;
            return email;
        }
        return undefined;
    }

    /**
     * decodeTokenId
     *
     * @returns Decodifica o token retornando o ID
     */
    public static decodeTokenId(req: Request, res: Response): string | undefined {
        const { authorization } = req.headers;

        if (!authorization) {
            RouteResponse.unauthorizedError(res, 'Erro ao tentar logar');
        } else {
            const token = authorization.replace('Bearer', '').trim();
            const data = jwt.verify(token, 'secret');
            const { id } = data as ITokenPayload;
            req.userId = id;
            return id;
        }
        return undefined;
    }

    /**
     * login
     *
     * @returns Lista de validadores
     */
    public static login(): RequestHandler[] {
        return UserValidator.validationList({
            email: UserValidator.model.email,
            password: UserValidator.model.password
        });
    }
}
