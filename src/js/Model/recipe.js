import axios from 'axios';
import uniqid from 'uniqid';

export default class Recipe {
   constructor(id) {
      this.id = id;
   }

   async getRecipe() {
      const res = await axios(
         `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`,
      );
      try {
         this.title = res.data.recipe.title;
         this.author = res.data.recipe.publisher;
         this.img = res.data.recipe.image_url;
         this.url = res.data.recipe.source_url;
         this.ingredients = res.data.recipe.ingredients;
      } catch (error) {
         alert(error);
      }
   }

   calcTime() {
      const numIngredients = this.ingredients.length;
      const periods = Math.ceil(numIngredients / 3);
      this.time = periods * 15;
   }

   servingSize() {
      this.servings = 4;
   }

   parseIngredients() {
      const unitLong = [
         'tablespoons',
         'tablespoon',
         'teaspoons',
         'teaspoon',
         'cups',
         'bounces',
         'bounce',
      ];
      const unitShort = ['tbsp', 'tbsp', 'tsp', 'tsp', 'cup', 'oz', 'oz'];
      const units = [...unitShort, 'kg', 'g'];

      // create new ingredients arr by return new value from iterating initial ingredients
      const newIngredients = this.ingredients.map((e) => {
         let ingredients = e.toLowerCase(); // lower all elements in array

         unitLong.forEach((unit, index) => {
            ingredients = ingredients.replace(unit, units[index]); //replace initial units to short ones
         });

         ingredients = ingredients.replace(/ *\([^)]*\) */g, ' '); // remove parentheses

         const ingredientsArr = ingredients.split(' ');
         const unitIndex = ingredientsArr.findIndex((e2) => units.includes(e2)); // get index of units (tsp, tbps, cup, etc ...)

         let ingredientsObj;
         let id = uniqid();
         if (unitIndex > -1) {
            // there are both numbers and units

            const numberArr = ingredientsArr.slice(0, unitIndex); //split numbers from ingredient arr, not included end parameter

            let number;

            if (numberArr.length === 1) {
               number = eval(ingredientsArr[0].replace('-', '+')); // eg. 5-1/2 => 5+1/2 => eval(5+1/2) = 5.5
            } else {
               number = eval(ingredientsArr.slice(0, unitIndex).join('+'));
            }

            ingredientsObj = {
               id,
               number,
               unit: ingredientsArr[unitIndex],
               ingredients: ingredientsArr.slice(unitIndex + 1).join(' '), //slice from unitIndex + 1
            };
         } else if (parseInt(ingredientsArr[0], 10)) {
            // there is only number
            ingredientsObj = {
               id,
               number: parseInt(ingredientsArr[0], 10), //index 0 = number
               unit: '',
               ingredients: ingredientsArr.slice(1).join(' '), // slice from index = 1
            };
         } else if (unitIndex === -1) {
            // there are no num and unit in ingredients
            ingredientsObj = {
               id,
               number: 1,
               unit: '',
               ingredients,
            };
         }
         return ingredientsObj;
      });
      this.ingredients = newIngredients;
   }

   updateServingSize(type) {
      const newServingSize =
         type === 'dec' ? this.servings - 1 : this.servings + 1;

      // update ingredients
      this.ingredients.map((el) => {
         el.number *= newServingSize / this.servings;
      });

      return (this.servings = newServingSize);
   }
}
