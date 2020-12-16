import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, ManyToOne, JoinTable } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { StateOfPlay } from "./StateOfPlay"
import { User } from "./User";

@ObjectType()
@Entity()
export class Tenant extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: String;

  @Field()
  @Column()
  lastName: String;
  
  @Field()
  @Column()
  address: String;
  
  @Field()
  @Column()
  postalCode: String;

  @Field()
  @Column()
  city: String;

  @Field(() => [StateOfPlay])
  @ManyToMany(() => StateOfPlay, stateOfPlay => stateOfPlay.tenants)
  @JoinTable()
  stateOfPlays: StateOfPlay[];

  @Field(() => User)
  @ManyToOne(() => User, user => user.tenants)
  user: User;
}
