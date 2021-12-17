// Modules
import { DeepPartial } from 'typeorm';
import { Request, Response } from 'express';

// Library
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Delete, Middlewares, Post, PublicRoute, Get, Patch } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Entities
import { List } from '../../../../library/database/entity';

// Repositoriess
import { ListRepository } from '../../../../library/database/repository';

// Validators
import { ListValidator } from '../middlewares/ListValidator';
import { AuthValidator } from '../../../auth/v1';

@Controller(EnumEndpoints.LIST)
export class ListController extends BaseController {
    /**
     * @swagger
     * /v1/list/{id}:
     *   get:
     *     summary: Encontra uma Lista pelo ID.
     *     tags: [List]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get('/:id')
    @PublicRoute()
    @Middlewares(AuthValidator.accessPermission, ListValidator.onlyId())
    public async getListById(req: Request, res: Response): Promise<void> {
        RouteResponse.success({ ...req.body.listRef }, res);
    }

    /**
     * @swagger
     * /v1/list:
     *   get:
     *     summary: Mostra todas as Listas.
     *     tags: [List]
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
    @Middlewares(AuthValidator.accessPermission)
    public async getAllList(req: Request, res: Response): Promise<void> {
        const [rows, count] = await new ListRepository().list<List>(ListController.listParams(req));

        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     * /v1/list:
     *   post:
     *     summary: Cria uma Lista.
     *     tags: [List]
     *     consumes:
     *       - application/json:
     *     produces:
     *       - application/json:
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               familyMemberName: familyMemberName
     *               status: Em espera
     *             required:
     *               - familyMemberName
     *               - status
     *             properties:
     *               familyMemberName:
     *                 type: string
     *               status:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @PublicRoute()
    @Middlewares(AuthValidator.accessPermission, ListValidator.post())
    public async registerList(req: Request, res: Response): Promise<void> {
        const newList: DeepPartial<List> = {
            familyMemberName: req.body.familyMemberName,
            status: req.body.status
        };

        await new ListRepository().insert(newList);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     * /v1/list/{id}:
     *   patch:
     *     summary: Atualiza status de uma Lista
     *     tags: [List]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             example:
     *               status: Encerrada
     *             required:
     *               - status
     *             properties:
     *               status:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Patch('/:id')
    @PublicRoute()
    @Middlewares(AuthValidator.accessPermission, ListValidator.patch())
    public async changeStatusList(req: Request, res: Response): Promise<void> {
        const list = await new ListRepository().findById(req.params.id);

        if (list) {
            list.status = req.body.status;
            await new ListRepository().update(list);

            RouteResponse.success(list, res);
        }
        RouteResponse.error('Failed to patch list', res);
    }

    /**
     * @swagger
     * /v1/list/{id}:
     *   delete:
     *     summary: Apaga uma Lista
     *     tags: [List]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Delete('/:id')
    @PublicRoute()
    @Middlewares(AuthValidator.accessPermission, ListValidator.onlyId())
    public async deleteList(req: Request, res: Response): Promise<void> {
        await new ListRepository().delete(req.params.id);

        RouteResponse.success(req.params.id, res);
    }
}
