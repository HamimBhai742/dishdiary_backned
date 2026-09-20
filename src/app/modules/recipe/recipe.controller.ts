import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { RecipeService } from "./recipe.service";

const getAllRecipes = catchAsync(async (req: Request, res: Response) => {
  const { search, category, difficulty, sortBy, page, limit } = req.query;

  const result = await RecipeService.getAllRecipes({
    search: search as string,
    category: category as string,
    difficulty: difficulty as string,
    sortBy: sortBy as string,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Recipes retrieved successfully",
    metaData: result.meta,
    data: result.data,
  });
});

const getRecipeById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await RecipeService.getRecipeById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Recipe details retrieved successfully",
    data: result,
  });
});

const createRecipe = catchAsync(async (req: Request, res: Response) => {
  const result = await RecipeService.createRecipe(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Recipe created successfully in database",
    data: result,
  });
});

const updateRecipe = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await RecipeService.updateRecipe(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Recipe updated successfully",
    data: result,
  });
});

const deleteRecipe = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await RecipeService.deleteRecipe(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Recipe deleted successfully",
    data: result,
  });
});

const seedRecipes = catchAsync(async (req: Request, res: Response) => {
  await RecipeService.seedInitialRecipes();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Initial recipes seeded into MongoDB database",
    data: null,
  });
});

export const RecipeController = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  seedRecipes,
};
