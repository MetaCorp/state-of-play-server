import { Field, InputType } from "type-graphql";

@InputType()
export class DeleteStateOfPlayInput {
  @Field()
  stateOfPlayId: string;
}
