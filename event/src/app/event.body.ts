import { Component } from '@angular/core';

@Component({
    selector: 'body',
    templateUrl: 'event.body.html',
    styleUrls: ['event.body.scss']
})

export class MainBody {
    title: string = 'event';
    page='search-page';
    result: string = '';

    switch_page(page_name: string): void {
        this.page = page_name;
    };
}
