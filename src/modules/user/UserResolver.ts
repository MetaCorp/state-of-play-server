import { Query, Resolver, Ctx, Arg, Mutation, Int, Authorized  } from "type-graphql";
import { MyContext } from "../../types/MyContext";

import { UserInput } from "./UserInput";
import { UpdateUserInput } from "./UpdateUserInput";
import { DeleteUserInput } from "./DeleteUserInput";

import { User } from "../../entity/User";

import { uploadFile } from '../../utils/GCS';


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
	async pay(@Ctx() ctx: MyContext) {

		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })

		if (!user)
			return 0

		user.paidOnce = !user.paidOnce

		await user.save();
		
		return 1
	}
}
