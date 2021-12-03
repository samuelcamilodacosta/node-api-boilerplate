// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { MemberRepository } from '../../../../library/database/repository/MemberRepository';
import { ListRepository } from '../../../../library/database/repository/ListRepository';
import { ActivityRepository } from '../../../../library/database/repository/ActivityRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { Activity, Member } from '../../../../library/database/entity';

/**
 * ListValidator
 *
 * Classe de validadores para o endpoint da lista
 */
export class ListValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de listagem
     */
    private static model: Schema = {
        id: {
            ...BaseValidator.validators.id(new ListRepository()),
            errorMessage: 'Lista não encontrada'
        },
        familyMemberName: {
            in: 'body',
            isString: true,
            isLength: {
                options: {
                    min: 3
                }
            },
            errorMessage: 'Nome inválido.',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.familyMemberName) {
                        const memberRepository: MemberRepository = new MemberRepository();
                        const member: Member | undefined = await memberRepository.findByName(req.body.familyMemberName);

                        check = member ? req.body.familyMemberName === member.name.toString() : true;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        },
        activitiesId: {
            in: 'body',
            errorMessage: 'ID das atividades inválido.',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.activitiesId) {
                        const array: number[] = req.body.activitiesId;
                        const activityRepository: ActivityRepository = new ActivityRepository();
                        array.forEach(async id => {
                            const activity: Activity | undefined = await activityRepository.findById(id);
                            if (activity === undefined) {
                                check = true;
                            }
                        });
                    }
                    return check ? Promise.resolve() : Promise.reject();
                }
            },
            customSanitizer: {
                options: value => {
                    return value.toString();
                }
            }
        },
        valueOfActivities: {
            in: 'body',
            notEmpty: true,
            errorMessage: 'Valor das atividades inválido.',
            customSanitizer: {
                options: value => {
                    return value.toString();
                }
            }
        },
        discount: {
            in: 'body',
            isNumeric: true,
            notEmpty: true,
            trim: true,
            errorMessage: 'Valor da mesada inválido.'
        },
        status: {
            in: 'body',
            notEmpty: true,
            errorMessage: 'Status inválido.',
            customSanitizer: {
                options: async (_: string, { req }) => {
                    let check = false;
                    switch (req.body.status) {
                        case 'Em espera':
                            check = false;
                            break;
                        case 'Em andamento':
                            check = false;
                            break;
                        case 'Encerrada':
                            check = false;
                            break;
                        default:
                            check = true;
                            break;
                    }
                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        }
    };

    /**
     * post
     *
     * @returns Lista de validadores
     */
    public static post(): RequestHandler[] {
        return ListValidator.validationList({ ...ListValidator.model });
    }

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return ListValidator.validationList({
            id: ListValidator.model.id,
            ...ListValidator.model
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: ListValidator.model.id
        });
    }
}
