import { Entity, ObjectIdColumn, ObjectID, Column, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IActivityValue } from '../../../models/IActivityValue';

@Entity()
export class List extends BaseEntity {
    @ObjectIdColumn() // Alterar para @PrimaryGeneratedColumn em caso de banco diferente do MongoDB
    public id: ObjectID;

    @Column()
    public familyMemberName: string;

    @Column()
    public status: string;

    @Column()
    public activities: IActivityValue[];

    @CreateDateColumn()
    public createdAt: Date;

    @UpdateDateColumn()
    public updatedAt: Date;
}
