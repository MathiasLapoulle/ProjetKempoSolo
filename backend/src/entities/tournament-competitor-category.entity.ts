import { EntitySchema } from "@mikro-orm/core";
import { Category } from "./Category.entity.ts";
import { Competitor } from "./Competitor.entity.ts";
import { Tournament } from "./Tournament.entity.ts";

export class TournamentCompetitorCategory {
  tournament!: Tournament;
  competitor!: Competitor;
  category?: Category;
}

export const TournamentCompetitorCategorySchema = new EntitySchema({
  class: TournamentCompetitorCategory,
  properties: {
    tournament: {type: Tournament, kind: "m:1", entity: () => Tournament, primary: true},
    competitor: {type: Competitor, kind: "m:1", entity: () => Competitor, primary: true},
    category: {type: Category, kind: "m:1", entity: () => Category, nullable: true},
    }
});
