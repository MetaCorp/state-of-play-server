import { Field, InputType } from "type-graphql";

@InputType()
export class RoomsFilterInput {
  @Field()
  search: string;
}
