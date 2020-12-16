import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class UpdatePropertyInput {
  @Field({ nullable: true })
  id: string;

  @Field()
  @Length(1, 255)
  address: string;

  @Field()
  @Length(3, 10)
  postalCode: string;

  @Field()
  @Length(1, 255)
  city: string;

  @Field()
  @Length(1, 255)
  reference: String;

  @Field({ nullable: true })
  @Length(1, 255)
  lot: String;

  @Field({ nullable: true })
  floor: number;

  @Field()
  roomCount: number;

  @Field()
  area: number;

  // // @Field()
  // // annexes: [String];

  @Field()
  @Length(1, 255)
  heatingType: String;

  @Field()
  @Length(1, 255)
  hotWater: String;
}
