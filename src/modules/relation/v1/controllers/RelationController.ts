// Modules
import { Request, Response } from 'express';

// Library
import { BaseController } from '../../../../library';

// Decorators
import { Controller, Delete, Middlewares, Post, PublicRoute } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Repositoriess
import { ListRepository } from '../../../../library/database/repository';

// Validators
import { AuthValidator } from '../../../auth/v1';
import { RelationValidator } from '../middlewares/RelationValidator';

@Controller(EnumEndpoints.RELATION)
export class RelationController extends BaseController {
    /**
     * @swagger
     * /v1/relation:
     *   post:
     *     summary: Adiciona atividades a lista
     *     tags: [List Activity]
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
     *               idActivity: idActivity
     *               value: -10
     *             required:
     *               - id
     *               - idActivity
     *               - value
     *             properties:
     *               id:
     *                 type: string
     *               idActivity:
     *                 type: string
     *               value:
     *                 type: number
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Post()
    @PublicRoute()
    @Middlewares(AuthValidator.accessPermission, RelationValidator.post())
    public async addActivity(req: Request, res: Response): Promise<void> {
        await new ListRepository().addActivity(req.body.id, req.body.idActivity, req.body.value);
        RouteResponse.successEmpty(res);
    }

    /**
     * @swagger
     * /v1/relation/{id}:
     *   delete:
     *     summary: Apaga uma atividade de todas as listas
     *     tags: [List Activity]
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
    @Middlewares(AuthValidator.accessPermission, RelationValidator.validatorActivity())
    public async remove(req: Request, res: Response): Promise<void> {
        await new ListRepository().deleteActivitiesFromLists(req.params.id);
        RouteResponse.successEmpty(res);
    }
}
