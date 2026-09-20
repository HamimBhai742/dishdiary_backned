import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { RecipeController } from "./recipe.controller";
import { RecipeValidation } from "./recipe.validation";

const router = Router();

router.get("/", RecipeController.getAllRecipes);
router.get("/:id", RecipeController.getRecipeById);

router.post(
  "/",
  validateRequest(RecipeValidation.createRecipeValidationSchema),
  RecipeController.createRecipe
);

router.patch(
  "/:id",
  validateRequest(RecipeValidation.updateRecipeValidationSchema),
  RecipeController.updateRecipe
);

router.delete("/:id", RecipeController.deleteRecipe);

router.post("/seed", RecipeController.seedRecipes);

export const recipeRoutes = router;
