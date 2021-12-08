import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Activity extends BaseEntity {
    @PrimaryGeneratedColumn() // Alterar para @PrimaryGeneratedColumn em caso de banco diferente do MongoDB
    public id: number;

    @Column()
    public description: string;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
