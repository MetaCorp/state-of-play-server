import { Field, InputType } from "type-graphql";

@InputType()
export class PropertyInput {
  @Field()
  propertyId: string;
}
