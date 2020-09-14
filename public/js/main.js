const state = {};

var controlSearch = (function() {

    return {
        result: function(query){
            fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=89a5e1f5ea6cf6130b6a5c8fd4cf8605`)
            .then(response => response.json())
            .then(data => {
                    state.res = data.results
            });
        }
    };

})();

var UIController = (function() {

    var DOMstrings = {
        searchForm: document.querySelector('.search__btn'),
        searchInput: document.querySelector('.search__field'),
        searchResultList: document.querySelector('.results__list'),
        searchRes: document.querySelector('.results'),
        searchResPages: document.querySelector('.results__pages'),
        recipe: document.querySelector('.recipe'),
        shopping: document.querySelector('.shopping__list'),
        likesMenu: document.querySelector('.likes__field'),
        likesList:document.querySelector('.likes__list')
    };

    const renderMovies = movie => {

        const markUp = `
        <li>
            <a class="results__link" href="#${movie.id}">
                <figure class="results__fig">
                    <img src='http://image.tmdb.org/t/p/w500/${movie.poster_path}' alt="${movie.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${movie.title}</h4>
                    <p class="results__author">${movie.original_language}</p>
                </div>
            </a>
        </li>
        `;

        DOMstrings.searchResultList.insertAdjacentHTML('beforeend', markUp);
       // DOMstrings.searchResultList.insertAdjacentHTML('beforeEnd',markUp);
    
    };

    return {

        getInput: function() {
            return {
                query: DOMstrings.searchInput.value
            }
        },
        getDOMStrings: function() {
			return DOMstrings;
        },

        renderResults: (recipes, page = 1, resPerPage = 10) => {

            const start = (page - 1) * resPerPage;
            const end = page * resPerPage;
            recipes.slice(start, end).forEach(renderMovies);
        
            // renderButtons(page, recipes.length, resPerPage);
        }
    }



})();

var controller = (function(searchCtrl, UICtrl) {
    // const url = 'https://api.themoviedb.org/3/search/movie?query=avengers&api_key=89a5e1f5ea6cf6130b6a5c8fd4cf8605';

    var setUpEventListeners = () => {

        var DOM = UICtrl.getDOMStrings();
        DOM.searchForm.addEventListener('click', searchMovie);
    };

    var searchMovie = function() {
        var input, res;

        input = UICtrl.getInput();
        
        searchCtrl.result(input.query);
        UICtrl.renderResults(state.res);

    }
    return {
        init: function() {
            console.log("Application started");
            setUpEventListeners();
        }
    };

})(controlSearch, UIController);

controller.init();


