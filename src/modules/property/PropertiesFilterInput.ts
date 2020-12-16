import { Field, InputType } from "type-graphql";

@InputType()
export class PropertiesFilterInput {
  @Field()
  search: string;
}
