const table = document.querySelector('table');
const arrow = document.querySelector('div.arrow');
const event_card = document.querySelector('.event-detail.blur-box')
const venue_card = document.querySelector('.venue-detail');

function clear_result() {
    event_card.setAttribute('style', 'display:none');
    arrow.setAttribute('style', 'display:none');
    venue_card.setAttribute('style', 'display:none');
    table.innerHTML = '';
}

// click event to get detail card
function add_detailed_button() {
    document.querySelectorAll('tr.row>td:nth-of-type(3)').forEach(
        function (ele) {
            ele.addEventListener('click', getDetail);
        }
    )
}

// Build Detailed Card
function onRecieveDetailData() {
    response_json = JSON.parse(this.response);
    detailCard_event(response_json[0]);
    detailCard_venue(response_json[1]);
    event_card.removeAttribute("style");
    event_card.scrollIntoView({'behavior': 'smooth', 'block': 'start'});
}


function detailCard_event(json_obj) {
    let form_html = function(label, className, content, func) {
        let html = '';
        if (content && content.length) {
            html +=`
            <label> ${label}</label>
                <div class="value ${className}">
                <a *ngFor="let ele of json_obj._embedded.attractions" href="${ele.url}" target="_blank">${ele.name}</a> |
            </div>`
            html = content.reduce(func, html);
            html = html.slice(0, -2)+ '</div>';
        }
        return html;
    }

    let display_map = function(json_obj) {
        if (json_obj.seatmap) {
            return `<img src="${json_obj.seatmap.staticUrl}" alt='SeatMap.'>`
        } else return '<div>No Available  SeatMap</div>'
    }

    let mapping = {'onsale': ['green', 'On Sale'],
                   'offsale': ['red', 'Off Sale'],
                    'cancelled': ['black', 'Canceled'],
                    'Postponed': ['Orange', 'postponed'],
                    'rescheduled': ["Orange", 'rescheduled']}
    event_card.innerHTML = `
        <div class="box-title"> <h1>${json_obj.name}</h1> </div>
        <div class="card-content">
            <div class="info">
                <label for="date">Date</label>
                <div class="value date">
                    ${json_obj.dates['start']['localDate']}
                    ${json_obj.dates['start']['localTime']?json_obj.dates['start']['localTime']:''}
                </div>
                ${form_html('Artists/Team', 'artists',
                      json_obj._embedded.attractions,
                      function (tx, ele) {return tx+`<a href="${ele.url}" target="_blank">${ele.name}</a> | `;})}
                ${form_html('Venue', 'venue',
                      json_obj._embedded.venues,
                      function (tx, ele) {return tx+`${ele.name} | `})}
                ${form_html('Genres', 'genres',
                      ['subGenre', 'genre', 'segment', 'subType', 'type'],
                      function(tx, ele) {
                        let e = json_obj.classifications[0][ele]
                        if (e && e.name != 'Undefined') {return tx + `${e.name} | `;}
                        else return tx;
                      })}
                ${form_html('Price Ranges', 'price',
                      json_obj.priceRanges,
                      function (tx, ele) {return tx+`${ele.min}-${ele.max} ${ele.currency} |`;}
                )}
                ${form_html('Ticket Status', 'status',
                      [json_obj.dates.status.code],
                      function (tx, ele) {return tx+`<button style='background: ${mapping[ele][0]}'>${mapping[ele][1]}</button> | `;})}
                ${form_html('Buy Ticket At:', 'link',
                      [json_obj.url],
                      function (tx, ele) {return tx+`<a href="${ele}">Ticketmaster</a> | `;}
                )}
            </div>
            <div class="pic">
                <div>
                      ${display_map(json_obj)}
                </div>
            </div>
        </div>`


}


function collapse_venue() {
    if (arrow.getAttribute('style')) {
        arrow.removeAttribute('style');
    }
    venue_card.setAttribute('style', 'display: none');
}


function detailCard_venue(json_obj) {
    let google_map_link = function() {
        let url = 'https://www.google.com/maps/search/?api=1&query=';
        let parameter = `${json_obj.name} ${json_obj.address.line1}
                 ${json_obj.city.name} ${json_obj.state.stateCode} ${json_obj.postalCode}`;
        return url + parameter.replace(/[ ,]+/, '+')
    }
    collapse_venue();
    document.querySelector('.venue-detail h1').innerHTML = json_obj.name;
    document.querySelector('.st-line1').innerHTML = json_obj.address.line1;
    document.querySelector('.st-line2').innerHTML = `
        ${json_obj.city.name}, ${json_obj.state.stateCode}    `;
    document.querySelector('.zip-code').innerHTML = json_obj.postalCode;
    document.querySelector('.right.link>a').setAttribute('href', json_obj.url);
    document.querySelector('.link.map>a').setAttribute('href', google_map_link());
}