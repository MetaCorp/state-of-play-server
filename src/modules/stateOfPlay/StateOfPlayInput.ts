import { Field, InputType } from "type-graphql";

@InputType()
export class StateOfPlayInput {
  @Field()
  stateOfPlayId: string;
}
