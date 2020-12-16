import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateKeyInput {
  @Field({ nullable: true })
  id: string;
  
  @Field()
  @Length(1, 255)
  type: string;
}
