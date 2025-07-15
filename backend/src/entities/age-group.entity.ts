import { EntitySchema } from "@mikro-orm/core";

export class AgeGroup {
    id!: number ;
    name!: string;
    age_min!: number;
    age_max!: number;
}

export const AgeGroupSchema = new EntitySchema({
    class: AgeGroup,
    properties: {
        id: { type: Number,primary:true,autoincrement: true},
        name: {type: String},
        age_min: {type: Number},
        age_max: {type: Number}
    }
})