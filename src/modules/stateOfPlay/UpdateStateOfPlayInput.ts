import { Field, InputType } from "type-graphql";
// @ts-ignore
import { GraphQLUpload, FileUpload } from "graphql-upload";

import { UpdateOwnerInput } from "../owner/UpdateOwnerInput";
import { UpdatePropertyInput } from "../property/UpdatePropertyInput";
import { UpdateRepresentativeInput } from "../representative/UpdateRepresentativeInput";
import { UpdateTenantInput } from "../tenant/UpdateTenantInput";

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
    images: [String]
  
    @Field(() => [GraphQLUpload])
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
  images: [String]

  @Field(() => [GraphQLUpload])
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
  images: [String]

  @Field(() => [GraphQLUpload])
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
  images: [String]

  @Field(() => [GraphQLUpload])
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
  images: [String]

  @Field(() => [GraphQLUpload])
  newImages: [FileUpload]
}

@InputType()
class UpdateStateOfPlayRoomInput {
    @Field()
    name: String

    @Field(() => [UpdateStateOfPlayDecorationInput])
    decorations: [UpdateStateOfPlayDecorationInput]

    @Field(() => [UpdateStateOfPlayElectricityInput])
    electricities: [UpdateStateOfPlayElectricityInput]
  
    @Field(() => [UpdateStateOfPlayEquipmentInput])
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
    
    @Field(() => UpdateRepresentativeInput)
    representative: UpdateRepresentativeInput

    @Field(() => [UpdateTenantInput])
    tenants: [UpdateTenantInput]

    @Field(() => [UpdateStateOfPlayRoomInput])
    rooms: [UpdateStateOfPlayRoomInput]

    @Field(() => [UpdateStateOfPlayKeyInput])
    keys: [UpdateStateOfPlayKeyInput]
  
    @Field(() => [UpdateStateOfPlayMeterInput])
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
}
