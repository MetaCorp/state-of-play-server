import { Resolver, Query, Mutation, Ctx, Arg, Int, Authorized } from "type-graphql";
import { /*getManager,*/ ILike, getConnection } from "typeorm";

import { StateOfPlay } from "../../entity/StateOfPlay";

import { CreateStateOfPlayInput } from "./CreateStateOfPlayInput";
import { StateOfPlaysFilterInput } from "./StateOfPlaysFilterInput";
import { DeleteStateOfPlayInput } from "./DeleteStateOfPlayInput";
import { UpdateStateOfPlayInput } from "./UpdateStateOfPlayInput";
import { StateOfPlayInput } from "./StateOfPlayInput"

import { MyContext } from "../../types/MyContext";

import { User } from "../../entity/User";
import { Property } from "../../entity/Property";
import { Owner } from "../../entity/Owner";
import { Representative } from "../../entity/Representative";
import { Tenant } from "../../entity/Tenant";

// @ts-ignore
import { GraphQLUpload, FileUpload } from "graphql-upload";
// import { createWriteStream } from "fs";

import { uploadFile } from '../../utils/createAWS';


@Resolver()
export class StateOfPlayResolver {

	@Mutation(() => [Boolean])
	async multiUpload(@Arg('files', () => [GraphQLUpload]) files: [FileUpload]) {

		console.log('files : ', files)

		const locations = []

		const mapFiles = async (file : any) => {
			const { createReadStream, filename } = await file;
			// const writableStream = createWriteStream(
			// 	`${__dirname}/${filename}`,
			// 	{ autoClose: true }
			// );
			
			
			// const promise = new Promise((res, rej) => {
			// 	createReadStream()
			// 		.pipe(writableStream)
			// 		.on("finish", () => res(true))
			// 		.on("error", () => rej(false));
			// });

			// await promise;

			locations.push(await uploadFile(filename, createReadStream()))
		}

		const ret = files.map(mapFiles)

		return ret
	}

	@Authorized()
	@Query(() => [StateOfPlay])
	// @ts-ignore
	async stateOfPlays(@Arg("filter", { nullable: true }) filter?: StateOfPlaysFilterInput, @Ctx() ctx: MyContext) {

		const wheres : any = filter ? [
			// { property: { address: ILike("%" + filter.search + "%") } },
			// { property: { postalCode: ILike("%" + filter.search + "%") } },
			// { property: { city: ILike("%" + filter.search + "%") } },
			{ fullAddress: ILike("%" + filter.search + "%"), user: { id: ctx.userId } },
			{ ownerFullName: ILike("%" + filter.search + "%"), user: { id: ctx.userId } },
			{ tenantsFullName: ILike("%" + filter.search + "%"), user: { id: ctx.userId } }
		] : [
			{ user: { id: ctx.userId }}
		]

		if (!filter || filter && filter.in === undefined && filter.out === undefined || filter && filter.in && filter.out) {}
		else
			for (let i = 0; i < wheres.length; i++) {
				wheres[i].out = filter.out
			}

		return StateOfPlay.find({// TODO: filter ne marche pas, trouver une autre solution. => QueryBuilder, ne marche pas non plus => solution implémenter sauvegarder fullAdress sur l'entité StateOfPlay
			where: wheres,
			relations: ["user", "owner", "representative", "property", "tenants"]
		})

		// const stateOfPlays = await getManager()
		// 	.createQueryBuilder(StateOfPlay, "stateOfPlay")
		// 	.leftJoinAndSelect('stateOfPlay.user', 'user')
		// 	.leftJoinAndSelect('stateOfPlay.owner', 'owner')
		// 	.leftJoinAndSelect('stateOfPlay.representative', 'representative')
		// 	.leftJoinAndSelect('stateOfPlay.property', 'property')
		// 	.where('stateOfPlay.user.id = :userId', { userId: ctx.userId })
		// 	.andWhere("stateOfPlay.property.address ilike '%' || :address || '%'", { address: filter ? filter.search : "" })
		// 	// .orWhere("stateOfPlay.property.postalCode ilike '%' || :postalCode || '%'", { postalCode: filter ? filter.search : "" })
		// 	// .orWhere("stateOfPlay.property.city ilike '%' || :city || '%'", { city: filter ? filter.search : "" })
		// 	// .take(pagination && pagination.take)
		// 	// .skip(pagination && pagination.skip)
		// 	.getMany();

		// return stateOfPlays
	}

