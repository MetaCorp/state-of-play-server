import { Field, InputType } from "type-graphql";

@InputType()
export class OwnersFilterInput {
  @Field()
  search: string;
}
