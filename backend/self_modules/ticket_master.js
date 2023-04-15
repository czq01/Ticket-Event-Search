// const Ipinfo = require("./ipinfo_api")

const Ipinfo = require("./ipinfo_api")
const ipinfo = new Ipinfo();

class TicketMasterAPI {
    API_KEY;
    mapping = {
        'Music': 'KZFzniwnSyZfZ7v7nJ',
        'Sport': 'KZFzniwnSyZfZ7v7nE',
        'Arts': 'KZFzniwnSyZfZ7v7na',
        'Theatre': 'KZFzniwnSyZfZ7v7na',
        'Film' : 'KZFzniwnSyZfZ7v7nn',
        'Misc': 'KZFzniwnSyZfZ7v7n1',
    }

    constructor() {
        this.API_KEY ="...";
        fetch("http://localhost:3000/api.json")
             .then(res => res.json())
             .then(json =>{this.API_KEY=json.Google_Map;})
    }

    async findSuggestions(keyword) {
        const res = await fetch(`https://app.ticketmaster.com/discovery/v2/suggest?apikey=${this.API_KEY}&keyword=${keyword}`);
        let data = await res.json();
        data = data._embedded;
        let r = [];
        if (!data) return r;
        for (let i = 0; i < data.attractions.length; i++) {
            r.push(data.attractions[i].name);
        }

        console.log(r);
        return r;
    }

    eventConstructor(jsonArr) {
        let eventJson = JSON.parse("[]");
        jsonArr.forEach((ele)=>{
            let json = JSON.parse("{}");
            json.Id = ele.id;
            json.VenueId = ele._embedded.venues[0].id;
            json.Date = ele.dates.start.localDate + ' ';
                 + (ele.dates.start.localTime?ele.dates.start.localTime:'');
            json.Icon = ele.images[0].url;
            json.Event = ele.name;
            json.Genre = ele.classifications[0].segment.name;
            json.Venue = ele._embedded.venues[0].name;
            eventJson.push(json);
        })
        return eventJson;
    }

    async getEvent(query) {
        let loc, r, res;
        if (query.location=='auto-detect') {
            loc = ipinfo.autoGetInfo(query.origin);
        } else {
            loc = ipinfo.getInfoFromLoc(query.location);
        }

        await loc.then(data => {
            let url = 'https://app.ticketmaster.com/discovery/v2/events.json?unit=miles';
            url += `&apikey=${this.API_KEY}&keyword=${query.keyword}&radius=${query.distance}&geoPoint=${data}`
            if (query.category!='Default') {url += `&segmentId=${this.mapping[query.category]}`;}
            res = fetch(url).then(res=>res.json())
                .then(json => {if (json._embedded) { return json._embedded.events}
                    else {return JSON.parse("[]");} })
                .then(array => this.eventConstructor(array))
        })
        await res.then(data => {r=data});
        return r;
    }

    async getDetail(query) {
        let result = [];
        await fetch(`https://app.ticketmaster.com/discovery/v2/events/${query.eid}.json?apikey=${this.API_KEY}`)
            .then(res => res.json())
            .then(data => this.formEventJson(data))
            .then(data => {result.push(data);})
        await fetch(`https://app.ticketmaster.com/discovery/v2/venues/${query.vid}.json?apikey=${this.API_KEY}&`)
        .then(res => res.json())
        .then(data => this.formVenueInfo(data))
        .then(data => {
            result.push(data);
            console.log("venue", data);
        })
        return result;
    }

    formEventJson(json) {
        console.log(json);
        let record = JSON.parse("{}");
        record['name'] = json.name;
        record["Date"] = json.dates.start.localDate + " ";
        record["Date"] += json.dates.start.localTime? json.dates.start.localTime: '';

        record["Artists"] = json._embedded.attractions;
        record["Venue"] = json._embedded.venues;
        let genre = [];
        ['segment', 'genre', 'subGenre', 'subType', 'type'].forEach((ele)=>{
            let e = json.classifications[0][ele];
            if (e && e.name && e.name!="Undefined") {genre.push(e.name);}
        })
        record["Genre"] = genre.length?genre:undefined;
        let price = json.priceRanges;
        record["PriceRanges"] = price? `${price[0].min}-${price[0].max} ${price[0].currency}`: undefined;
        record["TicketStatus"] = json.dates.status.code;
        record["BuyTicketAt"] = json.url;
        record["SeatMap"] = json.seatmap?json.seatmap.staticUrl: undefined;
        return record;
    }

    formVenueInfo(json) {
        let formatted = {};
        formatted.Name = json.name;
        formatted.Address = `${json.address.line1}, ${json.city.name}, ${json.state.stateCode}, ${json.country.countryCode}`;
        formatted.City = json.city.name;
        formatted.Phone = json.boxOfficeInfo?json.boxOfficeInfo.phoneNumberDetail: undefined;
        formatted.Phone = formatted.Phone?formatted.Phone: "(No record)"
        formatted.Hours = json.boxOfficeInfo?json.boxOfficeInfo.openHoursDetail: undefined;
        formatted.Hours = formatted.Hours?formatted.Hours: "(No record)"
        formatted.GeneralRule = json.generalInfo? json.generalInfo.generalRule: undefined;
        formatted.GeneralRule = formatted.GeneralRule?formatted.GeneralRule: "(Unspecified)"
        formatted.ChildRule = json.generalInfo? json.generalInfo.childRule: undefined;
        formatted.ChildRule = formatted.ChildRule?formatted.ChildRule: "(Unspecified)"
        return formatted;
    }


}

module.exports = TicketMasterAPI;
