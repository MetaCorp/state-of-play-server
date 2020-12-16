import { Field, InputType } from "type-graphql";

@InputType()
export class DeleteKeyInput {
  @Field()
  keyId: string;
}
