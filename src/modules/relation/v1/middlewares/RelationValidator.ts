// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { ActivityRepository } from '../../../../library/database/repository/ActivityRepository';
import { ListRepository } from '../../../../library/database/repository/ListRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { List, Activity } from '../../../../library/database/entity';

/**
 * ListValidator
 *
 * Classe de validadores para o endpoint da lista
 */
export class RelationValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de listagem
     */
    private static model: Schema = {
        id: {
            ...BaseValidator.validators.id(new ListRepository()),
            in: 'body',
            notEmpty: true,
            errorMessage: 'Essa lista não pode ser alterada.',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;
                    const list: List | undefined = await new ListRepository().findOne(req.body.id);
                    switch (list?.status) {
                        case 'Em aberto':
                            check = true;
                            break;
                        case 'Em espera':
                            check = true;
                            break;
                        case 'Em andamento':
                            check = true;
                            break;
                        default:
                            check = false;
                            break;
                    }
                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        },
        idActivity: {
            in: 'body',
            notEmpty: true,
            errorMessage: 'Não encontramos atividade com esse ID.',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;
                    if (req.body.idActivity) {
                        const activity: Activity | undefined = await new ActivityRepository().findById(req.body.idActivity);
                        if (activity) check = true;
                    }
                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        },
        value: {
            in: 'body',
            notEmpty: true,
            isNumeric: true,
            errorMessage: 'Valor informado inválido.',
            customSanitizer: {
                options: value => {
                    return parseFloat(value.toFixed(2));
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
        return RelationValidator.validationList({ ...RelationValidator.model });
    }

    /**
     * validatorActivity
     *
     * @returns Lista de validadores
     */
    public static validatorActivity(): RequestHandler[] {
        return BaseValidator.validationList({ idActivity: RelationValidator.model.idActivity });
    }
}
