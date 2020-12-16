import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateUserInput{
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;
}
