import { RequestHandler, Request, Response, NextFunction } from 'express';

// JWT
import jwt from 'jsonwebtoken';

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

        if (!authorization) {
            RouteResponse.unauthorizedError(res);
        } else {
            try {
                const token = authorization.replace('Bearer', '').trim();
                const data = jwt.verify(token, 'secret');
                const { id, email } = data as ITokenPayload;
                req.userId = id;
                req.userEmail = email;
                next();
            } catch {
                RouteResponse.unauthorizedError(res);
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
     * acessPermission
     *
     * @returns Verifica se o usuário tem permissão de acesso.
     */
    public static accessPermission(req: Request, res: Response, next: NextFunction): void {
        const token = req.headers.authorization?.replace('Bearer', '').trim();
        const id = AuthValidator.decodeTokenId(req, res);
        const userRepository: UserRepository = new UserRepository();
        if (!token) RouteResponse.unauthorizedError(res);
        else if (!id) RouteResponse.unauthorizedError(res);
        else {
            try {
                jwt.verify(token, 'secret');
                const user = userRepository.findById(id);
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
        return UserValidator.validationList({
            email: UserValidator.model.email,
            password: UserValidator.model.password
        });
    }
}
