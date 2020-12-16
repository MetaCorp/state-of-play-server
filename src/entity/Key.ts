import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { User } from "./User";

@ObjectType()
@Entity()
export class Key extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    type: String;

    @Field(() => User)
    @ManyToOne(() => User, user => user.rooms)
    user: User;
}
