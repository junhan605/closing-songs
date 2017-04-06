var fs = require( 'fs' );
var request = require( 'request' );
var config = JSON.parse( fs.readFileSync( process.env.CONFIG_FILE ) );
var default_song_ids = config.default_spotify_song_ids;
var user_song_ids = config.user_to_spotify_song_ids;

function get_preview( track_id, callback ) {
	request.get( {
		url: 'https://api.spotify.com/v1/tracks/' + track_id
		}, function( err, res, body ) {
			var resbody = JSON.parse( body );
			if( typeof callback == 'function' ) {
				callback( {
					id: resbody.id,
					preview_url: resbody.preview_url,
					name: resbody.name,
					artist_name: resbody.artists.map( function( artist_obj ) { return artist_obj.name; } ).join( ' & ' ),
					album_art: resbody.album.images[ 0 ].url
				} );
			}
		}
	);
}

var all_songs_ids = function() {
	return [ ...new Set( default_song_ids.concat( ...Object.values( user_song_ids ).map( function( sid ) { return sid; } ) ) ) ];
}

module.exports = {
	all_songs: all_songs_ids,
	default_songs: default_song_ids,
	user_songs: user_song_ids,
	get_preview: get_preview
};
