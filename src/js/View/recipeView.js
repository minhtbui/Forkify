import { DOM } from "./base";
import {Fraction} from "fractional";

export const clearRecipe = () => {
    DOM.recipe.innerHTML = "";
};

// single ingredient
const ingredientsList = ingredient => ` 
        <li class="recipe__item">
            <svg class="recipe__icon">
                <use href="img/icons.svg#icon-check"></use>
            </svg>
            <div class="recipe__count">${formatNumber(ingredient.number)}</div>
            <div class="recipe__ingredient">
                <span class="recipe__unit">${ingredient.unit}</span>
                ${ingredient.ingredients}
            </div>
        </li>`;
        
const formatNumber = number => { // format number in ingredient to fractional number
    if (number){
        const newNumber = Math.round(number * 1000) / 1000;
        const [int, dec] = newNumber.toString().split('.').map(el => parseInt(el, 10));
        
        if (!dec) return newNumber;

        if(int === 0){
            const fr = new Fraction(newNumber);
            return `${fr.numerator}/${fr.denominator}`;
        }else {
            const fr = new Fraction(newNumber - int);
            return `${int} ${fr.numerator}/${fr.denominator}`;
        }
    }
    return '?';
};

export const renderRecipe = (recipe, isLiked) => {
    const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>
        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-descrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                </svg>
            </button>
        </div>

        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(element => ingredientsList(element)).join('')}
            </ul>
            <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>

            </a>
        </div>
    `;
    DOM.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const updateIngredients = recipe => {
    // update serving size on UI
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;
    // update number ingredients on UI
    const numberArr = Array.from(document.querySelectorAll('.recipe__count'));
    numberArr.forEach((currrent, index) => { // loop the query array
        currrent.textContent = formatNumber(recipe.ingredients[index].number); //numberIngr on UI = data number of Ingredients[index];
    });
}