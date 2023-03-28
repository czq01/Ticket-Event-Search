const SpotifyWebApi = require("spotify-web-api-node");
const fs = require("fs");

class SpotifyAPi {
    api = new SpotifyWebApi({
        clientId: '91375fb0cea34da488f261e774ce08ce',
        clientSecret: '65779baf14544c5ab16cbe00956b3cbf',
        redirectUri: "https://example.com/callback",

    })
    code = "AQCOSfRMhZno-A4sylJeuJUVvCtK6Dm2Tmrl3q5aYa7rj3pF4kQgIPIaG_gVnr8rSULkAdpqrNd8t7R2SI9Gesvb2dyEMLGsuMx1_Pio5uR48hWZEnO7a3ygNVy2Ye9vO8GiM42igGGZ86U8va-xOSBHGPA7oGYaKFX0W9IDdAFr5mm4vhyka5_UcqIwZ6nV3KOjkbsJQEMiRTcsBBZQSPFB5so"

    access_token = "BQCVR3VBZqm9wLxB6bwE-hO7ngkVT0sL8sMhPvNvQh6GdizTjQLQseLe1R20yDJ0CN9tIVVIOJaFNCJ5Fpux12ZGDbKgF3Zqinp14hn2FVrKkcBV7B1WbSy7uJyJfYs_lPpeoCGuMfr92P2acColaBArAGi7g7V-OKMv-WO67Tehxk2y2xyfS2zyZY_1I9tCe3zHHyDr6Duv7eECabz2ZK4"

    refresh_token = "AQDRbP37OulrASLJvoFWkN2aGPslEfK10-osyUkf-Md7_bZDJJKTY7r_Z7HxXmbVi1hqyc3Byj8fK9L_XZNoGpmwGPyQD0sGsgljgZMUFIuh1tNHhW9LNK2RFbN6B7IwR6c"

    constructor() {
        this.api.setAccessToken(this.access_token);
        this.api.setRefreshToken(this.refresh_token);
    }

    setTocken() {
        // fs.readFile("code.json", data=> {
        //     let obj = JSON.parse(data);
        //     console.log("read: ", obj);
        // })
        return this.api.authorizationCodeGrant(this.code).then(
            (data) => {
                console.log('The token expires in ' + data.body['expires_in']);
                console.log('The access token is ' + data.body['access_token']);
                console.log('The refresh token is ' + data.body['refresh_token']);
                // Set the access token on the API object to use it in later calls
                this.api.setAccessToken(data.body['access_token']);
                this.api.setRefreshToken(data.body['refresh_token']);
            },
            function (err) {
                console.log('Something went wrong!', err.statusCode, err.message);
            }
        )
    }

    async refreshTocken() {
        await this.api.refreshAccessToken().then(
            (data) => {
                this.api.setAccessToken(data.body['access_token']);
            }, (err) => { console.log('Could not refresh access token', err); }
        )
    }

    async resetTocken() {
        await this.api.clientCredentialsGrant().then(
            data => { console.log(data) }
        )
    }

    getCode() {
        let scopes = ['user-read-private', 'user-read-email']
        let state = 'some-statehaha';
        var authorizeURL = this.api.createAuthorizeURL(scopes, state);

        fetch(authorizeURL).then(
            response => { console.log(response) }
        )
        console.log(authorizeURL);
    }

    async getArtist(name) {
        let res = null;
        await this.api.searchArtists(name)
            .then(data => data.body)
            .then(data => this.filterArtists(data, name))
            .then(data => { res = data; }, err => {
                if (err.statusCode != 401) {
                    console.log('Something went wrong!', err.statusCode, err.message);
                } else {
                    res = 401;
                }
            });
        if (res === 401) {
            await this.refreshTocken();
            await this.api.searchArtists(name)
                .then(data => data.body)
                .then(data => this.filterArtists(data, name))
                .then(data => { res = data; }, err => {
                    if (err.statusCode != 401) {
                        console.log('Something went wrong!', err.statusCode, err.message);
                        return null;
                    }
                    else {
                        console.log("Error 401");
                    }
                });
        }

        return res;
    }

    filterArtists(json, name) {
        let itemsArr = json.artists.items;
        console.log(itemsArr, name)
        let filteredArr = [];
        itemsArr.forEach((ele) => {
            if (ele.name === name) {
                let item = {};
                item.Name = ele.name;
                item.Followers = ele.followers.total;
                item.Popularity = ele.popularity;
                item.SpotifyLink = ele.external_urls.spotify;
                item.Pictures = ele.images;
                filteredArr.push(item);
            }
        })
        return filteredArr;
    }
}

module.exports = SpotifyAPi

