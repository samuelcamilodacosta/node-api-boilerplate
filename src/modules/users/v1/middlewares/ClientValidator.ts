// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { ClientRepository } from '../../../../library/database/repository/ClientRepository';

// Utils
import { StringUtils } from '../../../../utils';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { Client } from '../../../../library/database/entity';

/**
 * ClientValidator
 *
 * Classe de validadores para o endpoint de clientes
 */
export class ClientValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de clientes
     */
    private static model: Schema = {
        id: {
            ...ClientValidator.validators.id(new ClientRepository()),
            errorMessage: 'Cliente não encontrado'
        },
        name: {
            in: 'body',
            isString: true,
            isLength: {
                options: {
                    min: 3
                }
            },
            customSanitizer: {
                options: (value: string) => {
                    if (typeof value === 'string') {
                        return StringUtils.firstUpperCase(value);
                    }

                    return undefined;
                }
            },
            errorMessage: 'Nome inválido'
        },
        email: {
            in: 'body',
            isEmail: true,
            errorMessage: 'Email inválido'
        },
        phone: {
            in: 'body',
            isString: true,
            matches: {
                options: [/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/]
            },
            errorMessage: 'Telefone inválido'
        },
        status: {
            in: 'body',
            isBoolean: true,
            optional: true,
            errorMessage: 'Status inválido'
        },
        duplicate: {
            errorMessage: 'Email já cadastrado',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.email) {
                        const clientRepository: ClientRepository = new ClientRepository();
                        const client: Client | undefined = await clientRepository.findByEmail(req.body.email);
                        check = client ? req.body.id === client.id.toString() : true;
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
        const dataClient = { ...ClientValidator.model };
        delete dataClient.id;
        return ClientValidator.validationList({ ...dataClient });
    }

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return ClientValidator.validationList({
            id: ClientValidator.model.id,
            ...ClientValidator.model
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: ClientValidator.model.id
        });
    }
}
