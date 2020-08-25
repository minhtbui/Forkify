import Search from "./Model/search";
import Recipe from "./Model/recipe";
import * as searchView from "./View/searchView";
import * as recipeView from "./View/recipeView";
import {DOM, renderLoader, clearLoader} from "./View/base";

/*global state 
- search Obj
- current recipes Obj
- shopping list obj
- liked recipes
*/
const state = {};

/********************** SEARCH CONTROLER *********************/
const searchCtrl = async () => {
    // get query from searchView
    const query = searchView.getInput();

    if(query){
        // ADD new search obj from query to state
        state.search = new Search(query);

        // PREPARE UI for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(DOM.searchResults);

        try{
            // GET search data 
            await state.search.searchResult();
            
            // RENDER results from searchvView on UI
            clearLoader();
            searchView.renderResult(state.search.result);
            //console.log(state.search.result);}
        }catch(error){
            alert(error);
        }
    }
    
};

DOM.searchForm.addEventListener('submit', e => {
    // prevent a btn to submit the form
    e.preventDefault();

    searchCtrl();
});

DOM.resultPage.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResult();
        searchView.renderResult(state.search.result, goToPage);
    }
});


/********************** RECIPE CONTROLER *********************/
const recipeCtrl = async () => {
    const id = window.location.hash.replace("#", "");
    
    if(id){
        // PREPARE UI changes
        recipeView.clearRecipe();
        renderLoader(DOM.recipe);

        if (state.search) searchView.highlightSelected(id);

        //CREATE new recipe obj
        state.recipe = new Recipe(id);
        
        try{
            //GET recipe data
            await state.recipe.getRecipe();

            //PARSE ingredients
            state.recipe.parseIngredients();

            //CALC time cooking && serving size
            state.recipe.calcTime();
            state.recipe.servingSize();

            //RENDER data on UI
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (error) {
            console.log(error);
        }
    }
}
//loop multiple event handler => avoid DRY, instead of multi code lines
//event triggered when hash url change the ID
['hashchange', 'load'].forEach(e => window.addEventListener(e, recipeCtrl));

//increase and descrease btns event handler
DOM.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-descrease, .btn-descrease *')){
        if (state.recipe.servings > 1) {
            state.recipe.updateServingSize('dec');
            recipeView.updateIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServingSize('inc');
        recipeView.updateIngredients(state.recipe);
    }
    console.log(state.recipe);
})