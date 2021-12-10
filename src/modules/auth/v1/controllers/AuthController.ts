// Modules
import { Request, Response } from 'express';

// Library
import { BaseController, UserRepository } from '../../../../library';

// Decorators
import { Controller, Middlewares, Post, PublicRoute, Get } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

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
        const token = await new UserRepository().authenticateUser(req.body.email, req.body.password);
        if (token) RouteResponse.success(token, res);
        RouteResponse.unauthorizedError(res, 'Erro ao tentar logar');
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
