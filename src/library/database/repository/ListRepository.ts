// Modules
import { IActivityValue } from 'models';
import { DeepPartial, DeleteResult, ObjectID, Repository } from 'typeorm';
import { ActivityRepository } from '.';

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
    public delete(id: string | ObjectID): Promise<DeleteResult> {
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

    /**
     * addActivity
     *
     * Adiciona uma atividade a lista
     *
     * @param id - ID da lista
     * @param idActivity - ID da atividade adicionada
     *
     * @returns Atividade alterada
     */
    public async addActivity(id: string | ObjectID, idActivity: string, value: number): Promise<List | undefined> {
        const list = await this.getConnection().getRepository(List).findOne(id);
        const activity: IActivityValue | undefined = await new ActivityRepository().findOne(idActivity);
        if (list && activity) {
            activity.value = value;
            activity.id = idActivity;
            if (!list.activities) list.activities = new Array(activity);
            else list.activities.push(activity);
            await new ListRepository().delete(id);
            return this.getConnection().getRepository(List).save(list);
        }
        return undefined;
    }

    /**
     * deleteActivitiesFromLists
     *
     * Deleta atividades da lista
     *
     * @param id - ID da atividade
     *
     * @returns Listas alteradas
     */
    public async deleteActivitiesFromLists(id: string): Promise<List[]> {
        const lists = await this.getConnection()
            .getRepository(List)
            .find({
                where: {
                    'activities.id': { $eq: id }
                }
            });
        lists.forEach(list => {
            const item = list.activities.filter(activity => activity.id !== id);
            const upList = new List();
            upList.id = list.id;
            upList.activities = item;
            upList.familyMemberName = list.familyMemberName;
            upList.status = list.status;
            this.update(upList);
            return upList;
        });

        return lists;
    }
}
