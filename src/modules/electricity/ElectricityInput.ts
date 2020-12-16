import { Field, InputType } from "type-graphql";

@InputType()
export class ElectricityInput {
  @Field()
  electricityId: string;
}
