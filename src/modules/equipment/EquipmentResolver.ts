import { Resolver, Query, Mutation, Ctx, Arg, Int, Authorized } from "type-graphql";
import { ILike } from 'typeorm';

import { Equipment } from "../../entity/Equipment";

import { CreateEquipmentInput } from "./CreateEquipmentInput";
import { EquipmentsFilterInput } from "./EquipmentsFilterInput";
import { DeleteEquipmentInput } from "./DeleteEquipmentInput";
import { UpdateEquipmentInput } from "./UpdateEquipmentInput";
import { EquipmentInput } from "./EquipmentInput";

import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";

// import { EquipmentInput } from "./EquipmentInput"

@Resolver()
export class EquipmentResolver {
	@Authorized()
	@Query(() => [Equipment])
	equipments(@Arg("filter", { nullable: true }) filter?: EquipmentsFilterInput) {
		return Equipment.find({
            where: filter ? [
                { type: ILike("%" + filter.search + "%") },
            ] : [],
			order: { type: 'ASC' },
			relations: ["user"]
        })
	}

	@Authorized()
	@Query(() => Equipment, { nullable: true })
	async equipment(@Arg("data") data: EquipmentInput) {

		// @ts-ignore
		const equipment = await Equipment.findOne({ id: data.equipmentId }, { relations: ["user"] })
		if (!equipment) return

		return equipment;
	}

	@Authorized()
	@Mutation(() => Equipment, { nullable: true })
	async createEquipment(@Arg("data") data: CreateEquipmentInput, @Ctx() ctx: MyContext) {

		console.log(ctx.req.session)// TODO: ne devrait pas être nul

		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })
		if (!user) return

		const equipment = await Equipment.create({
            type: data.type,
			user: user,
		}).save();

		console.log(equipment)

		// await equipment.save();
		return equipment;
	}

	@Authorized()
	@Mutation(() => Int)
	async updateEquipment(@Arg("data") data: UpdateEquipmentInput) {

		const equipment = await Equipment.update(data.id, {
            type: data.type,
		})
		console.log('updateEquipment: ', equipment)

		if (equipment.affected !== 1) return 0

		return 1
	}

	@Authorized()
	@Mutation(() => Int)
	async deleteEquipment(@Arg("data") data: DeleteEquipmentInput) {

		const equipment = await Equipment.delete(data.equipmentId)

		console.log('deleteEquipment: ', equipment)

		if (equipment.affected !== 1) return 0

		return 1
	}

}
