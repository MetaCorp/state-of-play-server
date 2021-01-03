import { Query, Resolver, Ctx, Arg, Mutation, Int, Authorized  } from "type-graphql";
import { MyContext } from "../../types/MyContext";

import { UserInput } from "./UserInput";
import { UpdateUserInput } from "./UpdateUserInput";
import { DeleteUserInput } from "./DeleteUserInput";
import { PayInput } from "./PayInput";
import { StripePIInput } from "./StripePIInput";

import { User } from "../../entity/User";

import { uploadFile } from '../../utils/GCS';

const stripe = require('stripe')('sk_test_51I5BaICPxFg6weCstvnEDYMpJUaSqoqrIznXGkPcvwD5rvOIQKmnTubo5ogQxLC4lqS3YMq5MSScBWxGuf8LuUt700wDFMrZ4r')
const stripeClientId = 'acct_1I5JONEgk3XYqoy9'

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

		const newUser : any = {
			firstName: data.firstName,
			lastName: data.lastName,
			company: data.company,
			address: data.address,
			postalCode: data.postalCode,
			documentHeader: data.documentHeader,
			documentEnd: data.documentEnd,
			city: data.city,
		}

		if (data.newLogo) {
			const { createReadStream, filename } = await data.newLogo;

			newUser.logo = await uploadFile(filename, createReadStream())
			console.log('newUser.logo: ', newUser.logo)
		}

		const user = await User.update(ctx.userId.toString(), newUser)
		console.log('updateOwner: ', user)

		if (user.affected !== 1) return 0

		return 1
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

