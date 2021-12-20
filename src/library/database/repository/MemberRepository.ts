// Modules
import { DeepPartial, DeleteResult, ObjectID, Repository } from 'typeorm';

// Entities
import { Member } from '../entity';

// Repositories
import { BaseRepository } from './BaseRepository';

/**
 * MemberRepository
 *
 * Repositório para tabela de membros da família
 */
export class MemberRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Member;
    }

    /**
     * insert
     *
     * Adiciona um novo membro da família
     *
     * @param member - Dados do membro da família
     *
     * @returns Membro da família adicionado
     */
    public insert(member: DeepPartial<Member>): Promise<Member> {
        const memberRepository: Repository<Member> = this.getConnection().getRepository(Member);
        return memberRepository.save(memberRepository.create(member));
    }

    /**
     * update
     *
     * Altera um membro da família
     *
     * @param member - Dados do membro da família
     *
     * @returns Membro da família alterado
     */
    public update(member: Member): Promise<Member> {
        return this.getConnection().getRepository(Member).save(member);
    }

    /**
     * delete
     *
     * Remove um membro da família pelo ID
     *
     * @param id - ID do membro da família
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(Member).delete(id);
    }

    /**
     * findById
     *
     * Busca um membro da família pelo ID
     *
     * @param id - ID do membro da família
     *
     * @returns Dados do membro buscado
     */
    public findById(id: string | ObjectID): Promise<Member | undefined> {
        return this.getConnection().getRepository(Member).findOne(id);
    }

    /**
     * findByName
     *
     * Busca um membro da família pelo nome
     *
     * @param name - Nome do membro da família
     *
     * @returns Dados do membro buscado
     */
    public findByName(name: string): Promise<Member | undefined> {
        return this.getConnection().getRepository(Member).findOne({ name });
    }
}
