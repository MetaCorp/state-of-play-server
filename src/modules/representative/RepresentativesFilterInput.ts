import { Field, InputType } from "type-graphql";

@InputType()
export class RepresentativesFilterInput {
  @Field()
  search: string;
}
