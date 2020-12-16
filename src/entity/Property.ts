import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, OneToMany } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

import { User } from "./User";
import { StateOfPlay } from "./StateOfPlay";

@ObjectType()
@Entity()
export class Property extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  address: String;
  
  @Field()
  @Column()
  postalCode: String;

  @Field()
  @Column()
  city: String;

  // @Field()
  // @Column()
  // type: String;

  @Field()
  @Column()
  reference: String;

  @Field()
  @Column()
  lot: String;

  @Field()
  @Column()
  floor: number;

  @Field()
  @Column()
  roomCount: number;

  @Field()
  @Column()
  area: number;

  // // @Field()
  // // @Column()
  // // annexes: [String];

  @Field()
  @Column()
  heatingType: String;

  @Field()
  @Column()
  hotWater: String;

  @Field(() => User)
  @ManyToOne(() => User, user => user.properties)
  user: User;
  
  @Field(() => [StateOfPlay])
  @OneToMany(() => StateOfPlay, stateOfPlay => stateOfPlay.property)
  stateOfPlays: StateOfPlay[];
}
