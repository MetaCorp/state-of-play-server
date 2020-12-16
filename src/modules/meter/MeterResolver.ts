import { Resolver, Query, Mutation, Ctx, Arg, Int, Authorized } from "type-graphql";
import { ILike } from 'typeorm';

import { Meter } from "../../entity/Meter";

import { CreateMeterInput } from "./CreateMeterInput";
import { MetersFilterInput } from "./MetersFilterInput";
import { DeleteMeterInput } from "./DeleteMeterInput";
import { UpdateMeterInput } from "./UpdateMeterInput";
import { MeterInput } from "./MeterInput";

import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";

// import { MeterInput } from "./MeterInput"

@Resolver()
export class MeterResolver {
	@Authorized()
	@Query(() => [Meter])
	meters(@Arg("filter", { nullable: true }) filter?: MetersFilterInput) {
		return Meter.find({
            where: filter ? [
                { type: ILike("%" + filter.search + "%") },
            ] : [],
			order: { type: 'ASC' },
			relations: ["user"]
        })
	}

	@Authorized()
	@Query(() => Meter, { nullable: true })
	async meter(@Arg("data") data: MeterInput) {

		// @ts-ignore
		const meter = await Meter.findOne({ id: data.meterId }, { relations: ["user"] })
		if (!meter) return

		return meter;
	}

	@Authorized()
	@Mutation(() => Meter, { nullable: true })
	async createMeter(@Arg("data") data: CreateMeterInput, @Ctx() ctx: MyContext) {

		console.log(ctx.req.session)// TODO: ne devrait pas être nul

		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })
		if (!user) return

		const meter = await Meter.create({
            type: data.type,
			user: user,
		}).save();

		console.log(meter)

		// await meter.save();
		return meter;
	}

	@Authorized()
	@Mutation(() => Int)
	async updateMeter(@Arg("data") data: UpdateMeterInput) {

		const meter = await Meter.update(data.id, {
            type: data.type,
		})
		console.log('updateMeter: ', meter)

		if (meter.affected !== 1) return 0

		return 1
	}

	@Authorized()
	@Mutation(() => Int)
	async deleteMeter(@Arg("data") data: DeleteMeterInput) {

		const meter = await Meter.delete(data.meterId)

		console.log('deleteMeter: ', meter)

		if (meter.affected !== 1) return 0

		return 1
	}

}
