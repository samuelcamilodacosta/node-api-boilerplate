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
     *               listId: [1,2]
     *               values: [10,-20]
     *               activities: [ "id": "1", "id": "2"]
     *             required:
     *               - familyMemberName
     *               - status
     *               - listId
     *               - values
     *               - activities
     *             properties:
     *               familyMemberName:
     *                 type: string
     *               status:
     *                 type: string
     *               listId:
     *                 type: number[]
     *               values:
     *                 type: number[]
     *               activities:
     *                 type: object
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @PublicRoute()
    @Middlewares(AuthValidator.accessPermission, ListValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const { familyMemberName, status, listId, values, activities } = req.body;
        const array = values.split(',');
        let discount = 0;
        array.forEach((element: string) => {
            if (Number(element) < 0) discount += Number(element);
        });
        const newList: DeepPartial<List> = {
            familyMemberName,
            discount,
            status,
            listId,
            values,
            activities
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
     *               values: [10, 0, 15]
     *               status: Em espera
     *               activities: [ "id": "1", "id": "2"]
     *             required:
     *               - familyMemberName
     *               - values
     *               - status
     *               - activities
     *             properties:
     *               familyMemberName:
     *                 type: string
     *               values:
     *                 type: number[]
     *               status:
     *                 type: string
     *               activities:
     *                 type: object
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Put()
    @PublicRoute()
    @Middlewares(AuthValidator.accessPermission, ListValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const { familyMemberName, values, status, activities, listRef } = req.body;
        const discount = ListValidator.findDiscount(values);
        const list: List = listRef;

        list.familyMemberName = familyMemberName;
        list.values = values;
        list.discount = discount;
        list.status = status;
        list.activities = [];
        await new ListRepository().update(list);
        list.activities = activities;
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
    @Middlewares(AuthValidator.accessPermission, ListValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        await new ListRepository().delete(req.params.id);

        RouteResponse.success(req.params.id, res);
    }
}
