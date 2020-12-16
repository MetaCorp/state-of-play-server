import { Field, InputType } from "type-graphql";

@InputType()
export class KeysFilterInput {
  @Field()
  search: string;
}
