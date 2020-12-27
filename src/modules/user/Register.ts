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
      password: hashedPassword,
      documentHeader: "Dressé en commun et contradicatoire entre les soussignés",
      documentEnd: `Les soussignés reconnaissent exactes les constatations sur l'état du logement, sous réserve du bon fonctionnement des canalisations, appareils et installations sanitaires, électriques et du chauffage qui n'a pu être vérifié ce jour, toute défectuosité dans le fonctionnement de ceux-ci devant être signalée dans le délai maximum de huit jours, et pendant le premier mois de la période de chauffe en ce qui concerne les éléments de chauffage.
Les cosignataires aux présentes ont convenu du caractère probant et indiscutable des signatures y figurant pour être recueillies selon procédé informatique sécurisé au contradictoire des partie, ils s'accordent pour y faire référence lors du départ du locataire.
Le présent état des lieux établi contradictoirement entre les parties qui le reconnaissent exact, fait partie intégrante du contrat de location dont il ne peut être dissocié.`
    }).save();

    // Decoration.save()

    // await sendEmail(email, await createConfirmationUrl(user.id));

    return sign({ userId: user.id }, "TypeGraphQL", {
      expiresIn: "1d"
    });;
  }
}
