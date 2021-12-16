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
     *     summary: Cadastrar nova senha (responsável)
     *     tags: [Users]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               password: newPassword
     *             required:
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
    @Middlewares(AuthValidator.accessPermission, UserValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const newUser: User = new User();
        const email = AuthValidator.decodeTokenEmail(req, res);
        const userRepository: UserRepository = new UserRepository();

        if (email) {
            const user = await userRepository.findByEmail(email);

            if (user) newUser.id = user.id;
            newUser.email = email;
            newUser.password = req.body.password;

            await new UserRepository().update(newUser);

            RouteResponse.successEmpty(res);
        }
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
    @Middlewares(AuthValidator.accessPermission, UserValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        const email = AuthValidator.decodeTokenEmail(req, res);
        const userRepository: UserRepository = new UserRepository();

        if (email) {
            const user = await userRepository.findByEmail(email);
            if (user) {
                await new UserRepository().delete(user.id);
                RouteResponse.success('Usuário deletado.', res);
            }
        }
        RouteResponse.error('Erro ao deletar, dados inválidos.', res);
    }
}
