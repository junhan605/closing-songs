var fs = require( 'fs' );
var config = JSON.parse( fs.readFileSync( process.env.CONFIG_FILE ) );
var user_video_ids = config.user_to_yt_video;

module.exports = {
	user_videos: user_video_ids
};
