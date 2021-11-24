// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { ClientRepository } from '../../../../library/database/repository/ClientRepository';

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
        name: ClientValidator.validators.name,
        email: ClientValidator.validators.email,
        phone: ClientValidator.validators.phone,
        status: ClientValidator.validators.status,
        id: {
            ...ClientValidator.validators.id(new ClientRepository()),
            errorMessage: 'Cliente não encontrado'
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
