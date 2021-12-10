import { Entity, Column, BaseEntity, BeforeUpdate, BeforeInsert, ObjectIdColumn, ObjectID } from 'typeorm';
import bcrypt from 'bcryptjs';

@Entity()
export class User extends BaseEntity {
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

    @Column({ unique: true })
    public email: string;

    @Column()
    public password: string;

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword(): void {
        this.password = bcrypt.hashSync(this.password, 8);
    }
}
