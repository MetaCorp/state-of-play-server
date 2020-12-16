import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { StateOfPlay } from "./StateOfPlay"
import { User } from "./User";

@ObjectType()
@Entity()
export class Owner extends BaseEntity {
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
  @OneToMany(() => StateOfPlay, stateOfPlay => stateOfPlay.owner)
  stateOfPlays: StateOfPlay[];

  @Field(() => User)
  @ManyToOne(() => User, user => user.owners)
  user: User;
}
