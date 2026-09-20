import { z } from "zod";

const createRecipeValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }).min(2),
    category: z.string({ required_error: "Category is required" }),
    difficulty: z.string().optional().default("Easy"),
    prepTime: z.number().optional().default(15),
    cookTime: z.number().optional().default(20),
    servings: z.number().optional().default(4),
    rating: z.number().optional().default(4.9),
    reviewsCount: z.number().optional().default(0),
    author: z.string().optional().default("DishDiary Chef"),
    authorRole: z.string().optional().default("Culinary Editor"),
    authorAvatar: z.string().optional(),
    image: z.string({ required_error: "Image URL is required" }),
    description: z.string({ required_error: "Description is required" }).min(5),
    ingredients: z.array(z.string()).min(1, "At least one ingredient is required"),
    instructions: z.array(z.string()).min(1, "At least one instruction is required"),
    featured: z.boolean().optional().default(false),
  }),
});

const updateRecipeValidationSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    category: z.string().optional(),
    difficulty: z.string().optional(),
    prepTime: z.number().optional(),
    cookTime: z.number().optional(),
    servings: z.number().optional(),
    rating: z.number().optional(),
    reviewsCount: z.number().optional(),
    author: z.string().optional(),
    authorRole: z.string().optional(),
    authorAvatar: z.string().optional(),
    image: z.string().optional(),
    description: z.string().min(5).optional(),
    ingredients: z.array(z.string()).optional(),
    instructions: z.array(z.string()).optional(),
    featured: z.boolean().optional(),
  }),
});

export const RecipeValidation = {
  createRecipeValidationSchema,
  updateRecipeValidationSchema,
};
