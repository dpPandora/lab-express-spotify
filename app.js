require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

//getting access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(err => console.log(err));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index')
})
app.get('/artist-search', (req, res) => {
    let rQuery = req.query['artist']
    //res.render('artist-search-results', {rQuery})

    spotifyApi
        .searchArtists(rQuery)
        .then(data => {
            //console.log(data.body.artists['items']);
            let artist = data.body.artists['items'];
            //console.log(artist[0].images[1].url);
            res.render('artist-search-results', {
                artist
            })
        })
        .catch(err => console.log(err));
})
app.get('/albums/:id', (req, res) => {
    let artistID = req.params.id;
    //console.log(artistID);

    spotifyApi
        .getArtistAlbums(artistID)
        .then(data => {
            //console.log(data.body);
            let albums = data.body['items'];
            //console.log(albums);
            res.render('albums', {
                albums
            })
        })
        .catch(err => console.log(err));
})
app.get('/tracks/:id', (req, res) => {
    let albumID = req.params.id;

    spotifyApi
        .getAlbumTracks(albumID)
        .then(data => {
            let tracks = data.body['items'];
            //console.log(tracks)
            res.render('tracks', {
                tracks
            })
        })
        .catch(err => console.log(err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
