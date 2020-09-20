
export default class Movie {
    constructor(id) {
        this.id = id;
    } 

    async getMovie() {
        try {
            await fetch(`https://api.themoviedb.org/3/movie/${this.id}?api_key=89a5e1f5ea6cf6130b6a5c8fd4cf8605`)
            .then(response => response.json())
            .then(res => {
                this.title = res.original_title;
                this.desc = res.overview;
                this.popularity = res.popularity;
                this.image = res.poster_path;
                this.release_date = res.release_date;
                this.genres = res.genres[0].name;
                this.url = res.homepage;
                this.company = res.production_companies[0].name;
                //console.log(this.title);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
            
        } catch (error) {

            alert('wrong');
            
        }
    }

    getUserRatings(ratings,commentTitle,commentContent){
        const url = 'http://localhost:8181/MovieRESTAPI/rest/user/ratings';
        const data = {
            ratings,
            commentTitle,
            commentContent
        };

        fetch(url, {
            method: 'POST',
            body: {
                ...data
            }
        })
        .then(data => console.log(data))
        .catch(err => console.log(err))
    }
}