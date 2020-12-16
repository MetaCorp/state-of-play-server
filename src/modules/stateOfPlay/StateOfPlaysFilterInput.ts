import { Field, InputType } from "type-graphql";

@InputType()
export class StateOfPlaysFilterInput {
  @Field()
  search: string;
  
  @Field({ nullable: true })
  in: boolean;

  @Field({ nullable: true })
  out: boolean;
}
