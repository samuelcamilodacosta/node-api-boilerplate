// Modules
import { DeepPartial, DeleteResult, Repository } from 'typeorm';

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
     * @param activity - Dados da atividade
     *
     * @returns Atividade adicionada
     */
    public insert(activity: DeepPartial<Activity>): Promise<Activity> {
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
    public update(activity: Activity): Promise<Activity> {
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
}
