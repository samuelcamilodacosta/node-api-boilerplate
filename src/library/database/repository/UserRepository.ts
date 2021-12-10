// Modules
import { DeepPartial, DeleteResult, ObjectID, Repository } from 'typeorm';
import bcrypt from 'bcryptjs';

// JWT
import jwt from 'jsonwebtoken';

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

    /**
     * authenticateUser
     *
     * Gera um token de autenticação parao  usuário
     *
     * @param email - Email do usuário
     * @param password - Senha do usuário
     *
     * @returns token
     */
    public async authenticateUser(email: string, password: string): Promise<string | null> {
        const user: User | undefined = await new UserRepository().findByEmail(email);
        if (user) {
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (isValidPassword) {
                const token = jwt.sign({ id: user.id, email: user.email }, 'secret', { expiresIn: '10h' });
                return token;
            }
        }
        return null;
    }
}
