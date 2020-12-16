import bcrypt from "bcryptjs";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { sign } from "jsonwebtoken";

import { User } from "../../entity/User";
import { MyContext } from "../../types/MyContext";

@Resolver()
export class LoginResolver {
  @Mutation(() => String, { nullable: true })
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() ctx: MyContext
  ): Promise<String | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return null;
    }

    // if (!user.confirmed) {
    //   return null;
    // }

    console.log('ctx.req.session: ', ctx.req.session)

    // TODO: Fix req.session === undefined
    // ctx.req.session!.userId = user.id;

    return sign({ userId: user.id }, "TypeGraphQL", {
      expiresIn: "1d"
    });
  }
}
