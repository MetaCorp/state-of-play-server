import { Resolver, Query, Mutation, Ctx, Arg, Int, Authorized } from "type-graphql";
import { ILike } from 'typeorm';

import { Representative } from "../../entity/Representative";

import { CreateRepresentativeInput } from "./CreateRepresentativeInput";
import { RepresentativesFilterInput } from "./RepresentativesFilterInput";
import { DeleteRepresentativeInput } from "./DeleteRepresentativeInput";
import { UpdateRepresentativeInput } from "./UpdateRepresentativeInput";
import { RepresentativeInput } from "./RepresentativeInput";

import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";

// import { RepresentativeInput } from "./RepresentativeInput"

@Resolver()
export class RepresentativeResolver {
	@Authorized()
	@Query(() => [Representative])
	representatives(@Arg("filter", { nullable: true }) filter?: RepresentativesFilterInput) {
		return Representative.find({
            where: filter ? [
                { lastName: ILike("%" + filter.search + "%") },
                { firstName: ILike("%" + filter.search + "%") },
            ] : [],
			order: { lastName: 'ASC', firstName: 'ASC' },
			relations: ["user"]
        })
	}

	@Authorized()
	@Query(() => Representative, { nullable: true })
	async representative(@Arg("data") data: RepresentativeInput) {

		// @ts-ignore
		const representative = await Representative.findOne({ id: data.representativeId }, { relations: ["user"] })
		if (!representative) return

		return representative;
	}

	@Authorized()
	@Mutation(() => Representative, { nullable: true })
	async createRepresentative(@Arg("data") data: CreateRepresentativeInput, @Ctx() ctx: MyContext) {

		console.log(ctx.req.session)// TODO: ne devrait pas être nul

		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })
		if (!user) return

		const representative = await Representative.create({
            firstName: data.firstName,
            lastName: data.lastName,
			address: data.address,
			postalCode: data.postalCode,
			city: data.city,
			user: user,
		}).save();

		console.log(representative)

		// await representative.save();
		return representative;
	}

	@Authorized()
	@Mutation(() => Int)
	async updateRepresentative(@Arg("data") data: UpdateRepresentativeInput) {

		const representative = await Representative.update(data.id, {
            firstName: data.firstName,
            lastName: data.lastName,
			address: data.address,
			postalCode: data.postalCode,
			city: data.city,
		})
		console.log('updateRepresentative: ', representative)

		if (representative.affected !== 1) return 0

		return 1
	}

	@Authorized()
	@Mutation(() => Int)
	async deleteRepresentative(@Arg("data") data: DeleteRepresentativeInput) {

		const representative = await Representative.delete(data.representativeId)

		console.log('deleteRepresentative: ', representative)

		if (representative.affected !== 1) return 0

		return 1
	}

}
