import axios from 'axios';

export default class Movie {
    constructor(id) {
        this.id = id;
    } 

    async getMovie() {
        try {

            
            const res = await axios(`https://api.themoviedb.org/3/movie/${this.id}?api_key=89a5e1f5ea6cf6130b6a5c8fd4cf8605`);
            
            this.title = res.data.original_title;
            this.desc = res.data.overview;
            this.popularity = res.data.popularity;
            this.image = res.data.poster_path;
            this.release_date = res.data.release_date;
            this.genres = res.data.genres[0].name;
            this.url = res.data.homepage;
            this.company = res.data.production_companies.name;
            console.log(res);
            
        } catch (error) {

            alert('wrong');
            
        }
    }
}