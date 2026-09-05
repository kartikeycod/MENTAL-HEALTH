/**
 * Pure 28-day meal plan generator logic.
 * Preserves regional and diet-type substitutions.
 */
export const generateMealPlan = (region = "default", dietType = "balanced") => {
  const base = {
    balanced: [
      ["Oats + fruit + nuts", "Lentils + rice + salad", "Grilled fish/chickpeas + veggies"],
      ["Smoothie bowl", "Whole-grain wrap + veggies", "Paneer/tofu + brown rice"],
      ["Eggs/tofu + toast", "Quinoa + dal + spinach", "Soup + whole-grain bread"],
      ["Upma/poha + fruit", "Rice + lentil curry + veg", "Grilled chicken/chickpeas"],
      ["Oat pancakes + berries", "Vegetable khichdi", "Dal + chapati + veg"],
      ["Fruit bowl + seeds", "Couscous + lentils", "Fish/tofu + salad"],
      ["Idli/dosa + chutney", "Vegetable rice + yogurt", "Soup + salad"],
    ],
    vegetarian: [
      ["Oats + fruit + nuts", "Lentils + rice + salad", "Paneer/tofu + veggies"],
      ["Smoothie bowl", "Whole-grain wrap + veggies", "Chickpeas + spinach"],
      ["Poha + fruit", "Quinoa + dal + spinach", "Soup + bread"],
      ["Upma + banana", "Rice + lentil curry", "Dal + veg + chapati"],
      ["Oat pancakes + berries", "Vegetable khichdi", "Dal + salad"],
      ["Fruit bowl + seeds", "Couscous + lentils", "Tofu + salad"],
      ["Idli/dosa + chutney", "Vegetable rice + yogurt", "Soup + veg"],
    ],
    vegan: [
      ["Oats + fruit + nuts", "Chickpeas + rice + salad", "Tofu + veggies"],
      ["Smoothie bowl", "Whole-grain wrap + veggies", "Lentil curry + quinoa"],
      ["Poha + fruit", "Quinoa + beans + greens", "Soup + bread"],
      ["Upma + banana", "Rice + lentils + veg", "Veg stew + rice"],
      ["Oat pancakes + berries", "Vegetable khichdi", "Tofu + salad"],
      ["Fruit bowl + seeds", "Couscous + lentils", "Bean soup + salad"],
      ["Idli/dosa + chutney", "Veg rice + salad", "Soup + veg"],
    ],
  };

  const selectedList = base[dietType] || base.balanced;

  if (region && region.toLowerCase().includes("india")) {
    return selectedList.map((d) =>
      d.map((m) =>
        m.replace("Whole-grain bread", "Chapati").replace("Couscous", "Millet")
      )
    );
  }

  return selectedList;
};
