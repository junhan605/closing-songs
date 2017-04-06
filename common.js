String.prototype.escapeSpecialChars = function() {
	return this.replace( /\\n/g, "\\n" )
				.replace( /\\'/g, "\\'" )
				.replace( /\\"/g, '\\"' )
				.replace( /\\&/g, "\\&" )
				.replace( /\\r/g, "\\r" )
				.replace( /\\t/g, "\\t" )
				.replace( /\\b/g, "\\b" )
				.replace( /\\f/g, "\\f" )
				.replace( /[\u0000-\u0019]+/g,"" );
};

if( !String.prototype.startsWith ) {
	String.prototype.startsWith = function( searchString, position ) {
		position = position || 0;
		return this.substr( position, searchString.length ) === searchString;
	};
}

function obj_has_all_needed_keys( obj, keys_needed ) {
	if( !obj || typeof obj != 'object' ) {
		return false;
	}
	if( !keys_needed ) {
		return true;
	}

	for( var i = 0; i < keys_needed.length; i++ ) {
		if( !obj.hasOwnProperty( keys_needed[ i ] ) ) {
			return false;
		}
	}

	return obj;
}

module.exports = { obj_has_all_needed_keys: obj_has_all_needed_keys };
