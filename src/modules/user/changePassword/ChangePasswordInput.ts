import { Field, InputType } from "type-graphql";
import { PasswordMixin } from "../../shared/PasswordInput";

@InputType()
export class ChangePasswordInput2 extends PasswordMixin(class {}) {
  @Field()
  token: string;
}
