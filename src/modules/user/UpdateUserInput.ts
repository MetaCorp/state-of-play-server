import { Field, InputType } from "type-graphql";
import { CreateUserInput } from "./CreateUserInput";

@InputType()
export class UpdateUserInput {  
    @Field()
    userId: string;

    @Field()
    user: CreateUserInput
}
