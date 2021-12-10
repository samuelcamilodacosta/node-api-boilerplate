// Modules
import { DeepPartial, DeleteResult, ObjectID, Repository } from 'typeorm';

// Entities
import { User } from '../entity';

// Repositories
import { BaseRepository } from './BaseRepository';

/**
 * UserRepository
 *
 * Repositório para tabela de usuários
 */
export class UserRepository extends BaseRepository {
    constructor() {
        super();
        this.entity = User;
    }

    /**
     * insert
     *
     * Adiciona um novo usuário
     *
     * @param user - Dados do usuário
     *
     * @returns Usuário adicionado
     */
    public insert(user: DeepPartial<User>): Promise<User> {
        const userRepository: Repository<User> = this.getConnection().getRepository(User);
        return userRepository.save(userRepository.create(user));
    }

    /**
     * update
     *
     * Altera um usuário
     *
     * @param user - Dados do usuário
     *
     * @returns Usuário alterado
     */
    public update(user: User): Promise<User> {
        return this.getConnection().getRepository(User).save(user);
    }

    /**
     * delete
     *
     * Remove um usuário pelo ID
     *
     * @param id - ID do usuário
     *
     * @returns Resultado da remoção
     */
    public delete(id: ObjectID): Promise<DeleteResult> {
        return this.getConnection().getRepository(User).delete(id);
    }

    /**
     * findByEmail
     *
     * Busca um usuário pelo email
     *
     * @param email - E-mail do usuário
     *
     * @returns Usuário buscado
     */
    public findByEmail(email: string): Promise<User | undefined> {
        return this.getConnection().getRepository(User).findOne({ email });
    }

    /**
     * findById
     *
     * Busca um usuário pelo ID
     *
     * @param id - ID do usuário
     *
     * @returns Usuário buscado
     */
    public findById(id: ObjectID): Promise<User | undefined> {
        return this.getConnection().getRepository(User).findOne(id);
    }
}
