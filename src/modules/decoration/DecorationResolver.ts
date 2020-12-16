import { Resolver, Query, Mutation, Ctx, Arg, Int, Authorized } from "type-graphql";
import { ILike } from 'typeorm';

import { Decoration } from "../../entity/Decoration";

import { CreateDecorationInput } from "./CreateDecorationInput";
import { DecorationsFilterInput } from "./DecorationsFilterInput";
import { DeleteDecorationInput } from "./DeleteDecorationInput";
import { UpdateDecorationInput } from "./UpdateDecorationInput";
import { DecorationInput } from "./DecorationInput";

import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";

// import { DecorationInput } from "./DecorationInput"

@Resolver()
export class DecorationResolver {
	@Authorized()
	@Query(() => [Decoration])
	decorations(@Arg("filter", { nullable: true }) filter?: DecorationsFilterInput) {
		return Decoration.find({
            where: filter ? [
                { type: ILike("%" + filter.search + "%") },
            ] : [],
			order: { type: 'ASC' },
			relations: ["user"]
        })
	}

	@Authorized()
	@Query(() => Decoration, { nullable: true })
	async decoration(@Arg("data") data: DecorationInput) {

		// @ts-ignore
		const decoration = await Decoration.findOne({ id: data.decorationId }, { relations: ["user"] })
		if (!decoration) return

		return decoration;
	}

	@Authorized()
	@Mutation(() => Decoration, { nullable: true })
	async createDecoration(@Arg("data") data: CreateDecorationInput, @Ctx() ctx: MyContext) {

		console.log(ctx.req.session)// TODO: ne devrait pas être nul

		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })
		if (!user) return

		const decoration = await Decoration.create({
            type: data.type,
			user: user,
		}).save();

		console.log(decoration)

		// await decoration.save();
		return decoration;
	}

	@Authorized()
	@Mutation(() => Int)
	async updateDecoration(@Arg("data") data: UpdateDecorationInput) {

		const decoration = await Decoration.update(data.id, {
            type: data.type,
		})
		console.log('updateDecoration: ', decoration)

		if (decoration.affected !== 1) return 0

		return 1
	}

	@Authorized()
	@Mutation(() => Int)
	async deleteDecoration(@Arg("data") data: DeleteDecorationInput) {

		const decoration = await Decoration.delete(data.decorationId)

		console.log('deleteDecoration: ', decoration)

		if (decoration.affected !== 1) return 0

		return 1
	}

}
