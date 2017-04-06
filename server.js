require( 'dotenv' ).config();

var fs = require( 'fs' );
var ssl_options = {
	key: fs.readFileSync( process.env.SSL_PRIVATE ),
	cert: fs.readFileSync( process.env.SSL_CERT )
};
var hsts_options = {
	maxAge: 631138519000000,
	includeSubdomains: true,
	preload: true
};

var express = require( 'express' );
var helmet = require( 'helmet' );
var app = require( 'express' )().use( helmet.hsts( hsts_options ) );
var server = require( 'https' ).createServer( ssl_options, app );
var favicon = require( 'serve-favicon' );
var bodyParser = require( 'body-parser' );
var cookieParser = require( 'cookie-parser' );
var path = require( 'path' );
var port = process.env.PORT || 3000;

app.use( favicon( __dirname + '/public/favicon.ico' ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( bodyParser.text() );
app.set( 'views', path.join( __dirname, 'views' ) );
app.set( 'view engine', 'ejs' );
app.use( express.static( path.join( __dirname, 'public' ) ) );

server.listen( port );

// push a new event
app.use( '/new', require( './routes/new' ) );
// notification landing page
app.use( '/example', require( './routes/example' ) );

// all other web requests denied
app.all( '*', function ( req, res ) {
	app.set( 'json spaces', false );
	res.status( 403 ).json( { error: 403, status: "forbidden 💁" } );
});
