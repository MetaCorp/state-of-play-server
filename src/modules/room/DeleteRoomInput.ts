import { Field, InputType } from "type-graphql";

@InputType()
export class DeleteRoomInput {
  @Field()
  roomId: string;
}
