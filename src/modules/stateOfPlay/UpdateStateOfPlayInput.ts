import { Field, InputType } from "type-graphql";
// @ts-ignore
import { GraphQLUpload, FileUpload } from "graphql-upload";

import { UpdateOwnerInput } from "../owner/UpdateOwnerInput";
import { UpdatePropertyInput } from "../property/UpdatePropertyInput";
import { UpdateRepresentativeInput } from "../representative/UpdateRepresentativeInput";
import { UpdateTenantInput } from "../tenant/UpdateTenantInput";

import { ArrayMaxSize } from "class-validator";

const MAX_IMAGES = 5;
const MAX_ENTITIES = 15;
const MAX_ROOMS = 10;

const MAX_TENANTS = 3;

@InputType()
class UpdateStateOfPlayDecorationInput {
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
class UpdateStateOfPlayElectricityInput {
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
class UpdateStateOfPlayEquipmentInput {
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
class UpdateStateOfPlayMeterInput {
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
class UpdateStateOfPlayKeyInput {
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
class UpdateStateOfPlayRoomInput {
  @Field()
  name: String

  @Field(() => [UpdateStateOfPlayDecorationInput])
  @ArrayMaxSize(MAX_ENTITIES)
  decorations: [UpdateStateOfPlayDecorationInput]

  @Field(() => [UpdateStateOfPlayElectricityInput])
  @ArrayMaxSize(MAX_ENTITIES)
  electricities: [UpdateStateOfPlayElectricityInput]

  @Field(() => [UpdateStateOfPlayEquipmentInput])
  @ArrayMaxSize(MAX_ENTITIES)
  equipments: [UpdateStateOfPlayEquipmentInput]
}

@InputType()
class UpdateStateOfPlayInsuranceInput {
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
export class UpdateStateOfPlayInput {
  @Field()
  id: string;

  @Field(() => UpdatePropertyInput)
  property: UpdatePropertyInput
  
  @Field(() => UpdateOwnerInput)
  owner: UpdateOwnerInput
  
  @Field(() => UpdateRepresentativeInput, { nullable: true })
  representative?: UpdateRepresentativeInput | null

  @Field(() => [UpdateTenantInput])
  @ArrayMaxSize(MAX_TENANTS)
  tenants: [UpdateTenantInput]

  @Field(() => [UpdateStateOfPlayRoomInput])
  @ArrayMaxSize(MAX_ROOMS)
  rooms: [UpdateStateOfPlayRoomInput]

  @Field(() => [UpdateStateOfPlayKeyInput])
  @ArrayMaxSize(MAX_ENTITIES)
  keys: [UpdateStateOfPlayKeyInput]

  @Field(() => [UpdateStateOfPlayMeterInput])
  @ArrayMaxSize(MAX_ENTITIES)
  meters: [UpdateStateOfPlayMeterInput]
  
  @Field(() => UpdateStateOfPlayInsuranceInput)
  insurance: UpdateStateOfPlayInsuranceInput

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

  @Field(() => GraphQLUpload)
  newPdf: FileUpload
}
