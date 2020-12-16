import { Field, InputType } from "type-graphql";

@InputType()
export class DecorationsFilterInput {
  @Field()
  search: string;
}
