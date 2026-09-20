import { prisma } from "../../lib/prisma";
import { AppError } from "../../error/AppError";
import { IRecipeFilter, IRecipeCreateInput } from "./recipe.interface";
import { deleteImageFile } from "../../lib/cloudinary";

const DEFAULT_SEED_RECIPES = [
  {
    title: "Crispy Smashed Potatoes with Herb Butter",
    category: "Quick & Easy",
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 35,
    servings: 4,
    rating: 4.9,
    reviewsCount: 142,
    author: "Sarah Jenkins",
    authorRole: "Culinary Editor",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    description: "Tender baby Yukon gold potatoes gently smashed to perfection, roasted until deeply golden and crispy, then drizzled with aromatic garlic rosemary herb butter and flaked sea salt.",
    ingredients: [
      "1.5 lbs baby Yukon Gold or red potatoes",
      "3 tbsp unsalted butter, melted",
      "2 tbsp extra virgin olive oil",
      "3 cloves garlic, finely minced",
      "1 tbsp freshly chopped rosemary",
      "1 tbsp chopped fresh parsley",
      "1/2 tsp sea salt flakes & cracked black pepper",
      "Grated Parmesan cheese (optional garnish)"
    ],
    instructions: [
      "Place potatoes in a large pot with cold salted water. Bring to a rolling boil and simmer for 15-20 minutes until fork-tender.",
      "Drain thoroughly and allow to steam-dry for 5 minutes.",
      "Preheat your oven to 425°F (220°C) and oil a heavy-duty baking sheet.",
      "Arrange potatoes on the sheet and use the flat bottom of a glass or mug to gently smash each potato to about 1/2-inch thickness.",
      "Whisk together melted butter, olive oil, minced garlic, rosemary, salt, and pepper. Brush generously over potatoes.",
      "Roast for 30-35 minutes until the edges are deep golden-brown and crackling crisp. Garnish with parsley and serve hot."
    ],
    featured: true
  },
  {
    title: "Fresh Herb & Citrus Garden Salad with Garlic Emulsion",
    category: "Lunch",
    difficulty: "Easy",
    prepTime: 12,
    cookTime: 0,
    servings: 2,
    rating: 4.8,
    reviewsCount: 89,
    author: "Elena Rostova",
    authorRole: "Plant-Based Chef",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
    description: "Crisp market greens paired with sweet citrus ribbons, fresh dill, basil, and an emulsified roasted garlic vinaigrette.",
    ingredients: [
      "5 cups mixed baby greens & arugula",
      "1 cup fresh cilantro, mint, and dill sprigs",
      "1 pink grapefruit, segmented",
      "1 Hass avocado, thinly sliced",
      "1/4 cup toasted pumpkin seeds (pepitas)",
      "3 tbsp extra virgin olive oil",
      "1.5 tbsp fresh lemon juice",
      "1 clove roasted garlic, finely crushed",
      "1 tsp pure maple syrup",
      "Sea salt & fresh cracked pepper"
    ],
    instructions: [
      "Wash and thoroughly spin-dry the mixed greens and fresh herb sprigs.",
      "Segment the grapefruit over a small bowl to catch the sweet natural citrus juices.",
      "In a small mixing bowl, whisk olive oil, lemon juice, collected grapefruit juice, crushed garlic, and maple syrup until emulsified.",
      "Arrange the crisp greens on a wide serving platter. Top with sliced avocado and bright citrus segments.",
      "Drizzle dressing over the salad just before serving and finish with toasted crunchy pepitas."
    ],
    featured: false
  },
  {
    title: "Artisan Sourdough Toast with Avocado & Poached Egg",
    category: "Breakfast",
    difficulty: "Medium",
    prepTime: 10,
    cookTime: 8,
    servings: 1,
    rating: 4.9,
    reviewsCount: 215,
    author: "Marco Rossi",
    authorRole: "Baker & Barista",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    description: "Toasted country sourdough slab topped with creamy smashed Haas avocado, pickled shallots, microgreens, and a silky 4-minute soft poached egg.",
    ingredients: [
      "2 thick slices country artisan sourdough bread",
      "1 large ripe Hass avocado",
      "2 fresh organic eggs",
      "1 tbsp white vinegar (for poaching)",
      "1 tsp fresh lemon juice",
      "1 tbsp chili flakes & toasted everything bagel seasoning",
      "Handful of fresh microgreens or pea shoots",
      "Extra virgin olive oil for finishing"
    ],
    instructions: [
      "Toast sourdough slices in a hot cast-iron pan with a brush of olive oil until golden and crunchy.",
      "Mash avocado in a bowl with lemon juice, salt, and freshly cracked pepper.",
      "Bring 3 inches of water to a gentle simmer in a skillet, add vinegar, create a gentle whirlpool, and drop eggs in.",
      "Poach gently for 3.5 to 4 minutes for runny yolks, then gently remove with a slotted spoon onto paper towels.",
      "Spread luscious avocado over sourdough, top with poached eggs, sprinkle chili flakes and microgreens, and serve immediately."
    ],
    featured: true
  },
  {
    title: "Creamy Tuscan Sun-Dried Tomato Garlic Chicken",
    category: "Dinner",
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 25,
    servings: 4,
    rating: 5.0,
    reviewsCount: 310,
    author: "Sarah Jenkins",
    authorRole: "Culinary Editor",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    description: "Golden seared chicken cutlets bathed in a velvety garlic cream sauce loaded with tangy sun-dried tomatoes, fresh baby spinach, and aged parmesan.",
    ingredients: [
      "2 large chicken breasts, sliced horizontally into cutlets",
      "2 tbsp olive oil & 1 tbsp butter",
      "4 cloves fresh garlic, minced",
      "1/2 cup sun-dried tomatoes in oil, drained and sliced",
      "1 cup heavy cream or coconut cream",
      "1/2 cup organic chicken bone broth",
      "1/2 cup freshly grated Parmigiano-Reggiano",
      "2 cups fresh baby spinach leaves",
      "1 tsp dried Italian herb blend"
    ],
    instructions: [
      "Season chicken cutlets with salt, black pepper, and Italian herbs.",
      "Sear cutlets in hot olive oil over medium-high heat for 4-5 minutes per side until golden brown. Transfer to a warm plate.",
      "In the same skillet, melt butter and sauté garlic and sun-dried tomatoes for 1-2 minutes until fragrant.",
      "Pour in chicken broth and heavy cream, scraping up the browned pan bits. Bring to a gentle simmer.",
      "Stir in grated parmesan cheese until silky and smooth, then fold in spinach until gently wilted.",
      "Return chicken and juices back into the sauce for 2 minutes to glaze. Serve hot over pasta, rice, or with warm bread."
    ],
    featured: true
  },
  {
    title: "Handmade Ricotta Gnocchi with Brown Butter Sage",
    category: "Dinner",
    difficulty: "Hard",
    prepTime: 40,
    cookTime: 10,
    servings: 3,
    rating: 4.9,
    reviewsCount: 178,
    author: "Marco Rossi",
    authorRole: "Baker & Barista",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    description: "Pillow-soft Italian dumplings crafted from whole milk ricotta, tossed in nutty browned European butter, crisp fresh sage leaves, and freshly cracked pepper.",
    ingredients: [
      "2 cups whole milk ricotta, well-drained overnight",
      "2 large egg yolks",
      "3/4 cup grated Parmigiano-Reggiano",
      "1 cup '00' flour or unbleached all-purpose flour",
      "Pinch of freshly grated nutmeg",
      "6 tbsp European unsalted butter",
      "12-15 fresh sage leaves",
      "Flaked Maldon sea salt"
    ],
    instructions: [
      "Ensure ricotta is thoroughly strained so the dough stays light and pillowy.",
      "Gently mix ricotta, egg yolks, parmesan, salt, and nutmeg in a bowl. Fold in flour just until dough forms a soft ball.",
      "Divide into 4 ropes and slice into 1-inch gnocchi pillows. Dust lightly with flour.",
      "Melt butter in a skillet over medium heat until foamy and hazelnut-brown. Drop sage leaves and fry until crispy.",
      "Boil gnocchi in salted water for 2-3 minutes until they float to the top. Transfer with a spider strainer directly into brown butter.",
      "Toss gently to coat, finish with additional parmesan and crunchy fried sage."
    ],
    featured: false
  },
  {
    title: "Decadent Valrhona Dark Chocolate Molten Lava Cake",
    category: "Dessert",
    difficulty: "Medium",
    prepTime: 15,
    cookTime: 12,
    servings: 2,
    rating: 4.9,
    reviewsCount: 264,
    author: "Elena Rostova",
    authorRole: "Plant-Based Chef",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    description: "Rich dark chocolate cake with a warm flowing liquid center, topped with powdered sugar and fresh tart raspberries.",
    ingredients: [
      "100g 70% dark bittersweet chocolate",
      "1/2 cup unsalted butter",
      "2 large whole eggs + 2 egg yolks",
      "1/3 cup granulated sugar",
      "2 tbsp all-purpose flour",
      "Pinch of fine espresso powder & sea salt",
      "Butter & cocoa powder for ramekins",
      "Fresh raspberries and vanilla bean ice cream to serve"
    ],
    instructions: [
      "Preheat oven to 425°F (220°C). Butter two 6-oz ramekins and dust generously with cocoa powder.",
      "Melt chocolate and butter together in a heatproof bowl set over simmering water until velvety.",
      "Whisk eggs, yolks, and sugar vigorously in a separate bowl until pale and slightly thick.",
      "Fold melted chocolate mixture into the eggs, then gently sift in flour and espresso powder.",
      "Divide batter between ramekins. Bake for 11-12 minutes until edges are set but center has a slight jiggle.",
      "Invert onto plates immediately, dust with powdered sugar, and serve with vanilla ice cream."
    ],
    featured: false
  },
  {
    title: "Mediterranean Quinoa Bowl with Tahini Lime Dressing",
    category: "Healthy",
    difficulty: "Easy",
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    rating: 4.8,
    reviewsCount: 94,
    author: "Elena Rostova",
    authorRole: "Plant-Based Chef",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    description: "Nutritious fluffy quinoa layered with roasted spiced chickpeas, Persian cucumbers, Kalamata olives, creamy tahini dressing, and fresh herbs.",
    ingredients: [
      "1 cup cooked tricolor quinoa",
      "1 can (15 oz) chickpeas, rinsed and roasted with smoked paprika & cumin",
      "1 cup Persian cucumber, diced",
      "1/2 cup cherry tomatoes, halved",
      "1/4 cup Kalamata olives, pitted and sliced",
      "3 tbsp organic creamy tahini",
      "2 tbsp fresh lime juice",
      "1-2 tbsp warm water to thin",
      "Fresh mint and sumac for garnish"
    ],
    instructions: [
      "Toss chickpeas in olive oil, cumin, paprika, and salt. Roast at 400°F (200°C) for 20 minutes until crunchy.",
      "Whisk tahini, lime juice, warm water, and a pinch of salt until smooth and pourable.",
      "Divide fluffy cooked quinoa into two serving bowls.",
      "Arrange spiced chickpeas, cucumbers, juicy cherry tomatoes, and olives on top.",
      "Drizzle generously with tahini lime dressing, sprinkle fragrant sumac and mint leaves, and enjoy."
    ],
    featured: false
  },
  {
    title: "Fluffy Brioche French Toast with Maple Pecan Glaze",
    category: "Breakfast",
    difficulty: "Easy",
    prepTime: 10,
    cookTime: 10,
    servings: 3,
    rating: 4.9,
    reviewsCount: 165,
    author: "Sarah Jenkins",
    authorRole: "Culinary Editor",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    description: "Golden-brown thick sliced brioche soaked in rich vanilla cinnamon custard, caramelized on a hot griddle, and crowned with toasted pecans and pure Canadian maple syrup.",
    ingredients: [
      "6 thick slices artisanal brioche or challah bread",
      "3 large free-range eggs",
      "3/4 cup whole milk or half-and-half",
      "1 tbsp pure maple syrup",
      "1 tsp pure vanilla bean paste",
      "1/2 tsp ground Ceylon cinnamon & nutmeg",
      "2 tbsp butter for frying",
      "1/3 cup toasted pecan halves and fresh berries for topping"
    ],
    instructions: [
      "Whisk eggs, milk, maple syrup, vanilla, cinnamon, and nutmeg in a wide shallow dish.",
      "Preheat a cast-iron skillet or non-stick griddle over medium heat and melt a generous pat of butter.",
      "Dip each brioche slice for 15-20 seconds per side, letting custard soak through without becoming soggy.",
      "Cook on griddle for 3-4 minutes per side until deep golden and puffed in the center.",
      "Transfer to warm plates, top with butter, toasted pecans, fresh berries, and warm maple syrup."
    ],
    featured: true
  }
];

