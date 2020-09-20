

// const axios = require('axios');

export default class Search {
    
    constructor(query) {
        this.query = query;
    }


    

    async getResult() {
        await fetch(`https://api.themoviedb.org/3/search/movie?query=${this.query}&api_key=89a5e1f5ea6cf6130b6a5c8fd4cf8605`)
        .then(response => response.json())
        .then(data => {
            this.results = data.results;
            console.log('Success:', data.results);
            console.log('Success:', this.results);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}