import { Resolver, Query, Mutation, Ctx, Arg, Int, Authorized } from "type-graphql";
import { ILike } from 'typeorm';

import { Tenant } from "../../entity/Tenant";

import { CreateTenantInput } from "./CreateTenantInput";
import { TenantsFilterInput } from "./TenantsFilterInput";
import { DeleteTenantInput } from "./DeleteTenantInput";
import { UpdateTenantInput } from "./UpdateTenantInput";
import { TenantInput } from "./TenantInput";

import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";

// import { TenantInput } from "./TenantInput"

@Resolver()
export class TenantResolver {
	@Authorized()
	@Query(() => [Tenant])
	tenants(@Arg("filter", { nullable: true }) filter?: TenantsFilterInput) {
		return Tenant.find({
            where: filter ? [
                { lastName: ILike("%" + filter.search + "%") },
                { firstName: ILike("%" + filter.search + "%") },
            ] : [],
			order: { lastName: 'ASC', firstName: 'ASC' },
			relations: ["user"]
        })
	}

	@Authorized()
	@Query(() => Tenant, { nullable: true })
	async tenant(@Arg("data") data: TenantInput) {

		// @ts-ignore
		const tenant = await Tenant.findOne({ id: data.tenantId }, { relations: ["user"] })
		if (!tenant) return

		return tenant;
	}

	@Authorized()
	@Mutation(() => Tenant, { nullable: true })
	async createTenant(@Arg("data") data: CreateTenantInput, @Ctx() ctx: MyContext) {

		console.log(ctx.req.session)// TODO: ne devrait pas être nul

		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })
		if (!user) return

		const tenant = await Tenant.create({
            firstName: data.firstName,
            lastName: data.lastName,
			address: data.address,
			postalCode: data.postalCode,
			city: data.city,
			user: user,
		}).save();

		console.log(tenant)

		// await tenant.save();
		return tenant;
	}

	@Authorized()
	@Mutation(() => Int)
	async updateTenant(@Arg("data") data: UpdateTenantInput) {

		console.log('updateTenant: ', data)

		const tenant = await Tenant.update(data.id, {
            firstName: data.firstName,
            lastName: data.lastName,
			address: data.address,
			postalCode: data.postalCode,
			city: data.city,
		})
		console.log('updateTenant: ', tenant)

		if (tenant.affected !== 1) return 0

		return 1
	}

	@Authorized()
	@Mutation(() => Int)
	async deleteTenant(@Arg("data") data: DeleteTenantInput) {

		const tenant = await Tenant.delete(data.tenantId)

		console.log('deleteTenant: ', tenant)

		if (tenant.affected !== 1) return 0

		return 1
	}

}