	@Authorized()
	@Query(() => StateOfPlay, { nullable: true })
	async stateOfPlay(@Arg("data") data: StateOfPlayInput) {

		// @ts-ignore
		const stateOfPlay = await StateOfPlay.findOne({ id: data.stateOfPlayId }, { relations: ["user", "owner", "representative", "property", "tenants"] })
		if (!stateOfPlay) return


		return stateOfPlay;
	}

	@Authorized()
	@Mutation(() => StateOfPlay, { nullable: true })
	async createStateOfPlay(@Arg("data") data: CreateStateOfPlayInput, @Ctx() ctx: MyContext) {

		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })
		if (!user) return
		console.log('user: ', user)

		// @ts-ignore
		var owner = data.owner.id && await Owner.findOne({ id: data.owner.id })
		if (!owner) {
			owner = await Owner.create({
				firstName: data.owner.firstName,
				lastName: data.owner.lastName,
				address: data.property.address,
				postalCode: data.property.postalCode,
				city: data.property.city,
				user: user,
			}).save();
		}
		console.log('owner: ', owner)
		
		// @ts-ignore
		var representative = data.representative.id && await Representative.findOne({ id: data.representative.id })
		if (!representative) {
			representative = await Representative.create({
				firstName: data.representative.firstName,
				lastName: data.representative.lastName,
				address: data.property.address,
				postalCode: data.property.postalCode,
				city: data.property.city,
				user: user,
			}).save();
		}
		console.log('representative: ', representative)

		const tenants = []
		for(let i = 0; i < data.tenants.length; i++) {
			// @ts-ignore
			var tenant = data.tenants[i].id && await Tenant.findOne({ id: data.tenants[i].id })
			if (!tenant) {
				tenant = await Tenant.create({
					firstName: data.tenants[i].firstName,
					lastName: data.tenants[i].lastName,
					address: data.property.address,
					postalCode: data.property.postalCode,
					city: data.property.city,
					user: user,
				}).save();
			}
			tenants.push(tenant)
		}
		console.log('tenants[0]: ', tenants[0])
		
		// @ts-ignore
		var property = data.property.id && await Property.findOne({ id: data.property.id })
		if (!property) {
			property = await Property.create({
				reference: data.property.reference,
				address: data.property.address,
				postalCode: data.property.postalCode,
				city: data.property.city,
				lot: data.property.lot,
				floor: data.property.floor,
				roomCount: data.property.roomCount,
				area: data.property.area,
				heatingType: data.property.heatingType,
				hotWater: data.property.hotWater,
				user: user
			}).save();
		}
		console.log('property: ', property)

		for (let i = 0; i < data.rooms.length; i++) {
			
			for (let j = 0; j < data.rooms[i].decorations.length; j++) {
				
				for (let k = 0; k < data.rooms[i].decorations[j].newImages.length; k++) {
					const image = data.rooms[i].decorations[j].newImages[k];
					const { createReadStream, filename } = await image;

					// @ts-ignore
					data.rooms[i].decorations[j].images.push(await uploadFile(filename, createReadStream()))
				}
				
				for (let k = 0; k < data.rooms[i].electricities[j].newImages.length; k++) {
					const image = data.rooms[i].electricities[j].newImages[k];
					const { createReadStream, filename } = await image;

					// @ts-ignore
					data.rooms[i].electricities[j].images.push(await uploadFile(filename, createReadStream()))
				}

				for (let k = 0; k < data.rooms[i].equipments[j].newImages.length; k++) {
					const image = data.rooms[i].equipments[j].newImages[k];
					const { createReadStream, filename } = await image;

					// @ts-ignore
					data.rooms[i].equipments[j].images.push(await uploadFile(filename, createReadStream()))
				}
			}
		}

		for (let i = 0; i < data.meters.length; i++) {
				
			for (let j = 0; j < data.meters[i].newImages.length; j++) {
				const image = data.meters[i].newImages[j];
				const { createReadStream, filename } = await image;

				// @ts-ignore
				data.meters[i].images.push(await uploadFile(filename, createReadStream()))
			}
		}

		for (let i = 0; i < data.keys.length; i++) {
				
			for (let j = 0; j < data.keys[i].newImages.length; j++) {
				const image = data.keys[i].newImages[j];
				const { createReadStream, filename } = await image;

				// @ts-ignore
				data.keys[i].images.push(await uploadFile(filename, createReadStream()))
			}
		}

		const stateOfPlay = await StateOfPlay.create({
			fullAddress: property.address + ', ' + property.postalCode + ' ' + property.city,// needed for search (issue nested search doesnt work)
			ownerFullName: owner.firstName + ' ' + owner.lastName,
			tenantsFullName: tenants.map(tenant => tenant.firstName + ' ' + tenant.lastName),
			user: user,
			owner: owner,
			representative: representative,
			tenants: tenants,
			property: property,
			out: data.out,
			rooms: JSON.stringify(data.rooms),
			meters: JSON.stringify(data.meters),
			keys: JSON.stringify(data.keys),
			insurance: JSON.stringify(data.insurance),
			comments: data.comments,
			reserve: data.reserve,
			documentHeader: data.documentHeader,
			documentEnd: data.documentEnd,
		}).save();
		console.log('stateOfPlay: ', stateOfPlay)

		// await stateOfPlay.save();
		return stateOfPlay;
	}
	
	@Authorized()
	@Mutation(() => Int)
	async updateStateOfPlay(@Arg("data") data: UpdateStateOfPlayInput, @Ctx() ctx: MyContext) {

		// @ts-ignore
		const user = await User.findOne({ id: ctx.userId })
		if (!user) return
		console.log('user: ', user)

		// @ts-ignore
		var owner = data.owner.id && await Owner.findOne({ id: data.owner.id })
		if (!owner) {
			owner = await Owner.create({
				firstName: data.owner.firstName,
				lastName: data.owner.lastName,
				address: data.owner.address,
				postalCode: data.owner.postalCode,
				city: data.owner.city,
				user: user,
			}).save();
		}
		console.log('owner: ', owner)
		
		// @ts-ignore
		var representative = data.representative.id && await Representative.findOne({ id: data.representative.id })
		if (!representative) {
			representative = await Representative.create({
				firstName: data.representative.firstName,
				lastName: data.representative.lastName,
				address: data.representative.address,
				postalCode: data.representative.postalCode,
				city: data.representative.city,
				user: user,
			}).save();
		}
		console.log('representative: ', representative)

		const tenants = []
		for(let i = 0; i < data.tenants.length; i++) {
			// @ts-ignore
			var tenant = data.tenants[i].id && await Tenant.findOne({ id: data.tenants[i].id })
			if (!tenant) {
				tenant = await Tenant.create({
					firstName: data.tenants[i].firstName,
					lastName: data.tenants[i].lastName,
					address: data.tenants[i].address,
					postalCode: data.tenants[i].postalCode,
					city: data.tenants[i].city,
					user: user,
				}).save();
			}
			tenants.push(tenant)
		}
		console.log('tenants[0]: ', tenants[0])
		
		// @ts-ignore
		var property = data.property.id && await Property.findOne({ id: data.property.id })
		if (!property) {
			property = await Property.create({
				reference: data.property.reference,
				address: data.property.address,
				postalCode: data.property.postalCode,
				city: data.property.city,
				lot: data.property.lot,
				floor: data.property.floor,
				roomCount: data.property.roomCount,
				area: data.property.area,
				heatingType: data.property.heatingType,
				hotWater: data.property.hotWater,
				user: user
			}).save();
		}
		console.log('property: ', property)

		const connection = getConnection();

		const stateOfPlay2 = await connection.getRepository(StateOfPlay).findOne(data.id);
		if (!stateOfPlay2) return 0

		for (let i = 0; i < data.rooms.length; i++) {
			
			for (let j = 0; j < data.rooms[i].decorations.length; j++) {
				
				for (let k = 0; k < data.rooms[i].decorations[j].newImages.length; k++) {
					const image = data.rooms[i].decorations[j].newImages[k];
					const { createReadStream, filename } = await image;

					// @ts-ignore
					data.rooms[i].decorations[j].images.push(await uploadFile(filename, createReadStream()))
				}
				
				for (let k = 0; k < data.rooms[i].electricities[j].newImages.length; k++) {
					const image = data.rooms[i].electricities[j].newImages[k];
					const { createReadStream, filename } = await image;

					// @ts-ignore
					data.rooms[i].electricities[j].images.push(await uploadFile(filename, createReadStream()))
				}

				for (let k = 0; k < data.rooms[i].equipments[j].newImages.length; k++) {
					const image = data.rooms[i].equipments[j].newImages[k];
					const { createReadStream, filename } = await image;

					// @ts-ignore
					data.rooms[i].equipments[j].images.push(await uploadFile(filename, createReadStream()))
				}
			}
		}

		for (let i = 0; i < data.meters.length; i++) {
				
			for (let j = 0; j < data.meters[i].newImages.length; j++) {
				const image = data.meters[i].newImages[j];
				const { createReadStream, filename } = await image;

				// @ts-ignore
				data.meters[i].images.push(await uploadFile(filename, createReadStream()))
			}
		}

		for (let i = 0; i < data.keys.length; i++) {
				
			for (let j = 0; j < data.keys[i].newImages.length; j++) {
				const image = data.keys[i].newImages[j];
				const { createReadStream, filename } = await image;

				// @ts-ignore
				data.keys[i].images.push(await uploadFile(filename, createReadStream()))
			}
		}


		stateOfPlay2.fullAddress = property.address + ', ' + property.postalCode + ' ' + property.city// needed for search (issue nested search doesnt work)
		stateOfPlay2.ownerFullName = owner.firstName + ' ' + owner.lastName
		// @ts-ignore
		stateOfPlay2.tenantsFullName = tenants.map(tenant => tenant.firstName + ' ' + tenant.lastName)
		stateOfPlay2.user = user
		stateOfPlay2.owner = owner
		stateOfPlay2.representative = representative
		// @ts-ignore
		stateOfPlay2.tenants = tenants
		stateOfPlay2.property = property
		stateOfPlay2.rooms = JSON.stringify(data.rooms)
		stateOfPlay2.meters = JSON.stringify(data.meters)
		stateOfPlay2.keys = JSON.stringify(data.keys)
		stateOfPlay2.insurance = JSON.stringify(data.insurance)
		stateOfPlay2.comments = data.comments
		stateOfPlay2.reserve = data.reserve
		stateOfPlay2.documentHeader = data.documentHeader
		stateOfPlay2.documentEnd = data.documentEnd

		const ret = await connection.getRepository(StateOfPlay).save(stateOfPlay2)

		// const stateOfPlay = { affected: 0}
		console.log('stateOfPlay: ', ret)

		// if (stateOfPlay.affected !== 1) return 0

		return 1
	}

	@Authorized()
	@Mutation(() => Int)
	async deleteStateOfPlay(@Arg("data") data: DeleteStateOfPlayInput) {

		const stateOfPlay = await StateOfPlay.delete(data.stateOfPlayId)

		console.log('deleteStateOfPlay: ', stateOfPlay)

		if (stateOfPlay.affected !== 1) return 0

		return 1
	}

}
