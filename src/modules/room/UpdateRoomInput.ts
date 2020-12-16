import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateRoomInput {
  @Field({ nullable: true })
  id: String;
  
  @Field()
  @Length(1, 255)
  name: String;
}
