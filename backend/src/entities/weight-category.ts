import { EntitySchema } from "@mikro-orm/core";
import { AgeGroup } from "./age-group.entity.ts";

export enum EnumGender{
    MAN = 'H',
    WOMAN = 'F'
}



export class WeightCategory{
    id!: number ;
    name!: string;
    weight_min!: number;
    weight_max!: number;
    age_group!: AgeGroup;
    gender!: EnumGender
}


export const WeightCategorySchema = new EntitySchema({
    class: WeightCategory,
    properties: {
        id: { type: Number,primary:true,autoincrement: true},
        name: {type: String},
        weight_min: {type: Number},
        weight_max: {type: Number},
        age_group: {kind: 'm:1',entity: ()=> AgeGroup},
        gender: { enum: true, items: () => Object.values(EnumGender)}
    }
})