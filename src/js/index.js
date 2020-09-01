import Search from './Model/search';
import Recipe from './Model/recipe';
import List from './Model/list';
import Like from './Model/like';
import * as searchView from './View/searchView';
import * as recipeView from './View/recipeView';
import * as listView from './View/listView';
import * as likeView from './View/likeView';
import { DOM, renderLoader, clearLoader } from './View/base';

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

   if (query) {
      // ADD new search obj from query to state
      state.search = new Search(query);

      // PREPARE UI for results
      searchView.clearInput();
      searchView.clearResult();

      renderLoader(DOM.searchResults);

      try {
         // GET search data
         await state.search.searchResult();

         // RENDER results from searchvView on UI
         clearLoader();
         searchView.renderResult(state.search.result);
         //console.log(state.search.result);}
      } catch (error) {
         alert(error);
      }
   }
};

//-------- SEARCH btn handler
DOM.searchForm.addEventListener('submit', (e) => {
   // prevent a btn to submit the form
   e.preventDefault();

   searchCtrl();
});

//-------- PAGES btn handler
DOM.resultPage.addEventListener('click', (e) => {
   const btn = e.target.closest('.btn-inline');
   if (btn) {
      const goToPage = parseInt(btn.dataset.goto, 10);

      searchView.clearResult();
      searchView.renderResult(state.search.result, goToPage);
   }
});

/********************** RECIPE CONTROLER *********************/

const recipeCtrl = async () => {
   const id = window.location.hash.replace('#', '');

   if (id) {
      // PREPARE UI changes
      recipeView.clearRecipe();
      renderLoader(DOM.recipe);

      if (state.search) searchView.highlightSelected(id);

      //CREATE new recipe obj
      state.recipe = new Recipe(id);

      try {
         //GET recipe data
         await state.recipe.getRecipe();

         //PARSE ingredients
         state.recipe.parseIngredients();

         //CALC time cooking && serving size
         state.recipe.calcTime();
         state.recipe.servingSize();

         //RENDER data on UI
         clearLoader();
         recipeView.renderRecipe(state.recipe, state.likes.isLike(id));
      } catch (error) {
         console.log(error);
      }
   }
};

//loop multiple event handler => avoid DRY, instead of multi code lines
//event triggered when hash url change the ID
['hashchange', 'load'].forEach((e) => window.addEventListener(e, recipeCtrl));

/********************** ITEM LIST CONTROLER *********************/

const listCtrl = (ingrID) => {
   if (!state.list) state.list = new List();
   let ingrItem, ingrList;
   if (ingrID) {
      //loop each ingredient in the list of ingredients
      //in condition, if ingredient id === ingr target => ingrItem = ingrArr
      for (let e of state.recipe.ingredients) {
         if (e.id === ingrID) ingrItem = e;
      }
      ingrList = state.list.addItem(
         ingrItem.id,
         ingrItem.number,
         ingrItem.unit,
         ingrItem.ingredients,
      );
      listView.renderItem(ingrList);
   } else {
      state.recipe.ingredients.forEach((e) => {
         let item = state.list.addItem(e.id, e.number, e.unit, e.ingredients);
         listView.renderItem(item);
      });
   }
   listView.renderClearItemsBtn(state.list.items); //toggle clear items btn
};

// DELETE and UPDATE handler on list state and UI
DOM.shoppingList.addEventListener('click', (e) => {
   const id = e.target.closest('.shopping__item').dataset.id;

   if (e.target.matches('.shopping__delete, .shopping__delete *')) {
      // delete item in list state and on UI
      state.list.deleteItem(id);
      listView.deleteItem(id);
   } else if (
      e.target.matches('.shopping__number-value, .shopping__number-value *')
   ) {
      // update number in list state

      if (e.target.value > 0) {
         // avoid neg number update in list state
         const numValue = parseFloat(e.target.value, 10);
         state.list.updateItem(id, numValue);
      }
   }
});

// ClEAR ALL LIST BTN
DOM.shopping.addEventListener('click', (e) => {
   if (e.target.matches('.shopping__delete__all, .shopping__delete__all *')) {
      state.list.clearItems(); //delete data array in LIST
      listView.clearItems(); //delete items on LIST UI
      listView.renderClearItemsBtn(state.list.items); //toggle clear items btn
   }
});

/********************** LIKES CONTROLER *********************/

const likeCtrl = () => {
   if (!state.likes) state.likes = new Like();

   const currentID = state.recipe.id;

   if (!state.likes.isLike(currentID)) {
      //if recipe id is NOT liked
      // add liked data in state
      const newLike = state.likes.addLike(
         currentID,
         state.recipe.title,
         state.recipe.author,
         state.recipe.img,
      );

      //toggle like button
      likeView.toggleLikeBtn(true);

      //add liked item on UI
      likeView.renderLike(newLike);
   } else {
      //if recipe id is LIKED
      // delete liked data in state
      state.likes.deleteLike(currentID);

      //toggle like button
      likeView.toggleLikeBtn(false);

      //delete liked item on UI
      likeView.deleteLike(currentID);
   }
   likeView.likeField(state.likes.getNumLikes());
};

/********************** BTNS EVENT HANDLER CONTROLER *********************/

//-------- SERVING SIZE btn, ADD SHOPPING LIST btn, LIKE btn
DOM.recipe.addEventListener('click', (e) => {
   if (e.target.matches('.btn-descrease, .btn-descrease *')) {
      // descrease serving btn
      if (state.recipe.servings > 1) {
         // avoid neg serving update in recipe state
         state.recipe.updateServingSize('dec');
         recipeView.updateIngredients(state.recipe);
      }
   } else if (e.target.matches('.btn-increase, .btn-increase *')) {
      // increase serving btn
      state.recipe.updateServingSize('inc');
      recipeView.updateIngredients(state.recipe);
   } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
      // add all ingredients btn to shopping list
      listCtrl();
   } else if (e.target.matches('.recipe__icon, .recipe__icon *')) {
      let ingrID;
      // add single ingredients check to shopping list
      ingrID = e.target.closest('.recipe__item').dataset.itemid;
      listCtrl(ingrID);
   } else if (e.target.matches('.recipe__love, .recipe__love *')) {
      likeCtrl();
   }
});

/********************** LOCAL STORAGE CONTROLER *********************/
// recall data from localStorage
window.addEventListener('load', () => {
   state.list = new List();
   state.likes = new Like();

   state.list.readLocalStorage(); // read localStorage of LIST
   state.likes.readLocalStorage(); // read localStorage of LIKES

   likeView.likeField(state.likes.getNumLikes()); // toggle likes btn
   listView.renderClearItemsBtn(state.list.items); //toggle clear items btn

   state.list.items.forEach((item) => listView.renderItem(item)); //iterate array and render each one
   state.likes.likes.forEach((like) => likeView.renderLike(like));
});
