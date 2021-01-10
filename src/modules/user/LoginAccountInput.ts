import { Field, InputType } from "type-graphql";

@InputType()
export class LoginAccountInput {
  @Field()
  accountId: number;
}
