import { Resolver, Query, Mutation, Arg, UseMiddleware } from "type-graphql";
// @ts-ignore
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

import { User } from "../../entity/User";

import { Room } from "../../entity/Room";
import { Decoration } from "../../entity/Decoration";
import { Electricity } from "../../entity/Electricity";
import { Meter } from "../../entity/Meter";
import { Key } from "../../entity/Key";

import { RegisterInput } from "./register/RegisterInput";
import { isAuth } from "../middleware/isAuth";
import { logger } from "../middleware/logger";
// import { sendEmail } from "../utils/sendEmail";
// import { createConfirmationUrl } from "../utils/createConfirmationUrl";

import rooms from '../../data/rooms.json';
import decorations from '../../data/decorations.json';
import electricities from '../../data/electricities.json';
import meters from '../../data/meters.json';
import keys from '../../data/keys.json';

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
      documentHeader: "Dressé en commun et contradictoire entre les soussignés",
      documentEnd: `Les soussignés reconnaissent exactes les constatations sur l'état du logement, sous réserve du bon fonctionnement des canalisations, appareils et installations sanitaires, électriques et du chauffage qui n'a pu être vérifié ce jour, toute défectuosité dans le fonctionnement de ceux-ci devant être signalée dans le délai maximum de huit jours, et pendant le premier mois de la période de chauffe en ce qui concerne les éléments de chauffage.
Les cosignataires aux présentes ont convenu du caractère probant et indiscutable des signatures y figurant pour être recueillies selon procédé informatique sécurisé au contradictoire des partie, ils s'accordent pour y faire référence lors du départ du locataire.
Le présent état des lieux établi contradictoirement entre les parties qui le reconnaissent exact, fait partie intégrante du contrat de location dont il ne peut être dissocié.`,
      logo: 'https://storage.googleapis.com/state-of-play/logo.png'
    }).save();

    // Decoration.save()
    // @ts-ignore
    Room.save(rooms.map(room => ({
      name: room,
      user: user
    })))

    // @ts-ignore
    Decoration.save(decorations.map(decoration => ({
      type: decoration,
      user: user
    })))

    // @ts-ignore
    Electricity.save(electricities.map(electricity => ({
      type: electricity,
      user: user
    })))

    // @ts-ignore
    Meter.save(meters.map(meter => ({
      type: meter,
      user: user
    })))

    // @ts-ignore
    Key.save(keys.map(key => ({
      type: key,
      user: user
    })))

    // await sendEmail(email, await createConfirmationUrl(user.id));

    return sign({ userId: user.id }, "TypeGraphQL", {
      expiresIn: "1d"
    });;
  }
}
