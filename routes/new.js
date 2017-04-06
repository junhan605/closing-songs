var fs = require( 'fs' );
var express = require( 'express' );
var router = express.Router();
var spotify = require( '../spotify' );
var youtube = require( '../youtube' );
var socket = require( '../socket' );
var common = require( '../common' );
var config = JSON.parse( fs.readFileSync( process.env.CONFIG_FILE ) );

var socket_namespace = "sale";
var socket_event = "new";

// handle the post request
router.post( '/', function ( req, res, next ) {
	console.log( "POST body is: " + JSON.stringify( req.body ) );
	try {
		if( common.obj_has_all_needed_keys( req.body, [ 'from_address', 'to_address', 'subject', 'body_plain', 'received_at' ] ) ) {
			if( config.valid_sender_from_address.indexOf( req.body.from_address.trim() ) == -1 ) {
				console.error( "Invalid from address ", req.body.from_address );
				res.status( 200 ).json( { status: "Invalid POST request" } );
			}
			else if( req.body.subject.startsWith( 'Re: ' ) ) {
				// we want to ignore subject lines beginning with Re: because this is a reply thread.
				console.log( "Email subject contains Re: " );
				res.status( 200 ).json( { status: "Duplicated request" } );
			}
			else {
				// respond to the webrequest
				res.status( 200 ).json( { status: "OK" } );

				// handle post body

				var song_to_use = false;
				var video_to_use = false;
				// just going to assume that whoever the "To" address is for, this is the user identifier
				var user_identifier_sanitized = req.body.to_address.split( ',' )[ 0 ].toLowerCase();

				// try get the video for the user
				if( youtube.user_videos[ user_identifier_sanitized ] ) {
					video_to_use = youtube.user_videos[ user_identifier_sanitized ][ Math.floor( Math.random() * youtube.user_videos[ user_identifier_sanitized ].length ) ]
				}
				// try get the song for the user
				if( spotify.user_songs[ user_identifier_sanitized ] ) {
					song_to_use = spotify.user_songs[ user_identifier_sanitized ][ Math.floor( Math.random() * spotify.user_songs[ user_identifier_sanitized ].length ) ]
				}

				// if a user has both a song and video, lets randomly pick to use one or the other
				if( video_to_use && song_to_use ) {
					if( Math.floor( ( Math.random() * 100 ) + 1 ) % 2 == 0 ) {
						video_to_use = false;
					}
					else {
						song_to_use = false;
					}
				}

				var object_sending_over_socket = {}

				if( video_to_use ) {
					// if the user identifier has a video, we can easily just send this over the socket
					object_sending_over_socket.video = video_to_use;
					socket.push_notification( socket_namespace, socket_event, object_sending_over_socket );
				}
				else {
					// okay we couldnt find anything, randomly pick a default spotify song
					if( !song_to_use ) {
						song_to_use = spotify.default_songs[ Math.floor( Math.random() * spotify.default_songs.length ) ];
					}

					// make the request to spotify api to get the mp3 for the song and when done, send over socket
					spotify.get_preview( song_to_use, function( song_data ) {
						object_sending_over_socket.song = song_data;
						socket.push_notification( socket_namespace, socket_event, object_sending_over_socket );
					} );
				}
			}
		}
		else {
			res.status( 400 ).json( { status: "Missing data" } );
		}
	}
	catch( e ) {
		console.error( "There was an error trying to parse text to JSON: ", e );
		res.status( 400 ).json( { status: "Malformed data" } );
	}
} );

module.exports = router;
