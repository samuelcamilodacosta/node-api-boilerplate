// Modules
import { DeepPartial, DeleteResult, Repository } from 'typeorm';

// Entities
import { Client } from '../entity';

// Repositories
import { BaseRepository } from './BaseRepository';

/**
 * ClientRepository
 *
 * Repositório da tabela de clientes e métodos para manipulação de dados.
 */
export class ClientRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = Client;
    }

    /**
     * insert
     *
     * Adiciona um novo cliente no BD
     *
     * @param {DeepPartial} client - Dados do cliente
     *
     * @returns Cliente adicionado
     */
    public insert(client: DeepPartial<Client>): Promise<Client> {
        const clientRepository: Repository<Client> = this.getConnection().getRepository(Client);
        return clientRepository.save(clientRepository.create(client));
    }

    /**
     * update
     *
     * Altera dados de um cliente no BD
     *
     * @param client - Dados a serem alterados no cliente
     *
     * @returns Cliente alterado
     */
    public update(client: Client): Promise<Client> {
        return this.getConnection().getRepository(Client).save(client);
    }

    /**
     * delete
     *
     * Remove um cliente pelo ID
     *
     * @param id - ID do cliente
     *
     * @returns Resultado da remoção
     */
    public delete(id: string): Promise<DeleteResult> {
        return this.getConnection().getRepository(Client).delete(id);
    }

    /**
     * findByEmail.
     *
     * Busca um email na lista de email de clientes
     *
     * @param email - email do cliente.
     * @returns Cliente encontrado
     */
    public findByEmail(email: string): Promise<Client | undefined> {
        return this.getConnection().getRepository(Client).findOne({ email });
    }
}
