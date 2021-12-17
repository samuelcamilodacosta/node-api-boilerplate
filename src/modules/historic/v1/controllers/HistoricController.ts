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
     * /v1/historic/{name}:
     *   get:
     *     summary: Histórico das listas arquivadas e valor da mesada do membro
     *     tags: [Historic]
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
    @Get('/:name')
    @PublicRoute()
    @Middlewares(AuthValidator.accessPermission)
    public async historic(req: Request, res: Response): Promise<void> {
        const lists = await new ListRepository().findClosedMemberList(req.params.name);
        const member = await new MemberRepository().findByName(req.params.name);
        const allowanceValue = member?.allowanceValue;
        RouteResponse.success({ lists, allowanceValue }, res);
    }
}
