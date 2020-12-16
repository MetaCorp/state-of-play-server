import { Field, InputType } from "type-graphql";

@InputType()
export class DeleteEquipmentInput {
  @Field()
  equipmentId: string;
}
