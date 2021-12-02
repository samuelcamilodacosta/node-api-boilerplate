// Modules
import { DeepPartial, DeleteResult, Repository } from 'typeorm';

// Entities
import { List } from '../entity';

// Repositories
import { BaseRepository } from './BaseRepository';

/**
 * ListRepository
 *
 * Repositório para tabela de Lista de Marcação
 */
export class ListRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = List;
    }

    /**
     * insert
     *
     * Adiciona uma nova Lista
     *
     * @param list - Dados da lista
     *
     * @returns Lista adicionada
     */
    public insert(list: DeepPartial<List>): Promise<List> {
        const listRepository: Repository<List> = this.getConnection().getRepository(List);
        return listRepository.save(listRepository.create(list));
    }

    /**
     * update
     *
     * Altera a lista
     *
     * @param list - Dados da lista
     *
     * @returns Atividade alterada
     */
    public update(list: List): Promise<List> {
        return this.getConnection().getRepository(List).save(list);
    }

    /**
     * delete
     *
     * Remove uma lista pelo ID
     *
     * @param id - ID da lista
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(List).delete(id);
    }

    /**
     * findById
     *
     * Busca uma lista pelo id
     *
     * @param id - ID da Lista
     *
     * @returns Lista procurada
     */
    public findById(id: string): Promise<List | undefined> {
        return this.getConnection().getRepository(List).findOne(id);
    }
}
