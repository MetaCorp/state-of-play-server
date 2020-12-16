import { Resolver, Query, Mutation, Ctx, Arg, Int, Authorized } from "type-graphql";
import { ILike } from "typeorm";

import { Owner } from "../../entity/Owner";

import { CreateOwnerInput } from "./CreateOwnerInput";
import { OwnersFilterInput } from "./OwnersFilterInput";
import { DeleteOwnerInput } from "./DeleteOwnerInput";
import { UpdateOwnerInput } from "./UpdateOwnerInput";
import { OwnerInput } from "./OwnerInput";

import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";

// import { OwnerInput } from "./OwnerInput"

@Resolver()
export class OwnerResolver {
	@Authorized()
	@Query(() => [Owner])
	owners(@Arg("filter", { nullable: true }) filter?: OwnersFilterInput) {
		return Owner.find({
            where: filter ? [
                { lastName: ILike("%" + filter.search + "%") },
                { firstName: ILike("%" + filter.search + "%") },
            ] : [],
			order: { lastName: 'ASC', firstName: 'ASC' },
			relations: ["user"]
        })
	}

	@Query(() => Owner, { nullable: true })
	async owner(@Arg("data") data: OwnerInput) {

		// @ts-ignore
		const owner = await Owner.findOne({ id: data.ownerId }, { relations: ["user"] })
		if (!owner) return


		return owner;
	}

	@Authorized()
	@Mutation(() => Owner, { nullable: true })
	async createOwner(@Arg("data") data: CreateOwnerInput, @Ctx() ctx: MyContext) {

		console.log("createOwner: ", data)

		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })
		if (!user) return

		const owner = await Owner.create({
            firstName: data.firstName,
            lastName: data.lastName,
			address: data.address,
			postalCode: data.postalCode,
			city: data.city,
			user: user,
		}).save();

		console.log(owner)

		// await owner.save();
		return owner;
	}
	
	@Authorized()
	@Mutation(() => Int)
	async updateOwner(@Arg("data") data: UpdateOwnerInput) {

		const owner = await Owner.update(data.id, {
            firstName: data.firstName,
            lastName: data.lastName,
			address: data.address,
			postalCode: data.postalCode,
			city: data.city,
		})
		console.log('updateOwner: ', owner)

		if (owner.affected !== 1) return 0

		return 1
	}
	
	@Authorized()
	@Mutation(() => Int)
	async deleteOwner(@Arg("data") data: DeleteOwnerInput) {

		// const owner = await Owner.findOne(data.ownerId, { relations: ["stateOfPlays", "stateOfPlays.owner"] });
		// if (!owner)
		// 	return 0

		// for (let i = 0; i < owner.stateOfPlays.length; i++) {
		// 	let stateOfPlay = owner.stateOfPlays[i];
			
		// 	stateOfPlay.owner = undefined;
			
		// 	stateOfPlay = await stateOfPlay.save()
			
		// 	console.log('delete owner stateOfPlay: ', stateOfPlay.owner)
		// }

		const ret = await Owner.delete(data.ownerId)

		console.log('deleteOwner: ', ret)

		if (ret.affected !== 1) return 0

		return 1
	}

}
