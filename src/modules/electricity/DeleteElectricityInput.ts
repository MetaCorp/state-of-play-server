import { Field, InputType } from "type-graphql";

@InputType()
export class DeleteElectricityInput {
  @Field()
  electricityId: string;
}
