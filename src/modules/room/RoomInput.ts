import { Field, InputType } from "type-graphql";

@InputType()
export class RoomInput {
  @Field()
  roomId: string;
}
