import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
type Dictionary<T> = {
    [key: string]: T;
};

const status_mapping: Dictionary<Array<string>> = {
    'onsale': ['green', 'On Sale'],
    'offsale': ['red', 'Off Sale'],
    'cancelled': ['black', 'Canceled'],
    'Postponed': ['Orange', 'postponed'],
    'rescheduled': ["Orange", 'rescheduled']
}


@Component({
    selector: 'detailed-page',
    templateUrl: 'detailed.body.html',
    styleUrls: ['detailed.body.css', ],
})

export class DetailedCard {
    detailed_event: any =null;
    basic_decription: any;
    artists_info: any = null;
    venue_info: any = null;
    status: string = "";
    status_color: string = "";
    backend_domain: string = 'http://localhost:3000';
    is_favorite: boolean = false;
    favorite_style: Array<string>;
    style: string = "";
    vid: string | null = "";
    eid: string | null = "";
    arrows: boolean = true;
    showMore: boolean = false;
    showGeneralRule: boolean = false;
    showChildRule: boolean = false;
    showHours: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private http: HttpClient,
    ) {
        this.favorite_style = ["color:#aeaeae;", "color:#ff2853;"];
    }

    ngOnInit() {
        this.eid = this.route.snapshot.paramMap.get('eid');
        this.vid = this.route.snapshot.paramMap.get('vid');
        console.log(`${this.eid}, ${this.vid}`);
        if (!this.eid) return;
        this.getDetail();

        let favoriate_list: any = localStorage.getItem("favorite");
        console.log("favorite:", favoriate_list);
        favoriate_list = JSON.parse(favoriate_list ? favoriate_list : "{}")
        this.is_favorite = favoriate_list[this.eid] ? favoriate_list[this.eid] : false;
        this.style = this.favorite_style[Number(this.is_favorite)];
    }

    async getDetail(): Promise<any> {
        console.log("run")
        let url = this.backend_domain + '/details?';
        url += `eid=${this.eid}&vid=${this.vid}`;
        await this.http.get(url).toPromise()
            .then((data: any) => {
            console.log(data)
            this.detailed_event = data[0];
            this.venue_info = data[1];
            this.artists_info = data[2];
            this.status = status_mapping[this.detailed_event.TicketStatus][1];
            this.status_color = `background-color: ${status_mapping[this.detailed_event.TicketStatus][0]};`;
            this.basic_decription = this.formJson(this.detailed_event);
        });
    }

    formJson(ele: any): any {
        let json = JSON.parse("{}");
        // json.Id = ele.id;
        json.Date = ele.Date;
        json.Event = ele.name;
        json.Genre = ele.Genre[0];
        json.Venue = ele.Venue[0].name;
        return json;
    }

    likeEvent(): void {
        if (!this.eid) return;
        this.is_favorite = !this.is_favorite;
        let favorite_list: any = localStorage.getItem("favorite");
        favorite_list = JSON.parse(favorite_list ? favorite_list : "{}")
        favorite_list[this.eid] = this.is_favorite;
        localStorage.setItem("favorite", JSON.stringify(favorite_list));

        this.style = this.favorite_style[Number(this.is_favorite)];
        // local storage to store info
        let favorite_info: any = localStorage.getItem("fav_info");
        favorite_info = JSON.parse(favorite_info ? favorite_info : "{}")
        if (this.is_favorite) {
            alert("Event Added to the favorite!");
            favorite_info[this.eid] = this.basic_decription;
        }
        else {
            alert("Removed from favorite!");
            delete favorite_info[this.eid];
        }
        localStorage.setItem('fav_info', JSON.stringify(favorite_info));
    }

    goBack() {
        this.router.navigate(['/search'])
    }

}