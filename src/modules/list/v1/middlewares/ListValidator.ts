// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { MemberRepository } from '../../../../library/database/repository/MemberRepository';
import { ListRepository } from '../../../../library/database/repository/ListRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { Member, List } from '../../../../library/database/entity';

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

                        if (member) check = true;
                    }

                    return check ? Promise.resolve() : Promise.reject();
                }
            }
        },
        discount: {
            in: 'body',
            errorMessage: 'Valor de desconto inválido.'
        },
        status: {
            in: 'body',
            notEmpty: true,
            errorMessage: 'Status inválido.',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;
                    switch (req.body.status) {
                        case 'Em espera':
                            check = true;
                            break;
                        case 'Em andamento':
                            check = true;
                            break;
                        case 'Encerrada':
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
        listId: {
            in: 'body',
            isArray: true,
            notEmpty: true,
            errorMessage: 'Lista de IDs inválidos.',
            customSanitizer: {
                options: listId => {
                    return listId.toString();
                }
            }
        },
        values: {
            in: 'body',
            isArray: true,
            notEmpty: true,
            errorMessage: 'Valores inválidos.',
            customSanitizer: {
                options: values => {
                    return values.toString();
                }
            }
        },
        unique: {
            errorMessage: 'Esse usuário já possui uma lista em andamento',
            custom: {
                options: async (_: string, { req }) => {
                    let check = true;
                    const [rows] = await new ListRepository().list<List>(req.body.familyMemberName);
                    if (req.body.status === 'Em andamento') {
                        rows.forEach(element => {
                            if (element.status === 'Em andamento') check = false;
                        });
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

    public static findDiscount(values: string): number {
        const array = values.split(',');
        let sum = 0;
        array.forEach((element: string) => {
            if (Number(element) < 0) sum += Number(element);
        });
        return sum;
    }
}
