import { Field, InputType } from "type-graphql";

@InputType()
export class TenantsFilterInput {
  @Field()
  search: string;
}
