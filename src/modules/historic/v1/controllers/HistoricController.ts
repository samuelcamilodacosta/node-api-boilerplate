// Modules
import { Request, Response } from 'express';

// Library
import { BaseController, ListRepository, MemberRepository } from '../../../../library';

// Decorators
import { Controller, Middlewares, PublicRoute, Get } from '../../../../decorators';

// Models
import { EnumEndpoints } from '../../../../models';

// Routes
import { RouteResponse } from '../../../../routes';

// Validators
import { AuthValidator } from '../../../auth/v1';

@Controller(EnumEndpoints.HISTORIC)
export class HistoricController extends BaseController {
    /**
     * @swagger
     * /v1/historic/{name}/closed:
     *   get:
     *     summary: Histórico das listas arquivadas e valor da mesada do membro
     *     tags: [List History]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: name
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get('/:name/closed')
    @PublicRoute()
    @Middlewares(AuthValidator.accessPermission)
    public async listsClosedAndFailedActivities(req: Request, res: Response): Promise<void> {
        const lists = await new ListRepository().findLists(req.params.name, 'Encerrada');

        const totalFailedActivities = new ListRepository().arrayCountFailedActivitiesInList(lists);

        RouteResponse.success({ lists, totalFailedActivities }, res);
    }

    /**
     * @swagger
     * /v1/historic/{name}/inprogress:
     *   get:
     *     summary: Histórico das listas em andamento
     *     tags: [List History]
     *     consumes:
     *       - application/json
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     parameters:
     *       - in: path
     *         name: name
     *         schema:
     *           type: string
     *         required: true
     *     responses:
     *       $ref: '#/components/responses/baseResponse'
     */
    @Get('/:name/inprogress')
    @PublicRoute()
    @Middlewares(AuthValidator.accessPermission)
    public async listsInProgress(req: Request, res: Response): Promise<void> {
        const lists = await new ListRepository().findLists(req.params.name, 'Em andamento');
        const member = await new MemberRepository().findByName(req.params.name);
        const totalDiscount = new ListRepository().totalDiscount(lists);
        const allowanceValue = member?.allowanceValue;
        RouteResponse.success({ lists, totalDiscount, allowanceValue }, res);
    }
}
