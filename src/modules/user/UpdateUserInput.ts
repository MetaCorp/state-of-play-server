import { Field, InputType } from "type-graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload";

import { Length } from "class-validator";

@InputType()
export class UpdateUserInput {
    @Field({ nullable: true })
    @Length(1, 255)
    firstName: string;
  
    @Field({ nullable: true })
    @Length(1, 255)
    lastName: string;

    @Field({ nullable: true })
    @Length(0, 255)
    documentHeader: string;

    @Field({ nullable: true })
    @Length(0, 1023)
    documentEnd: string;

    @Field({ nullable: true })
    @Length(0, 255)
    address: string;

    @Field({ nullable: true })
    @Length(0, 255)
    postalCode: string;

    @Field({ nullable: true })
    @Length(0, 255)
    city: string;

    @Field({ nullable: true })
    @Length(0, 255)
    company: string;

    @Field(() => GraphQLUpload,{ nullable: true })
    newLogo: FileUpload;

    @Field({ nullable: true })
    accounts: String;
}
