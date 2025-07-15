import { getApp } from "../../api/get-app.ts";
import { WeightCategory } from "../../entities/weight-category.ts";
import { WeightCategoriesRoutes } from "./weight-categories.openapi.ts";


export function buildWeightCategoriesRouter() {
    const router = getApp()

    return router.openapi(WeightCategoriesRoutes.getWeightCategories, async (ctx) => {
        const em = ctx.get("em");
        const result = await em.find(WeightCategory, {});
        return ctx.json(result,200)
    })

    .openapi(WeightCategoriesRoutes.getWeightCategoriesById, async (ctx) => {
        const { id } = ctx.req.valid('param')
        const em = ctx.get("em");
        const result = await em.findOne(WeightCategory, { id })
        if (result == null) {
            return ctx.text("Not found", 404);
        }

        return ctx.json(
            result
        , 200)
    })
}