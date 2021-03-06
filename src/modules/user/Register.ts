import { Resolver, Query, Mutation, Arg, UseMiddleware, ObjectType, Field } from "type-graphql";
// @ts-ignore
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

import { User } from "../../entity/User";

import { Room } from "../../entity/Room";
import { Decoration } from "../../entity/Decoration";
import { Electricity } from "../../entity/Electricity";
import { Meter } from "../../entity/Meter";
import { Key } from "../../entity/Key";
import { PropertyType } from "../../entity/PropertyType";

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
import propertyTypes from '../../data/propertyTypes.json';

import { transporter } from '../utils/email';

@ObjectType()
class RegisterType {
  @Field({ nullable: true })
  token?: string;

  @Field()
  admin: boolean;

  @Field({ nullable: true })
  user?: User
}


@Resolver()
export class RegisterResolver {
  @UseMiddleware(isAuth, logger)
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }

  @Mutation(() => RegisterType)
  async register(@Arg("data")
  {
    email,
    firstName,
    lastName,
    password,
    isPro = false
  }: RegisterInput): Promise<RegisterType> {
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log('REGISTER')

    let verificationCode = Math.floor(Math.random() * 1000000).toString()

    while (verificationCode.length < 6) {
      verificationCode = '0' + verificationCode
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isPro,
      documentHeader: "Dressé en commun et contradictoire entre les soussignés",
      documentEnd: `Les soussignés reconnaissent exactes les constatations sur l'état du logement, sous réserve du bon fonctionnement des canalisations, appareils et installations sanitaires, électriques et du chauffage qui n'a pu être vérifié ce jour, toute défectuosité dans le fonctionnement de ceux-ci devant être signalée dans le délai maximum de huit jours, et pendant le premier mois de la période de chauffe en ce qui concerne les éléments de chauffage.
Les cosignataires aux présentes ont convenu du caractère probant et indiscutable des signatures y figurant pour être recueillies selon procédé informatique sécurisé au contradictoire des partie, ils s'accordent pour y faire référence lors du départ du locataire.
Le présent état des lieux établi contradictoirement entre les parties qui le reconnaissent exact, fait partie intégrante du contrat de location dont il ne peut être dissocié.`,
      logo: 'https://storage.googleapis.com/state-of-play/logo.png',
      verificationCode
    }).save();

    // TODO: sendEmail
    const mailOptions = {
      from: "housely.noreply@gmail.com",
      to: email,
      subject: "Code de confirmation d'email Housely",
      html: "Voici votre code de confirmation: " + verificationCode
    };
    
    transporter.sendMail(mailOptions, (error : any, info : any) => {
      if (error) {
        console.log(error);  
      } else {     
        console.log('Email sent: ' + info.response);  
      }   
    });

    // Decoration.save()
    // @ts-ignore
    await Room.save(rooms.map(room => ({
      name: room,
      user: user
    })))

    // @ts-ignore
    await Decoration.save(decorations.map(decoration => ({
      type: decoration,
      user: user
    })))

    // @ts-ignore
    await Electricity.save(electricities.map(electricity => ({
      type: electricity,
      user: user
    })))

    // @ts-ignore
    await Meter.save(meters.map(meter => ({
      type: meter,
      user: user
    })))

    // @ts-ignore
    await Key.save(keys.map(key => ({
      type: key,
      user: user
    })))

    // @ts-ignore
    await PropertyType.save(propertyTypes.map(propertyType => ({
      type: propertyType,
      user: user
    })))

    // await sendEmail(email, await createConfirmationUrl(user.id));

    const user2 = await User.findOne(user.id, { relations: ["stateOfPlays"] })

    return {
      token: sign({ userId: user.id }, "TypeGraphQL", {
        expiresIn: "1d"
      }),
      admin: user.isAdmin,
      user: user2
    };
  }
}
