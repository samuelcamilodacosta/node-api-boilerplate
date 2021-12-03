// Modules
import { DeepPartial } from 'typeorm';
import { Request, Response } from 'express';

// Library
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Delete, Middlewares, Post, PublicRoute, Put } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Entities
import { User } from '../../../../library/database/entity';

// Repositories
import { UserRepository } from '../../../../library/database/repository';

// Validators
import { UserValidator } from '../middlewares/UserValidator';
import { AuthValidator } from '../../../auth/v1';

@Controller(EnumEndpoints.USER_V1)
export class UserController extends BaseController {
    /**
     * @swagger
     * /v1/user:
     *   post:
     *     summary: Cadastra um usuário (responsável).
     *     tags: [Users]
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
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @PublicRoute()
    @Middlewares(UserValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const newUser: DeepPartial<User> = {
            email: req.body.email,
            password: req.body.password
        };

        await new UserRepository().insert(newUser);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     * /v1/user:
     *   put:
     *     summary: Altera um usuário (responsável)
     *     tags: [Users]
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
     *               id: userId
     *               email: me@mail.com
     *               password: userPassword
     *             required:
     *               - id
     *               - email
     *               - password
     *             properties:
     *               id:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Put()
    @PublicRoute()
    @Middlewares(UserValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const user: User = req.body.userRef;

        user.email = req.body.email;
        user.password = req.body.password;

        await new UserRepository().update(user);

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/user/:
     *   delete:
     *     summary: Apaga um usuário (responsável)
     *     tags: [Users]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Delete()
    @PublicRoute()
    @Middlewares(AuthValidator.authMiddleware, UserValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        const id = AuthValidator.decodeTokenId(req, res);
        if (id) {
            await new UserRepository().delete(id);
            RouteResponse.success('Usuário deletado.', res);
        } else {
            RouteResponse.unauthorizedError(res, 'Erro ao deletar, dados inválidos.');
        }
    }
}
