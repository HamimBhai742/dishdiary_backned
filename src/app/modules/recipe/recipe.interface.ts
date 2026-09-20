export interface IRecipeFilter {
  search?: string;
  category?: string;
  difficulty?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface IRecipeCreateInput {
  title: string;
  category: string;
  difficulty?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  rating?: number;
  reviewsCount?: number;
  author?: string;
  authorRole?: string;
  authorAvatar?: string;
  image: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  featured?: boolean;
}
