import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";

@InputType()
export class UpdateUserAdminInput {
  
    @Field()
    @Length(1, 255)
    id: string;

    @Field()
    @Length(1, 255)
    firstName: string;
  
    @Field()
    @Length(1, 255)
    lastName: string;

    @Field()
    @Length(1, 255)
    email: string;

    @Field()
    credits: number;

    @Field()
    isAdmin: boolean;

    @Field()
    isPro: boolean;

}
