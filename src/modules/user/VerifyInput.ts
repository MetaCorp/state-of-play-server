import { Field, InputType } from "type-graphql";

@InputType()
export class VerifyInput {
  @Field()
  code: string;
}
