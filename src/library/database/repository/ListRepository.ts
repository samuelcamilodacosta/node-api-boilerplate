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
            return this.update(list);
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
     * findLists
     *
     * Retorna todas as listas do membro de acordo com os parametros de busca
     *
     * @param name - nome do membro da família procurado
     * @param status - status procurado
     *
     * @returns Listas encontradas
     */
    public async findLists(name: string, status: string): Promise<List[]> {
        return this.getConnection()
            .getRepository(List)
            .find({
                where: {
                    status: { $eq: status },
                    familyMemberName: { $eq: name }
                }
            });
    }

    /**
     * findDiscount
     *
     * Soma os valores das atividades que são negativos, totalizando o desconto na lista
     *
     * @param list - Lista do membro com atividades
     *
     * @returns Valor do desconto
     */
    public findDiscount(list: List): number {
        let discount = 0;
        list.activities.forEach(activity => {
            if (activity.value < 0) discount += activity.value;
        });
        return discount;
    }

    public totalDiscount(lists: List[]): number {
        let totalDiscount = 0;
        lists.forEach(list => {
            totalDiscount += this.findDiscount(list);
        });
        return totalDiscount;
    }

    /**
     * countFailedActivities
     *
     * Conta quantas atividades na lista possuem valores negativos
     *
     * @param list - Lista do membro com atividades
     *
     * @returns Quantidade de atividades falhadas
     */
    public countFailedActivities(list: List): number {
        let failed = 0;
        list.activities.forEach(activity => {
            if (activity.value < 0) failed += 1;
        });
        return failed;
    }

    /**
     * arrayCountFailedActivitiesInList
     *
     * Adiciona o valor total de atividades falhadas por lista em um array
     *
     * @param lists - Listas do membro da família
     *
     * @returns Array contendo o total de atividades falhadas em cada lista
     */
    public arrayCountFailedActivitiesInList(lists: List[]): number[] {
        const array: number[] = [];
        lists.forEach(list => {
            array.push(new ListRepository().countFailedActivities(list));
        });
        return array;
    }
}
