export const DOM = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResults: document.querySelector('.results'),
    resultList: document.querySelector('.results__list'),
    resultPage: document.querySelector('.results__pages'),
};

const DOMstrings = {
    loader: 'loader',
}

export const renderLoader = parent => {
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
