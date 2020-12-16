import { Resolver, Query, Mutation, Ctx, Arg, Int, Authorized } from "type-graphql";
import { ILike } from 'typeorm';

import { Key } from "../../entity/Key";

import { CreateKeyInput } from "./CreateKeyInput";
import { KeysFilterInput } from "./KeysFilterInput";
import { DeleteKeyInput } from "./DeleteKeyInput";
import { UpdateKeyInput } from "./UpdateKeyInput";
import { KeyInput } from "./KeyInput";

import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";

// import { KeyInput } from "./KeyInput"

@Resolver()
export class KeyResolver {
	@Authorized()
	@Query(() => [Key])
	keys(@Arg("filter", { nullable: true }) filter?: KeysFilterInput) {
		return Key.find({
            where: filter ? [
                { type: ILike("%" + filter.search + "%") },
            ] : [],
			order: { type: 'ASC' },
			relations: ["user"]
        })
	}

	@Authorized()
	@Query(() => Key, { nullable: true })
	async key(@Arg("data") data: KeyInput) {

		// @ts-ignore
		const key = await Key.findOne({ id: data.keyId }, { relations: ["user"] })
		if (!key) return

		return key;
	}

	@Authorized()
	@Mutation(() => Key, { nullable: true })
	async createKey(@Arg("data") data: CreateKeyInput, @Ctx() ctx: MyContext) {

		console.log(ctx.req.session)// TODO: ne devrait pas être nul

		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })
		if (!user) return

		const key = await Key.create({
			type: data.type,
			user: user,
		}).save();

		console.log(key)

		// await key.save();
		return key;
	}

	@Authorized()
	@Mutation(() => Int)
	async updateKey(@Arg("data") data: UpdateKeyInput) {

		const key = await Key.update(data.id, {
            type: data.type,
		})
		console.log('updateKey: ', key)

		if (key.affected !== 1) return 0

		return 1
	}

	@Authorized()
	@Mutation(() => Int)
	async deleteKey(@Arg("data") data: DeleteKeyInput) {

		const key = await Key.delete(data.keyId)

		console.log('deleteKey: ', key)

		if (key.affected !== 1) return 0

		return 1
	}

}
