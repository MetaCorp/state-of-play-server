import { Field, InputType } from "type-graphql";

@InputType()
export class MeterInput {
  @Field()
  meterId: string;
}
