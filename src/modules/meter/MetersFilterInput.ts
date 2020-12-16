import { Field, InputType } from "type-graphql";

@InputType()
export class MetersFilterInput {
  @Field()
  search: string;
}