const seedInitialRecipes = async () => {
  const count = await prisma.recipe.count();
  if (count === 0) {
    for (const recipe of DEFAULT_SEED_RECIPES) {
      await prisma.recipe.create({ data: recipe });
    }
    console.log(`Seeded ${DEFAULT_SEED_RECIPES.length} initial recipes into MongoDB`);
  }
};

const getAllRecipes = async (filter: IRecipeFilter = {}) => {
  // Ensure seed data exists on first query
  const count = await prisma.recipe.count();
  if (count === 0) {
    await seedInitialRecipes();
  }

  const { search, category, difficulty, sortBy = "newest", page, limit } = filter;

  const where: any = {};

  if (category && category.toLowerCase() !== "all") {
    where.category = {
      equals: category,
      mode: "insensitive",
    };
  }

  if (difficulty && difficulty.toLowerCase() !== "all") {
    where.difficulty = {
      equals: difficulty,
      mode: "insensitive",
    };
  }

  if (search && search.trim() !== "") {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
      { author: { contains: search, mode: "insensitive" } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };

  if (sortBy === "oldest") {
    orderBy = { createdAt: "asc" };
  } else if (sortBy === "popular") {
    orderBy = { reviewsCount: "desc" };
  } else if (sortBy === "quick") {
    orderBy = { cookTime: "asc" };
  } else if (sortBy === "rating") {
    orderBy = { rating: "desc" };
  }

  const total = await prisma.recipe.count({ where });

  const take = limit ? Number(limit) : undefined;
  const skip = page && limit ? (Number(page) - 1) * Number(limit) : undefined;

  const recipes = await prisma.recipe.findMany({
    where,
    orderBy,
    take,
    skip,
  });

  return {
    meta: {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : total,
      total,
      totalPages: limit ? Math.ceil(total / Number(limit)) : 1,
    },
    data: recipes,
  };
};

const getRecipeById = async (id: string) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  return recipe;
};

const createRecipe = async (payload: IRecipeCreateInput) => {
  const result = await prisma.recipe.create({
    data: payload,
  });
  return result;
};

const updateRecipe = async (id: string, payload: Partial<IRecipeCreateInput>) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  const result = await prisma.recipe.update({
    where: { id },
    data: payload,
  });

  return result;
};

const deleteRecipe = async (id: string) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });

  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  // Delete associated image from Cloudinary or local storage
  if (recipe.image && (recipe.image.includes("res.cloudinary.com") || recipe.image.includes("/uploads/"))) {
    deleteImageFile(recipe.image).catch((err) => {
      console.warn("[Storage] Failed to delete image during recipe removal:", err);
    });
  }

  await prisma.recipe.delete({
    where: { id },
  });

  return { message: "Recipe deleted successfully" };
};

export const RecipeService = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  seedInitialRecipes,
};
