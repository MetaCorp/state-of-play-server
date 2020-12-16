import { Resolver, Query, Mutation, Ctx, Arg, Int, Authorized } from "type-graphql";
import { ILike } from 'typeorm';

import { Electricity } from "../../entity/Electricity";

import { CreateElectricityInput } from "./CreateElectricityInput";
import { ElectricitiesFilterInput } from "./ElectricitiesFilterInput";
import { DeleteElectricityInput } from "./DeleteElectricityInput";
import { UpdateElectricityInput } from "./UpdateElectricityInput";
import { ElectricityInput } from "./ElectricityInput";

import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";

// import { ElectricityInput } from "./ElectricityInput"

@Resolver()
export class ElectricityResolver {
	@Authorized()
	@Query(() => [Electricity])
	electricities(@Arg("filter", { nullable: true }) filter?: ElectricitiesFilterInput) {
		return Electricity.find({
            where: filter ? [
                { type: ILike("%" + filter.search + "%") },
            ] : [],
			order: { type: 'ASC' },
			relations: ["user"]
        })
	}

	@Authorized()
	@Query(() => Electricity, { nullable: true })
	async electricity(@Arg("data") data: ElectricityInput) {

		// @ts-ignore
		const electricity = await Electricity.findOne({ id: data.electricityId }, { relations: ["user"] })
		if (!electricity) return

		return electricity;
	}

	@Authorized()
	@Mutation(() => Electricity, { nullable: true })
	async createElectricity(@Arg("data") data: CreateElectricityInput, @Ctx() ctx: MyContext) {

		console.log(ctx.req.session)// TODO: ne devrait pas être nul

		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })
		if (!user) return

		const electricity = await Electricity.create({
            type: data.type,
			user: user,
		}).save();

		console.log(electricity)

		// await electricity.save();
		return electricity;
	}

	@Authorized()
	@Mutation(() => Int)
	async updateElectricity(@Arg("data") data: UpdateElectricityInput) {

		const electricity = await Electricity.update(data.id, {
            type: data.type,
		})
		console.log('updateElectricity: ', electricity)

		if (electricity.affected !== 1) return 0

		return 1
	}

	@Authorized()
	@Mutation(() => Int)
	async deleteElectricity(@Arg("data") data: DeleteElectricityInput) {

		const electricity = await Electricity.delete(data.electricityId)

		console.log('deleteElectricity: ', electricity)

		if (electricity.affected !== 1) return 0

		return 1
	}

}
