import { Query, Resolver, Ctx, Arg, Mutation, Int, Authorized, Subscription, ObjectType, Field, PubSub, Publisher, Root, Args, ArgsType } from "type-graphql";
import { MyContext } from "../../types/MyContext";

import { UserInput } from "./UserInput";
import { UpdateUserInput } from "./UpdateUserInput";
import { UpdateUserAdminInput } from "./UpdateUserAdminInput";
import { DeleteUserInput } from "./DeleteUserInput";
import { PayInput } from "./PayInput";
import { StripePIInput } from "./StripePIInput";
import { LoginAccountInput } from "./LoginAccountInput";
import { VerifyInput } from "./VerifyInput";
import { SendEmailNewPasswordInput } from "./SendEmailNewPasswordInput";

import { User } from "../../entity/User";

import { uploadFile } from '../../utils/GCS';

import { transporter } from '../utils/email';
var generator = require('generate-password');
import bcrypt from "bcryptjs";


const stripe = require('stripe')('sk_test_51I5BaICPxFg6weCstvnEDYMpJUaSqoqrIznXGkPcvwD5rvOIQKmnTubo5ogQxLC4lqS3YMq5MSScBWxGuf8LuUt700wDFMrZ4r')
const stripeClientId = 'acct_1I5JONEgk3XYqoy9'


@ObjectType()
class AccountConnected {
	@Field()
	userId: number;

	@Field()
	accountId: number;
}

@ArgsType()
class AccountConnectedArgs {
	@Field()
	userId: number;

	@Field()
	accountId: number;
}

interface AccountConnectedPayload {
	userId: number;
	accountId: number;
}

@ObjectType()
class VerifyType {
	@Field()
	isVerified: boolean;

	@Field({ nullable: true })
	error?: string;
}

@Resolver()
export class UserResolver {

	@Authorized()
	@Query(() => [User])
	async users() {
		return User.find({ relations: ["properties", "stateOfPlays", "stateOfPlays.property"] });
	}

	@Authorized()
	@Query(() => User, { nullable: true })
	async user(@Ctx() ctx: MyContext, @Arg("data", { nullable: true }) data?: UserInput) {

		// console.log(ctx.req.session)// TODO: ne devrait pas être nul

		// @ts-ignore
		const user = await User.findOne({ id: (data && data.userId) || ctx.userId }, { relations: ["properties", "stateOfPlays", "stateOfPlays.property"] })
		if (!user) return

		// console.log('properties: ', user.properties)

		return user;
	}

	@Authorized()
	@Mutation(() => Int)
	async updateUser(@Arg("data") data: UpdateUserInput, @Ctx() ctx: MyContext) {
		
		console.log('updateUser: ', data)

		const newUser : any = {}

		if (data.firstName) newUser.firstName = data.firstName
		if (data.lastName) newUser.lastName = data.lastName
		if (data.company) newUser.company = data.company
		if (data.address) newUser.address = data.address
		if (data.postalCode) newUser.postalCode = data.postalCode
		if (data.documentHeader) newUser.documentHeader = data.documentHeader
		if (data.documentEnd) newUser.documentEnd = data.documentEnd
		if (data.city) newUser.city = data.city
		if (data.accounts) newUser.accounts = data.accounts

		if (data.newLogo) {
			const { createReadStream, filename } = await data.newLogo;

			newUser.logo = await uploadFile(filename, createReadStream())
			console.log('newUser.logo: ', newUser.logo)
		}

		const user = await User.update(ctx.userId.toString(), newUser)
		console.log('updateUser: ', user)

		if (user.affected !== 1) return 0

		return 1
	}

	@Authorized()// TODO: authorized ADMIN
	@Mutation(() => User)
	async updateUserAdmin(@Arg("data") data: UpdateUserAdminInput, @Ctx() ctx: MyContext) {
		
		const admin = await User.findOne(ctx.userId.toString());
		if (!admin || !admin.isAdmin)
			return

		console.log('updateUserAdmin: ', data)

		const newUser : any = {
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			credits: data.credits,
			isAdmin: data.isAdmin,
			isPro: data.isPro
		}

		const user = await User.update(data.id, newUser)
		console.log('updateUserAdmin: ', user)

		if (user.affected !== 1) return

		return await User.findOne(data.id)
	}

	@Authorized()
	@Mutation(() => Int)
	async deleteUser(@Arg("data") data: DeleteUserInput) {

		const user = await User.delete(data.userId)

		console.log('deleteUser: ', user)

		if (user.affected !== 1) return 0

		return 1
	}

