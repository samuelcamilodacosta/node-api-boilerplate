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
import { List } from '../../../../library/database/entity';

// Repositories
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
    @Middlewares(AuthValidator.authMiddleware, ListValidator.onlyId())
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
    @Middlewares(AuthValidator.authMiddleware)
    public async getAll(req: Request, res: Response): Promise<void> {
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
     *               familyMemberName: familyMemberName
     *               activitiesId: [1, 2, 3]
     *               valueOfActivities: [-10, 0, 30]
     *               discount: 100
     *               status: Em espera
     *             required:
     *               - familyMemberName
     *               - activitiesId
     *               - valueOfActivities
     *               - discount
     *               - status
     *             properties:
     *               familyMemberName:
     *                 type: string
     *               activitiesId:
     *                 type: string
     *               valueOfActivities:
     *                 type: string
     *               discount:
     *                 type: number
     *               status:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @PublicRoute()
    @Middlewares(AuthValidator.authMiddleware, ListValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const newList: DeepPartial<List> = {
            familyMemberName: req.body.familyMemberName,
            activitiesId: req.body.activitiesId,
            valueOfActivities: req.body.valueOfActivities,
            discount: req.body.discount,
            status: req.body.status
        };

        await new ListRepository().insert(newList);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     * /v1/list:
     *   put:
     *     summary: Altera uma Lista
     *     tags: [List]
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
     *               id: idList
     *               familyMemberName: familyMemberName
     *               activitiesId: [1, 2, 3]
     *               valueOfActivities: [10, 0, 15]
     *               discount: 100
     *               status: Em espera
     *             required:
     *               - familyMemberName
     *               - activitiesId
     *               - valueOfActivities
     *               - discount
     *               - status
     *             properties:
     *               familyMemberName:
     *                 type: string
     *               activitiesId:
     *                 type: string
     *               valueOfActivities:
     *                 type: string
     *               discount:
     *                 type: number
     *               status:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Put()
    @PublicRoute()
    @Middlewares(AuthValidator.authMiddleware, ListValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const list: List = req.body.listRef;

        list.familyMemberName = req.body.familyMemberName;
        list.activitiesId = req.body.activitiesId;
        list.valueOfActivities = req.body.valueOfActivities;
        list.discount = req.body.discount;
        list.status = req.body.status;

        await new ListRepository().update(list);

        RouteResponse.successEmpty(res);
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
    @Middlewares(AuthValidator.authMiddleware, ListValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        await new ListRepository().delete(req.params.id);

        RouteResponse.success(req.params.id, res);
    }
}
