import Search from "./Model/search";
import * as searchView from "./View/searchView";
import {DOM, renderLoader, clearLoader} from "./View/base";

/*global state 
- search Obj
- current recipes Obj
- shopping list obj
- liked recipes
*/
const state = {};

const searchCtrl = async () => {
    // get query from searchView
    const query = searchView.getInput();

    if(query){
        // ADD new search from query to state
        state.search = new Search(query);

        // PREPARE UI for results
        searchView.clearInput();
        searchView.clearResult();
        renderLoader(DOM.searchResults);

        // WAIT state searching 
        await state.search.searchResult();
        
        // RENDER results from searchvView on UI
        clearLoader();
        searchView.renderResult(state.search.result);
        //console.log(state.search.result);
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
})
