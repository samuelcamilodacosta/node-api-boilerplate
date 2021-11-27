import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, BeforeUpdate, BeforeInsert } from 'typeorm';
import bcrypt from 'bcryptjs';
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn() // Alterar para @PrimaryGeneratedColumn em caso de banco diferente do MongoDB
    public id: number;

    @Column({ unique: true })
    public email: string;

    @Column()
    public password: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword(): void {
        this.password = bcrypt.hashSync(this.password, 8);
    }
}
