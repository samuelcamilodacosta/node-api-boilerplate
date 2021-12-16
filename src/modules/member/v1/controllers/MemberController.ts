// Modules
import { DeepPartial } from 'typeorm';
import { Request, Response } from 'express';

// Library
import { BaseController } from '../../../../library';
import { FileUtils } from '../../../../utils';

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
    @Middlewares(AuthValidator.accessPermission)
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
     *       - multipart/form-data
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - photo
     *               - birthDate
     *               - allowanceValue
     *             properties:
     *               name:
     *                 type: string
     *               photo:
     *                 type: string
     *                 format: base64
     *               birthDate:
     *                 type: string
     *               allowanceValue:
     *                 type: number
     *             encoding:
     *               photo:
     *                 contentType: image/png, image/jpeg
     *     responses:
     *       $ref: '#/components/responses/baseCreate'
     */
    @Post()
    @PublicRoute()
    @Middlewares(AuthValidator.accessPermission, MemberValidator.post())
    public async add(req: Request, res: Response): Promise<void> {
        const photo: string | undefined = FileUtils.savePhoto(req, res);

        if (!photo) RouteResponse.error('Image not found', res);

        const newUser: DeepPartial<Member> = {
            name: req.body.name,
            photo,
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
     *       - multipart/form-data:
     *     produces:
     *       - application/json
     *     security:
     *       - BearerAuth: []
     *     requestBody:
     *       content:
     *         multipart/form-data::
     *           schema:
     *             type: object
     *             example:
     *               id: userId
     *               name: memberName
     *               birthDate: 10/10/2000
     *               allowanceValue: 1000.50
     *             required:
     *               - id
     *               - name
     *               - photo
     *               - birthDate
     *               - allowanceValue
     *             properties:
     *               id:
     *                 type: string
     *               name:
     *                 type: string
     *               photo:
     *                 type: string
     *                 format: base64
     *               birthDate:
     *                 type: string
     *               allowanceValue:
     *                 type: number
     *     responses:
     *       $ref: '#/components/responses/baseEmpty'
     */
    @Put()
    @PublicRoute()
    @Middlewares(AuthValidator.accessPermission, MemberValidator.put())
    public async update(req: Request, res: Response): Promise<void> {
        const photo: string | undefined = FileUtils.savePhoto(req, res);

        if (photo) {
            const newMember: Member = req.body.memberRef;

            const member = await new MemberRepository().findById(req.body.id);
            if (member) FileUtils.deletePhoto(member.photo);

            newMember.name = req.body.name;
            newMember.photo = photo;
            newMember.birthDate = req.body.birthDate;
            newMember.allowanceValue = req.body.allowanceValue;

            await new MemberRepository().update(newMember);

            RouteResponse.successEmpty(res);
        }

        RouteResponse.error('Image not upload', res);
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
    @Middlewares(AuthValidator.accessPermission, MemberValidator.onlyId())
    public async remove(req: Request, res: Response): Promise<void> {
        const member = await new MemberRepository().findById(req.params.id);

        if (member) FileUtils.deletePhoto(member.photo);

        await new MemberRepository().delete(req.params.id);

        RouteResponse.success(req.params.id, res);
    }
}
