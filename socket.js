function push_notification( namespace, event, send_data ) {
	if( !namespace || typeof namespace == 'undefined' ) {
		namespace = '';
	}

	if( ( !event || typeof event == 'undefined' ) || ( !send_data || typeof send_data == 'undefined' ) ) {
		return false;
	}

	var socket = require( 'socket.io-client' )( process.env.PUSH_SERVER + namespace, { 'path': '/ws' } );

	socket.on( 'connect', function() {
		console.log( 'sending to socket', send_data );
		socket.emit( event, send_data );

		socket.disconnect();
	} );
}

module.exports = { push_notification: push_notification };
