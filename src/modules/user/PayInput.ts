import { Field, InputType } from "type-graphql";

@InputType()
export class PayInput {
  @Field()
  amount: number;
}
