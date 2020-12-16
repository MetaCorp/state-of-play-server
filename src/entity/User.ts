import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { ObjectType, Field, ID, Root } from "type-graphql";

import { Property } from "./Property";
import { StateOfPlay } from "./StateOfPlay";
import { Owner } from "./Owner";
import { Representative } from "./Representative";
import { Tenant } from "./Tenant";
import { Room } from "./Room";
import { Decoration } from "./Decoration";

@ObjectType()
@Entity()
export class User extends BaseEntity {
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
  @Column("text", { unique: true/* , length: 200 */ })
  email: string;

  @Field({ complexity: 3 })
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Column()
  password: string;

  @Column("bool", { default: false })
  confirmed: boolean;
  
  @Field(() => [Property])
  @OneToMany(() => Property, property => property.user)
  properties: Property[];
  
  @Field(() => [StateOfPlay])
  @OneToMany(() => StateOfPlay, stateOfPlay => stateOfPlay.user)
  stateOfPlays: StateOfPlay[];
  
  @Field(() => [Owner])
  @OneToMany(() => Owner, owner => owner.user)
  owners: Owner[];
  
  @Field(() => [Representative])
  @OneToMany(() => Representative, representative => representative.user)
  representatives: Representative[];
  
  @Field(() => [Tenant])
  @OneToMany(() => Tenant, tenant => tenant.user)
  tenants: Tenant[];

  @Field(() => [Room])
  @OneToMany(() => Room, room => room.user)
  rooms: Room[];

  @Field(() => [Decoration])
  @OneToMany(() => Decoration, room => room.user)
  decorations: Decoration[];

}
