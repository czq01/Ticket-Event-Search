import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'search-page',
    templateUrl: 'search.body.html',
    styleUrls: ['search.body.css', 'result.table.css']
})

export class SearchPageBody {
    // SearchBox Member Var & Func
    keyword: string = '';
    distance: number = 10;
    selection: string = 'Default';
    isChecked: boolean = false;
    location: string = '';
    backend_domain: string = 'http://localhost:3000';

    table_display: boolean = false;
    table_json: any = JSON.parse("[]");
    sorted: boolean = false;

    _Node_Location: any;
    _Node_Loc_Tooltip: any;
    _Node_Keyword: any;
    _Node_Kwd_tooltip: any;
    _Node_ResultTable: any;
    _Node_TrTitles: any;

    keywordOptions: any;
    control = new FormControl();

    constructor(
        private http: HttpClient,
        private router: Router,
    ) { }

    // Initialize 初始化
    ngOnInit(): void {
        this._Node_Location = document.querySelector('input.Location');
        this._Node_Loc_Tooltip = document.querySelector('.Location>.tip-text');
        this._Node_Keyword = document.querySelector('input.Keyword');
        this._Node_Kwd_tooltip = document.querySelector('.Keyword>.tip-text');
        this._Node_ResultTable = document.querySelector<Element>(".result-box table");
        // this._Node_TrTitles = document.querySelectorAll('tr.title>td');
        this._Node_Location.addEventListener('input', () => {
            this._Node_Loc_Tooltip.style = "display:none;";
            this._Node_Location.style = null;
        })
        this._Node_Keyword.addEventListener('input', () => {
            this._Node_Kwd_tooltip.style = 'display:none;';
            this._Node_Keyword.style = null;
        })
        let t: any = document.querySelector("div.auto-complete")
        // let stateName = this.route.snapshot.paramMap.get("origin");
        this.restoreState("detail");
    }



    restoreState(stateName: string | null) {
        if (!stateName) return;
        let previous_state: any = sessionStorage.getItem(stateName);
        console.log(previous_state);
        if (!previous_state) return;
        let params = JSON.parse(previous_state);
        this.keyword = params['keyword'];
        this.distance = params['distance'];
        this.selection = params['selection'];
        this.isChecked = params['isChecked'];
        this.location = params['location'];
        this.table_display = params['table_display'];
        this.table_json = params['table_json'];
        this.sorted = params['sorted'];
    }

    autoComplete(): void {
        let url = `${this.backend_domain}/suggestion?keyword=${this.keyword}`;
        this.http.get(url)
            .subscribe(data => {
                console.log(data);
                this.keywordOptions = data;
            });
    }

    // SubmitForm 提交表单
    onFormSubmission(): void {
        let can_submit: boolean = true;
        document.querySelectorAll('.tip-text').forEach(
            function (ele) { ele.setAttribute('style', 'display:none'); }
        )

        if (this.keyword == '') {
            this._Node_Keyword.setAttribute('style', 'border: #fc5454 solid 0.2px;')
            this._Node_Kwd_tooltip.removeAttribute('style');
            can_submit = false
        } if (this.location == '') {
            this._Node_Location.setAttribute('style', 'border: #fc5454 solid 0.2px;');
            this._Node_Loc_Tooltip.removeAttribute('style');
            can_submit = false;
        }
        if (!can_submit) return;

        let url = this.backend_domain + '/submit_form';
        url += "?keyword=" + this.keyword;
        url += "&distance=" + this.distance;
        url += "&category=" + this.selection;
        url += "&location=" + this.location;
        console.log(url);
        this.http.get(url)
            .subscribe(data => {
                this.table_json = data;
                this.table_json.sort((a: any, b: any) => {
                    let text_a = a.Date;
                    console.log(a, a.Date);
                    let text_b = b.Date;
                    if (text_a < text_b) return -1;
                    else if (text_a > text_b) return 1;
                    else return 0;
                });
                this.sorted = true;
                this.table_display = true;
            })
    }

    // ClickClear 清楚状态
    onFormClear(): void {
        this.keyword = '';
        this.distance = 10;
        this.selection = 'Default';
        this.isChecked = false;
        this.location = '';

        this.table_display = false;
        this.table_json = "";

        this._Node_Location.style = '';
        this._Node_Loc_Tooltip.style = "display:none;";
        this._Node_Keyword.style = '';
        this._Node_Kwd_tooltip.style = "display:none;";
        sessionStorage.clear();
        console.log('onClear');
    }

    // Click Checkbox 自动检测地区
    onCheckBox(event: any): void {
        if (event.target.checked) {
            this._Node_Loc_Tooltip.style = "display:none;";
            this._Node_Location.style = "display:none;";
            this.location = 'auto-detect';
        } else {
            this._Node_Location.style = '';
            this.location = '';
        }
    }

    // sort table json
    sortTable(event: any): void {
        let col = event.srcElement.innerText;
        console.log(col);
        this.table_json.sort((a: any, b: any) => {
            let text_a = a[col];
            console.log(a, a[col]);
            let text_b = b[col];
            if (text_a < text_b) return (-1) ** Number(this.sorted);
            else if (text_a > text_b) return (-1) ** Number(!this.sorted);
            else return 0;
        });
        this.sorted = !this.sorted;
    }

    // Get detail Page
    getDetail(event: any) {
        console.log(event)
        let eid = event.srcElement.parentNode.getAttribute('eventid');
        let vid = event.srcElement.parentNode.getAttribute('venueid');

        sessionStorage.setItem('detail', JSON.stringify({
            keyword: this.keyword,
            distance: this.distance,
            selection: this.selection,
            isChecked: this.isChecked,
            location: this.location,
            table_display: this.table_display,
            table_json: this.table_json,
            sorted: this.sorted,
        }));
        this.router.navigate(['/search/detail', { vid: vid, eid: eid }]);
    }
}
