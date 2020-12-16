import { Field, InputType } from "type-graphql";

@InputType()
export class EquipmentInput {
  @Field()
  equipmentId: string;
}
