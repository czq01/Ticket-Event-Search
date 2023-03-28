import { Component } from '@angular/core';

@Component({
    selector: 'favorite-page',
    templateUrl: "favorite.body.html",
    styleUrls: ["favorite.body.css"]
})

export class FavoritePageBody {
    favorite_info: Array<any>;
    item_dict: any;
    favorite_items: any;

    constructor() {
        this.favorite_info = [];
        let items: string|null = localStorage.getItem("fav_info");
        let fav = localStorage.getItem("favorite");
        console.log("raw:", items);
        let item: Map<string, any> = JSON.parse(items?items:"{}");
        this.favorite_items = JSON.parse(fav?fav:"{}");
        this.item_dict = item;
        this.form_info(item);
    }

    form_info(items: any) {
        this.favorite_info = [];
        console.log(items);
        for (let i in items) {
            items[i].eid = i;
            console.log(i);
            this.favorite_info.push(items[i]);
        }
    }

    deleteItem(event: any) {
        let id = event.srcElement.parentNode.getAttribute("eid");
        delete this.item_dict[id];
        this.favorite_items[id] = false;
        this.form_info(this.item_dict);
        localStorage.setItem('fav_info', JSON.stringify(this.item_dict));
        localStorage.setItem('favorite', JSON.stringify(this.favorite_items));
        alert("Removed From Favorite!")
    }

}