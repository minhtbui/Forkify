import {DOM} from "./base";

export const getInput = () => DOM.searchInput.value;

export const clearInput = () => {
    DOM.searchInput.value = "";
};

export const clearResult = () => {
    DOM.resultList.innerHTML = "";
    DOM.resultPage.innerHTML = "";
};

export const highlightSelected = id => {
    const highlightedArr = Array.from(document.querySelectorAll('.results__link--active'));
    highlightedArr.forEach(e => { // loop the array and remove its class element 
        e.classList.remove('results__link--active');
    });
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}

/*
eg: Pasta with tomato and pinach 
acc: 0/ acc + cur.length/ 0 + 5 = 5 < 17/ true => push [Pasta]
acc: 5/ acc + cur.length/ 5 + 4 = 9 < 17/ true => push [Pasta with]
acc: 9/ acc + cur.length/ 9 + 6 = 15 < 17/ true => push [Pasta with tomata]
acc: 15/ acc + cur.length/ 15 + 3 = 18 > 17/ false => stop
*/
const limitTitleChar = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit){
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length; // return acc = acc + cur.length
        }, 0); // initial acc = 0
        return `${newTitle.join(' ')} ...`;
    }
    return title; // if title < limit
};

//------------- add data recipe to html string for html file
const renderRecipe = el => {
    const markup = `
    <li>
        <a class="results__link" href="#${el.recipe_id}">
            <figure class="results__fig">
                <img src="${el.image_url}" alt="${el.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitTitleChar(el.title)}</h4>
                <p class="results__author">${el.publisher}</p>
            </div>
        </a>
    </li>`;
    // add custom html string to html file
    DOM.resultList.insertAdjacentHTML('beforeend', markup);
};

//------------- create page btn to html for html string
const pageBtn = (page, type) => ` 
        <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev'? page - 1: page + 1}>
            <span>Page ${type === 'prev'? page - 1: page + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev'? 'left': 'right'}"></use>
            </svg>
        </button>
`;

//------------- render btn in page condition
const renderBtn = (recipeNum, page, recipePerPage) => {
    const pages = Math.ceil(recipeNum/ recipePerPage); //round up decimal number
    let btn;

    if (page === 1 && pages > 1) {     //if page = 1 => next btn
        btn = pageBtn(page, 'next'); 

    } else if (page < pages) {     //else if mid pages => 2 bnt prev and next
        btn = `
            ${pageBtn(page, 'prev')}
            ${pageBtn(page, 'next')}`;
    } else if (page === pages && pages > 1) {    //else if last page => pre btn
        btn = pageBtn(page, 'prev');
    }
    DOM.resultPage.insertAdjacentHTML('afterbegin', btn);
};

//------------- loop the recipe data and render on UI
export const renderResult = (recipes, page = 1, recipePerPage = 10) => {
    const start = (page - 1) * recipePerPage; // (1-1) *6 = 0 index of recipe
    const end = page * recipePerPage; // 1*6 = 6 index of recipe

    recipes.slice(start, end).forEach(el => renderRecipe(el));
    renderBtn(recipes.length, page, recipePerPage);
};