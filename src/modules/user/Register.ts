import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
// @ts-ignore
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

import { User } from "../../entity/User";
// import { Decoration } from "../../entity/Decoration";
import { RegisterInput } from "./register/RegisterInput";
import { isAuth } from "../middleware/isAuth";
import { logger } from "../middleware/logger";
// import { sendEmail } from "../utils/sendEmail";
// import { createConfirmationUrl } from "../utils/createConfirmationUrl";

@Resolver()
export class RegisterResolver {
  @UseMiddleware(isAuth, logger)
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }

  @Mutation(() => String)
  async register(@Arg("data")
  {
    email,
    firstName,
    lastName,
    password
  }: RegisterInput): Promise<String> {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    }).save();

    // Decoration.save()

    // await sendEmail(email, await createConfirmationUrl(user.id));

    return sign({ userId: user.id }, "TypeGraphQL", {
      expiresIn: "1d"
    });;
  }
}
