// Libraries
import { RequestHandler, Request, Response, NextFunction } from 'express';

// Utils
import { TokenUtils } from '../../../../utils';

// Validators
import { UserValidator } from '../../../users/v1/middlewares/UserValidator';
import { BaseValidator } from '../../../../library';

// Repositories
import { UserRepository } from '../../../../library/database/repository/UserRepository';

// Routes
import { RouteResponse } from '../../../../routes';

// Interfaces
import { ITokenPayload } from '../../../../models';

/**
 * AuthValidator
 *
 * Classe de validação e autenticação do token e do acesso
 */
export class AuthValidator extends BaseValidator {
    /**
     * tokenValidate
     *
     * @returns Faz validação do token
     */
    public static tokenValidate(req: Request, res: Response, next: NextFunction): void {
        const { authorization } = req.headers;
        if (authorization) {
            try {
                const token = authorization.replace('Bearer', '').trim();
                const data = TokenUtils.verify(token);
                const { email } = data as ITokenPayload;
                req.userEmail = email;
                next();
            } catch {
                RouteResponse.unauthorizedError(res);
            }
        } else {
            RouteResponse.unauthorizedError(res);
        }
    }

    /**
     * decodeTokenEmail
     *
     * @returns Decodifica o token retornando o e-mail
     */
    public static decodeTokenEmail(req: Request, res: Response): string | void {
        const { authorization } = req.headers;
        if (authorization) {
            const token = authorization.replace('Bearer', '').trim();
            const data = TokenUtils.verify(token);
            const { email } = data as ITokenPayload;
            req.userEmail = email;
            return email;
        }
        return RouteResponse.unauthorizedError(res, 'Erro ao tentar logar');
    }

    /**
     * acessPermission
     *
     * @returns Verifica se o usuário tem permissão de acesso.
     */
    public static accessPermission(req: Request, res: Response, next: NextFunction): void {
        const token = req.headers.authorization?.replace('Bearer', '').trim();
        const email = AuthValidator.decodeTokenEmail(req, res);
        const userRepository: UserRepository = new UserRepository();
        if (!token || !email) RouteResponse.unauthorizedError(res);
        else {
            try {
                TokenUtils.verify(token);
                const user = userRepository.findByEmail(email);
                if (user === undefined) RouteResponse.unauthorizedError(res);
                next();
            } catch {
                RouteResponse.unauthorizedError(res);
            }
        }
    }

    /**
     * login
     *
     * @returns Lista de validadores
     */
    public static login(): RequestHandler[] {
        return UserValidator.validationList({ email: UserValidator.model.email, password: UserValidator.model.password });
    }
}
