import { Field, InputType } from "type-graphql";

@InputType()
export class DeletePropertyInput {
  @Field()
  propertyId: string;
}
