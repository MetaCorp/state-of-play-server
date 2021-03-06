import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateOwnerInput {
  @Field({ nullable: true })
  id: string;
  
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @Length(1, 255)
  address: string;

  @Field()
  @Length(3, 10)
  postalCode: string;

  @Field()
  @Length(1, 255)
  city: string;

  @Field()
  @Length(1, 255)
  company: string;
}
