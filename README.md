# closing-songs
Respond to webhooks from [Zapier](https://zapier.com/) (or anything really)
This is a simple implementation of a web server that responds to a post request, and in result, sends a realtime event over a web socket.'

## Prerequisites for usage

 - A working [socket.io](http://socket.io/) web socket server

## Our usage
Here at Datanyze, we use Zapier to monitor a certain Gmail inbox and when this inbox receives a new email, it triggers Zapier to make a web request to this webhook. When this server receives the request, it then parses the email to try find what user the email is associated to. It then matches this user to a YouTube video or Spotify soundtrack to play for their event. Finally, it sends over the video or song through the websocket which in result, anyone on the notification landing page will play the video/song.

## Use case
A sale has been made, this sale was sent through email which will be picked up by the webhook, a video/song who closed the sale plays on a monitor.

----------

## Installing

 1. Clone repo (or fork if you would also like to make contributions)
 2. Go to the newly created directory and run `npm install`
 3. Rename `config.json.example` to `config.json`
	 - Edit this file as necessary (more details for what goes inside below)
 4. Rename `.env.example` to `.env`
	 - Edit this file as necessary (more details for what goes inside below)
 5. Start the server by running `npm start`

### config.json
This file is a hardcoded mapping for a user and their respective video/songs they would like to have play if an event was by them.
There usage for each object in the JSON file are:

 - `user_to_yt_video`  - maps the user to an array of YouTube video ids and the start time of where in the video should start playing
 - `user_to_spotify_song_ids` - maps the user to an array of Spotify song ids
 - `default_spotify_song_ids` - an array of Spotify song ids which will be used if the user doesn't have any chosen videos/songs
 - `valid_sender_from_address` - what email address(es) to use to determine that the sent email is one that this web server should respond to

### .env
Use this file to set environment variables. Explanations for the variables:

 - `SSL_PRIVATE` - path to where the server can find the private keys to the SSL certificate
 - `SSL_CERT` - path to where the server can find the SSL certificate
 - `PORT` - what port to run the web server on
 - `PUSH_SERVER` - URL to the web socket server
 - `PUSH_SERVER_URI` - URI to the web socket server
 - `CONFIG_FILE` - path to where config.json is

## Notes

 - YouTube videos will only play for 30 seconds from the designated start time, can be easily changeable in the notification view.
 - When using Spotify song ids, the web server makes a request to Spotify's API to return the songs preview mp3.
