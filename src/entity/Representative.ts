import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, ManyToOne } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { StateOfPlay } from "./StateOfPlay"
import { User } from "./User";

@ObjectType()
@Entity()
export class Representative extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;
  
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
  @OneToMany(() => StateOfPlay, stateOfPlay => stateOfPlay.representative)
  stateOfPlays: StateOfPlay[];

  @Field(() => User)
  @ManyToOne(() => User, user => user.representatives)
  user: User;
}
