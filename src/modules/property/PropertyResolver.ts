import { Resolver, Query, Mutation, Ctx, Arg, Int, Authorized } from "type-graphql";
import { ILike } from "typeorm";

import { Property } from "../../entity/Property";

import { CreatePropertyInput } from "./CreatePropertyInput";
import { PropertiesFilterInput } from "./PropertiesFilterInput";
import { DeletePropertyInput } from "./DeletePropertyInput";
import { UpdatePropertyInput } from "./UpdatePropertyInput";

import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";

import { PropertyInput } from "./PropertyInput"

@Resolver()
export class PropertyResolver {
	@Authorized()
	@Query(() => [Property])
	// @ts-ignore
	properties(@Arg("filter", { nullable: true }) filter?: PropertiesFilterInput, @Ctx() ctx: MyContext) {
		console.log('properties: ', ctx.userId)
		return Property.find({
			where: filter ? [
                { address: ILike("%" + filter.search + "%"), user: { id: ctx.userId } },
                { postalCode: ILike("%" + filter.search + "%"), user: { id: ctx.userId } },
                { city: ILike("%" + filter.search + "%"), user: { id: ctx.userId } },
            ] : [
				{ user: { id: ctx.userId } }
			],// TODO: OrderInput
			relations: ["user"]
		})
	}

	@Authorized()
	@Query(() => Property, { nullable: true })
	async property(@Arg("data") data: PropertyInput) {

		// console.log(ctx.req.session)// TODO: ne devrait pas être nul
		
		// @ts-ignore
		const property = await Property.findOne({ id: data.propertyId }, { relations: ["user"] })
		if (!property) return

		// console.log('properties: ', property.properties)

		return property;
	}

	@Authorized()
	@Mutation(() => Property, { nullable: true })
	async createProperty(@Arg("data") data: CreatePropertyInput, @Ctx() ctx: MyContext) {

		console.log("createProperty: ", data)
		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })
		if (!user) return

		const property = await Property.create({
			reference: data.reference,
			address: data.address,
			postalCode: data.postalCode,
			city: data.city,
			lot: data.lot,
			floor: data.floor,
			roomCount: data.roomCount,
			area: data.area,
			heatingType: data.heatingType,
			hotWater: data.hotWater,
			user: user
		}).save();

		console.log(property)

		// await property.save();
		return property;
	}

	@Authorized()
	@Mutation(() => Int)
	async updateProperty(@Arg("data") data: UpdatePropertyInput) {

		const property = await Property.update(data.id, {
			reference: data.reference,
			address: data.address,
			postalCode: data.postalCode,
			city: data.city,
			lot: data.lot,
			floor: data.floor,
			roomCount: data.roomCount,
			area: data.area,
			heatingType: data.heatingType,
			hotWater: data.hotWater
		})
		console.log('updateProperty: ', property)

		if (property.affected !== 1) return 0

		return 1
	}

	@Authorized()
	@Mutation(() => Int)
	async deleteProperty(@Arg("data") data: DeletePropertyInput) {

		const property = await Property.delete(data.propertyId)

		console.log('deleteProperty: ', property)

		if (property.affected !== 1) return 0

		return 1
	}

}
