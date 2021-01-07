// @ts-ignore
import bcrypt from "bcryptjs";
import { Arg, Ctx, Mutation, Resolver, ObjectType, Field } from "type-graphql";
import { sign } from "jsonwebtoken";

import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";


@ObjectType()
class LoginType {
  @Field({ nullable: true })
  token?: string;

  @Field()
  admin: boolean;
}


@Resolver()
export class LoginResolver {
  @Mutation(() => LoginType)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<LoginType> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return {
        token: undefined,
        admin: false
      };
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return {
        token: undefined,
        admin: false
      };
    }

    // if (!user.confirmed) {
    //   return null;
    // }

    console.log('ctx.req.session: ', ctx.req.session)

    // TODO: Fix req.session === undefined
    // ctx.req.session!.userId = user.id;

    return {
      token: sign({ userId: user.id }, "TypeGraphQL", {
        expiresIn: "1d"
      }),
      admin: user.isAdmin
    }
  }
}
