import { createRoute, z } from "@hono/zod-openapi";
import { CompetitorSchema, CompetitorSchemaCreate, CompetitorSchemaUpdate } from "./competitors.schema.ts";

export const CompetitorsRoutes = {
    get: createRoute({
        method: 'get',
        path: '/{id}',
        summary: 'Get one competitor',
        description: 'Get one competitor by ID',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'Details of the competitor',
                content: {
                    'application/json': {
                        schema: CompetitorSchema
                    }
                }
            },
            404: {
                description: 'Competitor not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }

        }
    }),
    post: createRoute({
        method: 'post',
        path: '',
        summary: 'Create one competitor',
        description: 'Create one competitor',
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: CompetitorSchemaCreate
                    }
                }
            }
        },
        headers: new Headers({ 'Content-Type': 'application/json' }),

        responses: {
            201: {
                description: 'Competitor created',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },

        }
    }),
    put: createRoute({
        method: 'put',
        path: '/{id}',
        summary: 'Modify one competitor',
        description: 'Modify one competitor',

        headers: new Headers({ 'Content-Type': 'application/json' }),
        request: {
            params: z.object({
                id: z.string().uuid(),

            }),
            body: {
                content: {
                    "application/json": {
                        schema: CompetitorSchemaUpdate
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'Competitor modified',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Competitor not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }

        }
    }),

    delete: createRoute({
        method: 'delete',
        path: '/{id}',
        summary: 'Delete one competitor',
        description: 'Delete one competitor by ID',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            202: {
                description: 'Competitor deleted',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            },
            404: {
                description: 'Competitor not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }

        }
    }),
    getByCategory: createRoute({
        method: 'get',
        path: '/categories/{id}',
        summary: 'Get all competitors by category',
        description: 'Get all competitors by category',
        request: {
            params: z.object({
                id: z.string().uuid()
            })
        },
        responses: {
            200: {
                description: 'List of competitors',
                content: {
                    'application/json': {
                        schema: z.array(CompetitorSchema)
                    }
                }
            },
            404: {
                description: 'Category not found',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }
        }
    }),
    getAll : createRoute({
        method: 'get',
        path: '/',
        summary: 'Get all competitors',
        description: 'Get all competitors',
        responses: {
            200: {
                description: 'List of competitors',
                content: {
                    'application/json': {
                        schema: z.array(CompetitorSchema)
                    }
                }
            },
        }
    }),

    importCSV: createRoute({
        method: 'post',
        path: '/import-csv',
        summary: 'Import competitors from CSV',
        description: 'Bulk import competitors from CSV data',
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.object({
                            competitors: z.array(CompetitorSchemaCreate)
                        })
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'Competitors imported successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                            imported: z.number(),
                            failed: z.number()
                        })
                    }
                }
            },
            400: {
                description: 'Bad request',
                content: {
                    "text/plain": {
                        schema: z.string()
                    }
                }
            }
        }
    }),

    
}