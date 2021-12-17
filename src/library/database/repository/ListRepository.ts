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
     * findListsWithActivityId
     *
     * Retorna todas as listas que possuem determinada atividade
     *
     * @param id - ID da atividade
     *
     * @returns Listas encontradas
     */
    public async findListsWithActivityId(id: string): Promise<List[]> {
        return this.getConnection()
            .getRepository(List)
            .find({
                where: {
                    status: { $not: { $eq: 'Encerrada' } },
                    'activities.id': { $eq: id }
                }
            });
    }

    /**
     * deleteActivityFromLists
     *
     * Deleta uma atividade de todas as listas passadas
     *
     * @param lists - Lista de membros relacionadas com atividades
     * @param id - ID da atividade
     *
     * @returns Lista com todos os membros com exclusão da atividade passada.
     */
    public deleteActivityFromLists(lists: List[], id: string): List[] {
        lists.forEach(list => {
            const activities = this.filterActivitiesById(list, id);
            const updateList = list;
            updateList.activities = activities;
            this.update(updateList);
            return updateList;
        });
        return lists;
    }

    /**
     * filterActivitiesById
     *
     * Filtra uma lista de atividades removendo atividades que possuam o id informado
     *
     * @param list - Lista do membro com atividades
     * @param id - ID da atividade para remover
     *
     * @returns lista de atividades
     */
    public filterActivitiesById(list: List, id: string): IActivityValue[] {
        return list.activities.filter(activity => activity.id !== id);
    }

    /**
     * findClosedMemberList
     *
     * Retorna todas as listas do membro informado encerradas
     *
     * @param name - family member name searched
     *
     * @returns Listas encontradas
     */
    public async findClosedMemberList(name: string): Promise<List[]> {
        return this.getConnection()
            .getRepository(List)
            .find({
                where: {
                    status: { $eq: 'Encerrada' },
                    familyMemberName: { $eq: name }
                }
            });
    }
}
