// Modules
import { DeepPartial, DeleteResult, Repository } from 'typeorm';
import { ListRepository } from '.';

// Entities
import { Activity } from '../entity';

// Repositories
import { BaseRepository } from './BaseRepository';

/**
 * AcitivityRepository
 *
 * Repositório para tabela de atividades
 */
export class ActivityRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Activity;
    }

    /**
     * insert
     *
     * Adiciona uma nova atividade
     *
     * @param description - Descrição da atividade
     *
     * @returns Atividade adicionada
     */
    public insert(description: string): Promise<Activity> {
        const activity: DeepPartial<Activity> = {
            description
        };
        const userRepository: Repository<Activity> = this.getConnection().getRepository(Activity);
        return userRepository.save(userRepository.create(activity));
    }

    /**
     * update
     *
     * Altera uma atividade
     *
     * @param activity - Dados da atividade
     *
     * @returns Atividade alterada
     */
    public async update(activity: Activity): Promise<Activity> {
        const lists = await new ListRepository().findListsWithActivityId(activity.id);
        new ListRepository().deleteActivityFromLists(lists, activity.id);
        this.getConnection().getRepository(Activity).delete(activity.id);
        return this.getConnection().getRepository(Activity).save(activity);
    }

    /**
     * delete
     *
     * Remove uma atividade pelo ID
     *
     * @param id - ID da atividade
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(Activity).delete(id);
    }

    /**
     * findByDescription
     *
     * Busca uma atividade pela descrição
     *
     * @param description - Descrição da atividade
     *
     * @returns Atividade buscada
     */
    public findByDescription(description: string): Promise<Activity | undefined> {
        return this.getConnection().getRepository(Activity).findOne({ description });
    }

    /**
     * findById
     *
     * Busca uma atividade pelo id
     *
     * @param id - ID da Atividade
     *
     * @returns Atividade procurada
     */
    public findById(id: string): Promise<Activity | undefined> {
        return this.getConnection().getRepository(Activity).findOne(id);
    }
}
