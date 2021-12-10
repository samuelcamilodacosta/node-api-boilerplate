import { Entity, Column, BaseEntity, ObjectID, ObjectIdColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity()
export class Activity extends BaseEntity {
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
    public description: string;
}
