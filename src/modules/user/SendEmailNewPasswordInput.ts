import { Field, InputType } from "type-graphql";

@InputType()
export class SendEmailNewPasswordInput {
  @Field()
  email: string;
}
