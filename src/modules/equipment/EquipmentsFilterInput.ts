import { Field, InputType } from "type-graphql";

@InputType()
export class EquipmentsFilterInput {
  @Field()
  search: string;
}
