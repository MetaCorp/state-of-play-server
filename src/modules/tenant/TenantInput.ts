import { Field, InputType } from "type-graphql";

@InputType()
export class TenantInput {
  @Field()
  tenantId: string;
}
