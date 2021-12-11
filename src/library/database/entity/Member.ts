import { Entity, Column, BaseEntity, ObjectID, ObjectIdColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity()
export class Member extends BaseEntity {
    @ObjectIdColumn()
    public id: ObjectID;

    @Column({ unique: true })
    public name: string;

    @Column()
    public birthDate: string;

    @Column({ type: 'float' })
    public allowanceValue: number;

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
}
