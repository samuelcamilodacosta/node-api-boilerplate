import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Activity } from './Activity';

@Entity()
export class List extends BaseEntity {
    @PrimaryGeneratedColumn() // Alterar para @PrimaryGeneratedColumn em caso de banco diferente do MongoDB
    public id: number;

    @Column()
    public familyMemberName: string;

    @Column()
    public discount: number;

    @Column()
    public status: string;

    @Column()
    public values: string;

    @ManyToMany(() => Activity, { eager: true })
    @JoinTable()
    public activities: Activity[];

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
