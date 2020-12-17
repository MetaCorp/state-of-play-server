import { Field, InputType } from "type-graphql";

@InputType()
export class DeletePropertyTypeInput {
  @Field()
  propertyTypeId: string;
}
