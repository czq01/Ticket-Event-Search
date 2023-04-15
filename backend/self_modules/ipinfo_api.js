const Geohash = require("./geohash")

class LocationEncoder {
    GOOGLE_MAP_API_KEY
    Ipinfo_API_KEY

    constructor () {
         fetch("http://localhost:3000/api.json").then(res => res.json())
             .then(json => {
                 this.GOOGLE_MAP_API_KEY=json.Google_Map;
                 this.Ipinfo_API_KEY=json.IpInfo;
             })
    }

    getCoordinates_Loc(location) {
        let rq_url= `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${this.GOOGLE_MAP_API_KEY}`
        let res = fetch(rq_url).then(response => response.json())
                    .then(data => data.results[0].geometry.location)
                    .then(data => Geohash.encode(data.lat,data.lng, 7))
        return res;
    }

    getCoordinates_IP(ip) {
        let ipinfo_url = `https://ipinfo.io/66.87.125.72/json?token=${this.Ipinfo_API_KEY}`;
        return fetch(ipinfo_url).then(res => res.json())
                .then(data => data.loc)
                .then(data => Geohash.encode(data.lat, data.lng, 7))
    }
}


class Ipinfo {
    geo = new LocationEncoder();
    autoGetInfo(ip) {
        return this.geo.getCoordinates_IP(ip);
    }
    getInfoFromLoc(location) {
        return this.geo.getCoordinates_Loc(location);
    }
}


module.exports = Ipinfo;
