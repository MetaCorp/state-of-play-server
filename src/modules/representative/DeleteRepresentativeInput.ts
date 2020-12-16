import { Field, InputType } from "type-graphql";

@InputType()
export class DeleteRepresentativeInput {
  @Field()
  representativeId: string;
}
