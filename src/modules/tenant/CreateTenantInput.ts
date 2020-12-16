import { Length } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class CreateTenantInput {
  @Field({ nullable: true })
  id: String;
  
  @Field()
  @Length(1, 255)
  firstName: String;

  @Field()
  @Length(1, 255)
  lastName: String;

  @Field()
  @Length(1, 255)
  address: string;

  @Field()
  @Length(3, 10)
  postalCode: string;

  @Field()
  @Length(1, 255)
  city: string;
}
