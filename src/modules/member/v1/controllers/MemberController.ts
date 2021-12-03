// Modules
import { DeepPartial } from 'typeorm';
import { Request, Response } from 'express';

// Library
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Delete, Middlewares, Post, PublicRoute, Put, Get } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Entities
import { Member } from '../../../../library/database/entity';

// Repositories
import { MemberRepository } from '../../../../library/database/repository';

// Validators
import { MemberValidator } from '../middlewares/MemberValidator';
import { AuthValidator } from '../../../auth/v1';

@Controller(EnumEndpoints.MEMBER)
export class MemberController extends BaseController {
    /**
     * @swagger
     * /v1/member:
     *   get:
     *     summary: Mostra todos os membros da família cadastrados.
     *     tags: [Member]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - $ref: '#/components/parameters/listPageRef'
     *       - $ref: '#/components/parameters/listSizeRef'
     *       - $ref: '#/components/parameters/listOrderRef'
     *       - $ref: '#/components/parameters/listOrderByRef'
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get()
    @PublicRoute()
    @Middlewares(AuthValidator.authMiddleware)
    public async getAll(req: Request, res: Response): Promise<void> {
        const [rows, count] = await new MemberRepository().list<Member>(MemberController.listParams(req));
        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     * /v1/member:
     *   post:
     *     summary: Cadastra um membro da família.
     *     tags: [Member]
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
     *               name: memberName
     *               birthDate: 10/10/2000
     *               allowanceValue: 1000.00
     *             required:
     *               - name
     *               - birthDate
     *               - allowanceValue
     *             properties:
     *               name:
     *                 type: string
     *               birthDate:
     *                 type: string
     *               allowanceValue:
     *                 type: number
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @PublicRoute()
    @Middlewares(AuthValidator.authMiddleware, MemberValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const newUser: DeepPartial<Member> = {
            name: req.body.name,
            birthDate: req.body.birthDate,
            allowanceValue: req.body.allowanceValue
        };

        await new MemberRepository().insert(newUser);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     * /v1/member:
     *   put:
     *     summary: Altera um membro da família.
     *     tags: [Member]
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
     *               id: userId
     *               name: memberName
     *               birthDate: 10/10/2000
     *               allowanceValue: 1000.00
     *             required:
     *               - id
     *               - name
     *               - birthDate
     *               - allowanceValue
     *             properties:
     *               id:
     *                 type: string
     *               name:
     *                 type: string
     *               birthDate:
     *                 type: string
     *               allowanceValue:
     *                 type: number
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Put()
    @PublicRoute()
    @Middlewares(AuthValidator.authMiddleware, MemberValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const member: Member = req.body.memberRef;

        member.name = req.body.name;
        member.birthDate = req.body.birthDate;
        member.allowanceValue = req.body.allowanceValue;

        await new MemberRepository().update(member);

        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/member/{memberId}:
     *   delete:
     *     summary: Apaga um membro da família.
     *     tags: [Member]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: memberId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Delete('/:id')
    @PublicRoute()
    @Middlewares(AuthValidator.authMiddleware, MemberValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        await new MemberRepository().delete(req.params.id);

        RouteResponse.success(req.params.id, res);
    }
}
