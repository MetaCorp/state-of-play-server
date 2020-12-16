import { Field, InputType } from "type-graphql";

@InputType()
export class OwnerInput {
  @Field()
  ownerId: string;
}
