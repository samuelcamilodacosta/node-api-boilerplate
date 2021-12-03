// Modules
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

// JWT
import jwt from 'jsonwebtoken';

// Library
import { BaseController } from '../../../../library';

// Entities
import { User } from '../../../../library/database/entity';

// Decorators
import { Controller, Middlewares, Post, PublicRoute, Get } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Repositories
import { UserRepository } from '../../../../library/database/repository';

// Validators
import { AuthValidator } from '../middlewares/AuthValidator';

@Controller(EnumEndpoints.AUTH_V1)
export class AuthController extends BaseController {
    /**
     * @swagger
     * /v1/auth:
     *   post:
     *     summary: Autentica os dados de login
     *     tags: [Auth]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               email: me@mail.com
     *               password: yourPassword
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Post()
    @PublicRoute()
    @Middlewares(AuthValidator.login())
    public async authenticate(req: Request, res: Response): Promise<void> {
        const user: User | undefined = await new UserRepository().findByEmail(req.body.email);

        if (!user) {
            RouteResponse.unauthorizedError(res, 'Erro ao tentar logar');
        } else {
            const isValidPassword = await bcrypt.compare(req.body.password, user.password);

            if (!isValidPassword) {
                RouteResponse.unauthorizedError(res, 'Erro ao tentar logar');
            }

            // Gerando token de acesso
            const token = jwt.sign({ id: user.id, email: user.email }, 'secret', { expiresIn: '10h' });
            RouteResponse.success(token, res);
        }
    }

    /**
     * @swagger
     * /v1/auth:
     *   get:
     *     summary: Retorna email do token
     *     tags: [Auth]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get()
    @PublicRoute()
    @Middlewares()
    public async emailToken(req: Request, res: Response): Promise<void> {
        RouteResponse.success(AuthValidator.decodeTokenEmail(req, res), res);
    }
}
