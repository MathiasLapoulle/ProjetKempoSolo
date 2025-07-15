import { Collection, EntitySchema } from "@mikro-orm/core";
import { EnumRank, Tournament } from './Tournament.entity.ts';
import { EnumGender, WeightCategory } from './weight-category.ts';
import { v4 } from "uuid";
import { Competitor } from "./Competitor.entity.ts";
import { AgeGroup } from "./age-group.entity.ts";

export enum EnumEliminationType {
    DIRECT = 'Directe',
    POOL = 'Poule',
}

export class Category {
    id!: string;
    name!: string;
    tournament!: Tournament;
    rank!: EnumRank[];
    gender?: EnumGender;
    weight_category?: WeightCategory;
    age_group?: AgeGroup
    elimination_type!: EnumEliminationType;
    competitors = new Collection<Competitor>(this);
}

export const CategorySchema = new EntitySchema({
    class: Category,
    properties: {
        id: { type: 'uuid', onCreate: () => v4(), primary: true },
        name: { type: 'string', nullable: true },
        tournament: { kind: 'm:1', entity: () => Tournament },
        rank: {type: 'array' },
        gender: { enum: true, items: () => Object.values(EnumGender), nullable: true },
        weight_category: { kind: 'm:1', entity: () => WeightCategory, nullable: true },
        age_group: { kind: 'm:1', entity: () => AgeGroup, nullable: true },
        elimination_type: { enum: true, items: () => Object.values(EnumEliminationType) },
        competitors: { kind: 'm:n', entity: () => Competitor, pivotTable: 'tournament_competitor_category' }
       
    }
});

