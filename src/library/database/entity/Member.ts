import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Member extends BaseEntity {
    @PrimaryGeneratedColumn() // Alterar para @PrimaryGeneratedColumn em caso de banco diferente do MongoDB
    public id: number;

    @Column({ unique: true })
    public name: string;

    @Column()
    public birthDate: string;

    @Column()
    public allowanceValue: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
