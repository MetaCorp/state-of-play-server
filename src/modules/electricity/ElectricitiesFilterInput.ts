import { Field, InputType } from "type-graphql";

@InputType()
export class ElectricitiesFilterInput {
  @Field()
  search: string;
}
