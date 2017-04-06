var express = require( 'express' );
var router = express.Router();
var fs = require( 'fs' );
var gifs = fs.readdirSync( './public/images/money-gifs/' );

router.get( '/', function ( req, res, next ) {
	res.render( 'example', { title: 'Example Notifications', gifs: gifs, push_uri: process.env.PUSH_SERVER_URI } );
});

module.exports = router;
