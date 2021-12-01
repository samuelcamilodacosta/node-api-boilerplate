// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { ActivityRepository } from '../../../../library/database/repository/ActivityRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { Activity } from '../../../../library/database/entity';

/**
 * ActivityValidator
 *
 * Classe de validadores para o endpoint de atividades
 */
export class ActivityValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de usuários
     */
    private static model: Schema = {
        id: {
            ...BaseValidator.validators.id(new ActivityRepository()),
            errorMessage: 'Atividade não encontrada'
        },
        description: {
            in: 'body',
            isString: true,
            isLength: {
                options: {
                    min: 5
                }
            },
            errorMessage: 'Descrição muito curta.'
        },
        duplicate: {
            errorMessage: 'Já existe essa atividade cadastrada',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.description) {
                        const activityRepository: ActivityRepository = new ActivityRepository();
                        const activity: Activity | undefined = await activityRepository.findByDescription(req.body.description);

                        check = activity ? req.body.id === activity.id.toString() : true;
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
        return ActivityValidator.validationList({ ...ActivityValidator.model });
    }

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return ActivityValidator.validationList({
            id: ActivityValidator.model.id,
            ...ActivityValidator.model
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: ActivityValidator.model.id
        });
    }
}
