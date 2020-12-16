import { Field, InputType } from "type-graphql";

@InputType()
export class DeleteDecorationInput {
  @Field()
  decorationId: string;
}
