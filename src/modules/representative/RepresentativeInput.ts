import { Field, InputType } from "type-graphql";

@InputType()
export class RepresentativeInput {
  @Field()
  representativeId: string;
}
