import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateMeterInput {
  @Field({ nullable: true })
  id: string;
  
  @Field()
  @Length(1, 255)
  type: string;
}
