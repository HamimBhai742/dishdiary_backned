import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { userRoutes } from "../modules/user/user.routes";
import { recipeRoutes } from "../modules/recipe/recipe.routes";
import { uploadRoutes } from "../modules/upload/upload.routes";

export const router = Router();

const moduleRoutes: Array<{ path: string; route: Router }> = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/recipes",
    route: recipeRoutes,
  },
  {
    path: "/upload",
    route: uploadRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


