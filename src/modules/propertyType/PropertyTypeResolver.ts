import { Resolver, Query, Mutation, Ctx, Arg, Int, Authorized } from "type-graphql";
import { ILike } from 'typeorm';

import { PropertyType } from "../../entity/PropertyType";

import { CreatePropertyTypeInput } from "./CreatePropertyTypeInput";
import { PropertyTypesFilterInput } from "./PropertyTypesFilterInput";
import { DeletePropertyTypeInput } from "./DeletePropertyTypeInput";
import { UpdatePropertyTypeInput } from "./UpdatePropertyTypeInput";
import { PropertyTypeInput } from "./PropertyTypeInput";

import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";

// import { PropertyTypeInput } from "./PropertyTypeInput"

@Resolver()
export class PropertyTypeResolver {
	@Authorized()
	@Query(() => [PropertyType])
	propertyTypes(@Arg("filter", { nullable: true }) filter?: PropertyTypesFilterInput) {
		return PropertyType.find({
            where: filter ? [
                { type: ILike("%" + filter.search + "%") },
            ] : [],
			order: { type: 'ASC' },
			relations: ["user"]
        })
	}

	@Authorized()
	@Query(() => PropertyType, { nullable: true })
	async propertyType(@Arg("data") data: PropertyTypeInput) {

		// @ts-ignore
		const propertyType = await PropertyType.findOne({ id: data.PropertyTypeId }, { relations: ["user"] })
		if (!propertyType) return

		return propertyType;
	}

	@Authorized()
	@Mutation(() => PropertyType, { nullable: true })
	async createPropertyType(@Arg("data") data: CreatePropertyTypeInput, @Ctx() ctx: MyContext) {

		console.log(ctx.req.session)// TODO: ne devrait pas être nul

		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })
		if (!user) return

		const propertyType = await PropertyType.create({
			type: data.type,
			user: user,
		}).save();

		console.log(propertyType)

		// await PropertyType.save();
		return propertyType;
	}

	@Authorized()
	@Mutation(() => Int)
	async updatePropertyType(@Arg("data") data: UpdatePropertyTypeInput) {

		const propertyType = await PropertyType.update(data.id, {
            type: data.type,
		})
		console.log('updatePropertyType: ', propertyType)

		if (propertyType.affected !== 1) return 0

		return 1
	}

	@Authorized()
	@Mutation(() => Int)
	async deletePropertyType(@Arg("data") data: DeletePropertyTypeInput) {

		const propertyType = await PropertyType.delete(data.propertyTypeId)

		console.log('deletePropertyType: ', propertyType)

		if (propertyType.affected !== 1) return 0

		return 1
	}

}
