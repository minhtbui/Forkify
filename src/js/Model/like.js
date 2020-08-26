export default class Like {
    constructor() {
        this.likes = [];
    }

    addLike (id, title, author, img){
        const like = {
            id,
            title,
            author,
            img
        }
        this.likes.push(like);

        this.setLocalStorage();

        return like;
    }

    deleteLike (id){
        const indexID = this.likes.findIndex(e => e.id === id); 

        this.likes.splice(indexID, 1);

        this.setLocalStorage();
    }

    isLike (id){
        return this.likes.findIndex(e => e.id === id) !== -1; // id !== notExist(-1)? => id isLiked already
    }

    getNumLikes (){
        return this.likes.length;
    }

    setLocalStorage (){ // localStorage only read string so using JSON to covert from array to strings
        localStorage.setItem('likes', JSON.stringify(this.likes)); 
    }

    readLocalStorage (){
        const likes = JSON.parse(localStorage.getItem('likes')); //covert strings back to array;

        // if likes data exist in localStorage
        if(likes) this.likes = likes
    }
}