	@Authorized()
	@Mutation(() => Int)
	async pay(@Arg("data") data: PayInput, @Ctx() ctx: MyContext) {

		console.log('pay: ', data)

		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })

		if (!user)
			return 0

		user.paidOnce = true// !user.paidOnce// TODO : = true
		user.credits = user.credits + data.amount

		await user.save();
		
		return 1
	}

	@Authorized()
	@Query(() => String)
	async stripePI(@Arg("data") data: StripePIInput) {
		return new Promise((res) => {

			stripe.paymentMethods.create({
				payment_method: data.paym,
			}, {
				stripeAccount: stripeClientId
			},
			(err : any, clonedPaymentMethod : any) => {
				if (err !== null) {
					console.log('Error clone: ', err);
					// res.send('error');
					res("")
				} else {
					console.log('clonedPaymentMethod: ', clonedPaymentMethod);
	
					const fee = (data.amount/100) | 0;
					stripe.paymentIntents.create({
						amount: data.amount,
						currency: "EUR",
						payment_method: clonedPaymentMethod.id,
						confirmation_method: 'automatic',
						confirm: true,
						application_fee_amount: fee,
						// description: req.query.description,
					}, {
						stripeAccount: stripeClientId
					},
					function(err : any, paymentIntent : any) {
						// asynchronously called
						if (err != null) {
							console.log('Error create: ', err);
							res("")
						}
						else {
							console.log('createdPaymentIntents: ', paymentIntent)
							res(JSON.stringify({
								paymentIntent: paymentIntent,
								stripeAccount: stripeClientId
							}))
						}
					})
				}
			})
		})
	}

	@Authorized()
	@Mutation(() => VerifyType)
	async verify(@Arg("data") data: VerifyInput, @Ctx() ctx: MyContext) : Promise<VerifyType> {
		
		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })

		if (!user) {
			return {
				isVerified: false,
				error: "Could not find user"
			}
		}

		if (user.isVerified) {
			return {
				isVerified: true,
				error: "Email already verified"
			}
		}
		
		if (new Date().getTime() - new Date(user.dateVerificationCode).getTime() < 1000 * 60 * 20) {
			return {
				isVerified: false,
				error: "Code expired"
			}
		}

		if (data.code === user.verificationCode) {// 20 minutes
			user.isVerified = true
			user.verificationCode = undefined
			await user.save()
			return {
				isVerified: true
			}
		}
		else {
			return {
				isVerified: false,
				error: "Wrong code"
			}
		}
	}

	@Authorized()
	@Mutation(() => Int)
	async sendVerificationEmail(@Ctx() ctx: MyContext) : Promise<number> {
		
		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })

		if (!user) return 0
		if (user.isVerified) return 0

		
		let verificationCode = Math.floor(Math.random() * 1000000).toString()

		while (verificationCode.length < 6) {
		  verificationCode = '0' + verificationCode
		}

		user.verificationCode = verificationCode
		// @ts-ignore
		user.dateVerificationCode = new Date().toISOString()

		await user.save();

		const mailOptions = {
			from: "housely.noreply@gmail.com",
			to: user.email,
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

		return 1
	}

	@Mutation(() => Int)
	async sendEmailNewPassword(@Arg("data") data: SendEmailNewPasswordInput) : Promise<number> {
		
		// @ts-ignore
		const user = await User.findOne({ email: data.email })

		if (!user) return 0
		if (!user.isVerified) return 0

		
		const newPassword = generator.generate({
			length: 10,
			numbers: true
		});

		const newHashedPassword = await bcrypt.hash(newPassword, 12);
		user.password = newHashedPassword

		await user.save();

		const mailOptions = {
			from: "housely.noreply@gmail.com",
			to: user.email,
			subject: "Nouveau mot de passe Housely",
			html: "Voici votre nouveau mot de passe: " + newPassword
		};
		
		transporter.sendMail(mailOptions, (error : any, info : any) => {
			if (error) {
				console.log(error);  
			} else {     
				console.log('Email sent: ' + info.response);  
			}   
		});

		return 1
	}

	@Authorized()
	@Mutation(() => Int)
	async loginAccount(@Arg("data") data: LoginAccountInput, @Ctx() ctx: MyContext, @PubSub("ACCOUNT_CONNECTED") publish: Publisher<AccountConnectedPayload>) {
		// @ts-ignore
		await publish({ userId: ctx.userId, accountId: data.accountId });
		return 1;
	}

	// Get userId when he subscribes to ACCOUNT_CONNECTED
	@Subscription({
		topics: "ACCOUNT_CONNECTED",
		filter: ({ payload, args }) => {
			console.log('ACCOUNT_CONNECTED payload: ', payload)
			console.log('ACCOUNT_CONNECTED args: ', args)
			return args.userId === payload.userId && args.accountId === payload.accountId
		},
	})
	accountConnected(@Root() { userId, accountId }: AccountConnectedPayload, @Args() args: AccountConnectedArgs): AccountConnected {
		console.log('newNotification userId: ', userId)
		console.log('newNotification args: ', args)
		return {
			userId,
			accountId
		}
	}
}

// import { ObjectType, Field, ID } from "type-graphql";

// @ObjectType()
// export class StripePI {
//   @Field(() => ID)
//   id: number;

//   @Field()
//   type: String;

//   @Field(() => User)
//   user: User;
// }

