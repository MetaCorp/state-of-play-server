import { Field, InputType } from "type-graphql";
import { Length } from "class-validator";

@InputType()
export class StripePIInput {
    @Field()
    amount: number;
  
    @Field()
    @Length(1, 255)
    paym: string;
}
