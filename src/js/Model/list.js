import uniqid from 'uniqid';

export default class List {
    constructor() {
        this.items = [];
    }

    addItem(number, unit, ingredient){
        const item = {
            id: uniqid(),
            number,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id){
        const indexID = this.items.findIndex(e => e.id === id);
        // [2,4,8] splice(1,2) -> return [4,8] -> original arr = [2] => splice mutate the original arr
        // [2,4,8] slice(1,2) -> return [4] -> original arr = [2,4,8]        
        this.items.splice(indexID, 1);    
    }

    updateItem(id, newNumber){
        this.items.find(e => e.id === id).number = newNumber;
    }

}