import { v4 } from "uuid";
import { Category } from "./Category.entity.ts";
import { Competitor } from "./Competitor.entity.ts";
import { EntitySchema, type Opt } from "@mikro-orm/core";

export class Match {
    id!: string
    competitor1!: Competitor
    competitor2!: Competitor
    score1: number & Opt = 0
    score2: number & Opt = 0
    category!: Category
    keikuka1: number & Opt = 0
    keikuka2: number & Opt = 0
    winner!: Competitor | null
    isFinished: boolean & Opt = false
    pool_number: string & Opt = "0"   // 0 for one pool, 1 for pool 1 if multiple pool and 2 for pool 2  and 0l-1 for first place and 0-3 for third place
    next_match?: Match | null 

}

export const MatchSchema = new EntitySchema({
    class: Match,
    properties: {
        id: { type: 'uuid', onCreate: () => v4(), primary: true },
        competitor1: { kind: 'm:1', entity: () => Competitor,nullable: true },
        competitor2: { kind: 'm:1', entity: () => Competitor,nullable: true },
        score1: { type: 'number', default: 0 },
        score2: { type: 'number', default: 0 },
        category: { kind: 'm:1', entity: () => Category },
        keikuka1: { type: 'number', default: 0 },
        keikuka2: { type: 'number', default: 0 },
        winner: { kind: 'm:1', entity: () => Competitor, nullable: true, default: null },
        isFinished: { type: 'boolean', default: false, onCreate: () => false },
        pool_number: { type: 'string', default: "0" },
        next_match: { kind: 'm:1', entity: () => Match, nullable: true, default: null },
    }
});
        