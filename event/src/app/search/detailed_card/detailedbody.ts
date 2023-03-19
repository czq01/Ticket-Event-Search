import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

type Dictionary<T> = {
  [key: string]: T;
};

const status_mapping: Dictionary<Array<string>>= {
       'onsale': ['green', 'On Sale'],
       'offsale': ['red', 'Off Sale'],
       'cancelled': ['black', 'Canceled'],
       'Postponed': ['Orange', 'postponed'],
       'rescheduled': ["Orange", 'rescheduled']}


@Component({
    selector: 'detailed-page',
    templateUrl: 'detailed.body.html',
    styleUrls: ['detailed.body.css']
})

export class DetailedCard {
    detailed_event: any = null;
    status: string = "";
    status_color: string = "";
    backend_domain: string = 'http://localhost:3000';
    constructor(
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        let eid: any = this.route.snapshot.paramMap.get('eid');
        let vid: any = this.route.snapshot.paramMap.get('vid');
        console.log(`${eid}, ${vid}`);
        let url = this.backend_domain + '/details?';
        url += `eid=${eid}&vid=${vid}`;
        fetch(url).then(res => res.json())
            .then(data => {
                this.detailed_event = data;
                this.status = status_mapping[this.detailed_event.TicketStatus][1];
                this.status_color = `background-color: ${status_mapping[this.detailed_event.TicketStatus][0]};`;
            });
    }

    goBack() {
        this.router.navigate(['/search', {origin: "detail"}])
    }

}