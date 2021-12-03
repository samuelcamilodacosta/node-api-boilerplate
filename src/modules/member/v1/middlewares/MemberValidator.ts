// Libraries
import { RequestHandler } from 'express';
import { Schema } from 'express-validator';

// Repositories
import { MemberRepository } from '../../../../library/database/repository/MemberRepository';

// Validators
import { BaseValidator } from '../../../../library/BaseValidator';

// Entities
import { Member } from '../../../../library/database/entity';

/**
 * MemberValidator
 *
 * Classe de validadores para o endpoint de membros da família
 */
export class MemberValidator extends BaseValidator {
    /**
     * model
     *
     * Schema para validação no controller de membros
     */
    private static model: Schema = {
        id: {
            ...BaseValidator.validators.id(new MemberRepository()),
            errorMessage: 'Membro da família não encontrado'
        },
        name: {
            in: 'body',
            isString: true,
            errorMessage: 'Nome inválido',
            isLength: {
                options: {
                    min: 3
                }
            }
        },
        birthDate: {
            in: 'body',
            isDate: true,
            errorMessage: 'Data inválida.'
        },
        allowanceValue: {
            in: 'body',
            isNumeric: true,
            errorMessage: 'Mesada inválida'
        },
        duplicate: {
            errorMessage: 'Nome já cadastrado.',
            custom: {
                options: async (_: string, { req }) => {
                    let check = false;

                    if (req.body.name) {
                        const memberRepository: MemberRepository = new MemberRepository();
                        const member: Member | undefined = await memberRepository.findByName(req.body.name);

                        check = member ? req.body.id === member.id.toString() : true;
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
        return MemberValidator.validationList({ ...MemberValidator.model });
    }

    /**
     * put
     *
     * @returns Lista de validadores
     */
    public static put(): RequestHandler[] {
        return MemberValidator.validationList({
            id: MemberValidator.model.id,
            ...MemberValidator.model
        });
    }

    /**
     * onlyId
     *
     * @returns Lista de validadores
     */
    public static onlyId(): RequestHandler[] {
        return BaseValidator.validationList({
            id: MemberValidator.model.id
        });
    }
}