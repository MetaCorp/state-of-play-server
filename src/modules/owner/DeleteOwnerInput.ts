import { Field, InputType } from "type-graphql";

@InputType()
export class DeleteOwnerInput {
  @Field()
  ownerId: string;
}
