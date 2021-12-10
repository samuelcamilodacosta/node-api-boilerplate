import { Entity, Column, BaseEntity, ObjectIdColumn, ObjectID, BeforeUpdate, BeforeInsert } from 'typeorm';
import { IActivityValue } from '../../../models/IActivityValue';

@Entity()
export class List extends BaseEntity {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column()
    public createdAt: Date;

    @Column()
    public updatedAt: Date;

    @BeforeInsert()
    public setCreateDate(): void {
        this.createdAt = new Date();
    }

    @BeforeInsert()
    @BeforeUpdate()
    public setUpdateDate(): void {
        this.updatedAt = new Date();
    }

    @Column()
    public familyMemberName: string;

    @Column()
    public status: string;

    @Column()
    public activities: IActivityValue[];
}
