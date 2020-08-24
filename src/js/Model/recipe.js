import axios from 'axios';

export default class Recipe{
    constructor(id){
        this.id = id;
    }

    async getRecipe(){
        const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
        try{
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        }catch (error){
            alert(error);
        }
    }

    calcTime (){
        const numIngredients = this.ingredients.length;
        const periods = Math.ceil(numIngredients / 3);
        this.time = periods * 15;
    }

    servingSize (){
        this.servings = 4;
    }
}