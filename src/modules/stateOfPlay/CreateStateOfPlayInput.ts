import { Field, InputType } from "type-graphql";
// @ts-ignore
import { GraphQLUpload, FileUpload } from "graphql-upload";

import { CreateOwnerInput } from "../owner/CreateOwnerInput";
import { CreatePropertyInput } from "../property/CreatePropertyInput";
import { CreateRepresentativeInput } from "../representative/CreateRepresentativeInput";
import { CreateTenantInput } from "../tenant/CreateTenantInput";
import { ArrayMaxSize } from "class-validator";

const MAX_IMAGES = 5;
const MAX_ENTITIES = 15;
const MAX_ROOMS = 10;

@InputType()
class CreateStateOfPlayDecorationInput {
  @Field()
  type: String
  
  @Field()
  nature: String
  
  @Field()
  state: String
  
  @Field()
  comments: String

  @Field(() => [String])
  @ArrayMaxSize(MAX_IMAGES)
  images: [String]

  @Field(() => [GraphQLUpload])
  @ArrayMaxSize(MAX_IMAGES)
  newImages: [FileUpload]
}


@InputType()
class CreateStateOfPlayElectricityInput {
  @Field()
  type: String
  
  @Field()
  quantity: Number
  
  @Field()
  state: String
  
  @Field()
  comments: String

  @Field(() => [String])
  @ArrayMaxSize(MAX_IMAGES)
  images: [String]

  @Field(() => [GraphQLUpload])
  @ArrayMaxSize(MAX_IMAGES)
  newImages: [FileUpload]
}

@InputType()
class CreateStateOfPlayEquipmentInput {
  @Field()
  type: String
  
  @Field()
  quantity: Number

  @Field()
  brandOrObject: String
  
  @Field()
  state: String
  
  @Field()
  comments: String

  @Field(() => [String])
  @ArrayMaxSize(MAX_IMAGES)
  images: [String]

  @Field(() => [GraphQLUpload])
  @ArrayMaxSize(MAX_IMAGES)
  newImages: [FileUpload]
}

@InputType()
class CreateStateOfPlayMeterInput {
  @Field()
  type: String
  
  @Field()
  location: String

  @Field()
  index: Number

  @Field()
  dateOfSuccession: String

  @Field(() => [String])
  @ArrayMaxSize(MAX_IMAGES)
  images: [String]

  @Field(() => [GraphQLUpload])
  @ArrayMaxSize(MAX_IMAGES)
  newImages: [FileUpload]
}

@InputType()
class CreateStateOfPlayKeyInput {
  @Field()
  type: String

  @Field()
  comments: String

  @Field()
  quantity: Number

  @Field(() => [String])
  @ArrayMaxSize(MAX_IMAGES)
  images: [String]

  @Field(() => [GraphQLUpload])
  @ArrayMaxSize(MAX_IMAGES)
  newImages: [FileUpload]
}


@InputType()
class CreateStateOfPlayRoomInput {
  @Field()
  name: String

  @Field(() => [CreateStateOfPlayDecorationInput])
  @ArrayMaxSize(MAX_ENTITIES)
  decorations: [CreateStateOfPlayDecorationInput]

  @Field(() => [CreateStateOfPlayElectricityInput])
  @ArrayMaxSize(MAX_ENTITIES)
  electricities: [CreateStateOfPlayElectricityInput]

  @Field(() => [CreateStateOfPlayEquipmentInput])
  @ArrayMaxSize(MAX_ENTITIES)
  equipments: [CreateStateOfPlayEquipmentInput]
}

@InputType()
class CreateStateOfPlayInsuranceInput {
  @Field()
  company: String

  @Field()
  number: String

  @Field()
  dateStart: String

  @Field()
  dateEnd: String
}

@InputType()
export class CreateStateOfPlayInput {// TODO
  @Field()
  out: boolean;

  @Field(() => CreatePropertyInput)
  property: CreatePropertyInput
  
  @Field(() => CreateOwnerInput)
  owner: CreateOwnerInput
  
  @Field(() => CreateRepresentativeInput)
  representative: CreateRepresentativeInput

  @Field(() => [CreateTenantInput])
  tenants: [CreateTenantInput]

  @Field(() => [CreateStateOfPlayRoomInput])
  @ArrayMaxSize(MAX_ROOMS)
  rooms: [CreateStateOfPlayRoomInput]
  
  @Field(() => [CreateStateOfPlayMeterInput])
  @ArrayMaxSize(MAX_ENTITIES)
  meters: [CreateStateOfPlayMeterInput]

  @Field(() => [CreateStateOfPlayKeyInput])
  @ArrayMaxSize(MAX_ENTITIES)
  keys: [CreateStateOfPlayKeyInput]

  @Field(() => CreateStateOfPlayInsuranceInput)
  insurance: CreateStateOfPlayInsuranceInput

  @Field()
  comments: String
  
  @Field()
  reserve: String

  @Field()
  documentHeader: String

  @Field()
  documentEnd: String

  @Field()
  entryExitDate: String

  @Field()
  date: String

  @Field()
  city: String

  @Field(() => GraphQLUpload, { nullable: true })
  newPdf?: FileUpload
}
