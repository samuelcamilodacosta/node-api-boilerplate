// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { UserRepository } from '../../../../library/database/repository/UserRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { User } from '../../../../library/database/entity';

/**
 * UserValidator
 *
 * Classe de validadores para o endpoint de usuários
 */
export class UserValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de usuários
     */
    public static model: Schema = {
        id: {
            ...BaseValidator.validators.id(new UserRepository()),
            errorMessage: 'Usuário não encontrado'
        },
        email: {
            in: 'body',
            isEmail: true,
            errorMessage: 'E-mail inválido'
        },
        password: {
            in: 'body',
            isString: true,
            isStrongPassword: {
                options: {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1
                }
            },
            errorMessage:
                'Senha muito fraca. A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial.'
        },
        duplicate: {
            errorMessage: 'E-mail já se encontra em uso.',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.email) {
                        const userRepository: UserRepository = new UserRepository();
                        const user: User | undefined = await userRepository.findByEmail(req.body.email);

                        check = user ? req.body.id === user.id.toString() : true;
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
        return UserValidator.validationList({ ...UserValidator.model });
    }

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return UserValidator.validationList({
            id: UserValidator.model.id,
            password: UserValidator.model.password
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: UserValidator.model.id
        });
    }
}
