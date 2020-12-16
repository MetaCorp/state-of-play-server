import { Resolver, Query, Mutation, Ctx, Arg, Int, Authorized } from "type-graphql";
import { ILike } from 'typeorm';

import { Room } from "../../entity/Room";

import { CreateRoomInput } from "./CreateRoomInput";
import { RoomsFilterInput } from "./RoomsFilterInput";
import { DeleteRoomInput } from "./DeleteRoomInput";
import { UpdateRoomInput } from "./UpdateRoomInput";
import { RoomInput } from "./RoomInput";

import { MyContext } from "../../types/MyContext";
import { User } from "../../entity/User";

// import { RoomInput } from "./RoomInput"

@Resolver()
export class RoomResolver {
	@Authorized()
	@Query(() => [Room])
	rooms(@Arg("filter", { nullable: true }) filter?: RoomsFilterInput) {
		return Room.find({
            where: filter ? [
                { name: ILike("%" + filter.search + "%") },
            ] : [],
			order: { name: 'ASC' },
			relations: ["user"]
        })
	}

	@Authorized()
	@Query(() => Room, { nullable: true })
	async room(@Arg("data") data: RoomInput) {

		// @ts-ignore
		const room = await Room.findOne({ id: data.roomId }, { relations: ["user"] })
		if (!room) return

		return room;
	}

	@Authorized()
	@Mutation(() => Room, { nullable: true })
	async createRoom(@Arg("data") data: CreateRoomInput, @Ctx() ctx: MyContext) {

		console.log(ctx.req.session)// TODO: ne devrait pas être nul

		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })
		if (!user) return

		const room = await Room.create({
            name: data.name,
			user: user,
		}).save();

		console.log(room)

		// await room.save();
		return room;
	}

	@Authorized()
	@Mutation(() => Int)
	async updateRoom(@Arg("data") data: UpdateRoomInput) {

		// @ts-ignore
		const room = await Room.update(data.id, {
            name: data.name,
		})
		console.log('updateRoom: ', room)

		if (room.affected !== 1) return 0

		return 1
	}

	@Authorized()
	@Mutation(() => Int)
	async deleteRoom(@Arg("data") data: DeleteRoomInput) {

		const room = await Room.delete(data.roomId)

		console.log('deleteRoom: ', room)

		if (room.affected !== 1) return 0

		return 1
	}

}
