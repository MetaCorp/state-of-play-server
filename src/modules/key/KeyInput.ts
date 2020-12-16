import { Field, InputType } from "type-graphql";

@InputType()
export class KeyInput {
  @Field()
  keyId: string;
}
