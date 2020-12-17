import { Field, InputType } from "type-graphql";

@InputType()
export class PropertyTypeInput {
  @Field()
  propertyTypeId: string;
}
