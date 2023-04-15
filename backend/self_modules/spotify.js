const SpotifyWebApi = require("spotify-web-api-node");
const fs = require("fs");

class SpotifyAPi {
    api = new SpotifyWebApi({
        clientId: 'hided',
        clientSecret: 'hided',
        redirectUri: "hided",

    })
    code = "..."

    access_token = "..."

    refresh_token = "..."

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

