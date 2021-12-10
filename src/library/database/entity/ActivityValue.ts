import { Entity, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ObjectIdColumn, ObjectID } from 'typeorm';

@Entity()
export class ActivityValue extends BaseEntity {
    @ObjectIdColumn() // Alterar para @PrimaryGeneratedColumn em caso de banco diferente do MongoDB
    public id: ObjectID;

    @Column()
    public description: string;

    @Column()
    public value: number;

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
