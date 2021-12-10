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
import { Activity } from '../../../../library/database/entity';

// Repositories
import { ActivityRepository } from '../../../../library/database/repository';

// Validators
import { ActivityValidator } from '../middlewares/ActivityValidator';
import { AuthValidator } from '../../../auth/v1';

@Controller(EnumEndpoints.ACTIVITY)
export class ActivityController extends BaseController {
    /**
     * @swagger
     * /v1/activity:
     *   get:
     *     summary: Lista todas as atividades.
     *     tags: [Activity]
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
        const [rows, count] = await new ActivityRepository().list<Activity>(ActivityController.listParams(req));
        RouteResponse.success({ rows, count }, res);
    }

    /**
     * @swagger
     * /v1/activity/{activityId}:
     *   get:
     *     summary: Busca uma atividade específica
     *     tags: [Activity]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: activityId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get('/:id')
    @PublicRoute()
    @Middlewares(AuthValidator.accessPermission, ActivityValidator.onlyId())
    public async search(req: Request, res: Response): Promise<void> {
        const data = await new ActivityRepository().findById(req.params.id);
        RouteResponse.success(data, res);
    }

    /**
     * @swagger
     * /v1/activity:
     *   post:
     *     summary: Cadastra uma atividade.
     *     tags: [Activity]
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
     *               description: activityDescription
     *             required:
     *               - description
     *             properties:
     *               description:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @PublicRoute()
    @Middlewares(AuthValidator.accessPermission, ActivityValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const newActivity: DeepPartial<Activity> = {
            description: req.body.description
        };

        await new ActivityRepository().insert(newActivity);

        RouteResponse.successCreate(res);
    }

    /**
     * @swagger
     * /v1/activity:
     *   put:
     *     summary: Altera uma atividade
     *     tags: [Activity]
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
     *               id: activityId
     *               description: newActivityDescription
     *             required:
     *               - id
     *               - description
     *             properties:
     *               id:
     *                 type: string
     *               description:
     *                 type: string
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Put()
    @PublicRoute()
    @Middlewares(AuthValidator.accessPermission, ActivityValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const activity: Activity = req.body.activityRef;

        activity.description = req.body.description;
        await new ActivityRepository().update(activity);
        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/activity/{activityId}:
     *   delete:
     *     summary: Apaga uma atividade
     *     tags: [Activity]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: activityId
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Delete('/:id')
    @PublicRoute()
    @Middlewares(AuthValidator.accessPermission, ActivityValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        await new ActivityRepository().delete(req.params.id);
        RouteResponse.success(req.params.id, res);
    }
}
