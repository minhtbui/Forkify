export const DOM = {
   searchForm: document.querySelector('.search'),
   searchInput: document.querySelector('.search__field'),
   searchResults: document.querySelector('.results'),
   resultList: document.querySelector('.results__list'),
   resultPage: document.querySelector('.results__pages'),
   recipe: document.querySelector('.recipe'),
   recipeList: document.querySelector('.recipe__ingredient-list'),
   recipeItem: document.querySelector('.recipe__item'),
   shoppingList: document.querySelector('.shopping__list'),
   shopping: document.querySelector('.shopping'),
   delAllBtn: document.querySelector('.shopping__delete__all'),
   likeField: document.querySelector('.likes__field'),
   likeList: document.querySelector('.likes__list'),
};

const DOMstrings = {
   loader: 'loader',
};

export const renderLoader = (parent) => {
   const loader = `
        <div class ="${DOMstrings.loader}">
            <svg>
                <use href = "img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
   parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
   const loader = document.querySelector(`.${DOMstrings.loader}`); // create DOM loader here bcuz it's appeared after searching
   if (loader) loader.parentElement.removeChild(loader);
};
