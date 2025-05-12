/* Magic Mirror Module Jokes
 *
 * 2016 Aaron Kable
 * 2017 Jon Robinson (fork)
 * 2025 Maximilian Senftleben (fork)
 *
 * MIT Licensed.
 */

Module.register('MMM-Jokes',{

	// Module config defaults.
	defaults: {
		url: '',
		extraction: '',
		extraction2: '',
		delay: 2000, // 2s
		interval: 10 * 60 * 1000, // 10min
		animationSpeed: 2000,
	},

	getScripts: function() { return []; },

	// Define start sequence.
	start: function() {
		Log.info('MMM-Jokes: Starting');
		Log.info('MMM-Jokes: Config', this.config);
		this.joke = '';
		this.loaded = false;
		this.updateTimer = null;
		this.sendSocketNotification('REGISTER_JOKE_FETCHER', this.config);
	},

	// Override socket notification handler.
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'JOKE_EVENT') {
			this.joke = payload;
		} else if(notification === 'JOKE_FETCH_ERROR') {
			Log.error('Joke Error. Could not fetch joke', + payload);
		} else if(notification === 'JOKE_INCORRECT_URL') {
			Log.error('Joke Error. Incorrect url', payload);
		} else {
			Log.log('Joke received an unknown socket notification', notification);
		}
		this.updateDom(this.config.animationSpeed);
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		wrapper.className = 'thin medium';
		var jokeNode;
		if (Array.isArray(this.joke)) {
			for (var i=0; i< this.joke.length-1; ++i){
					var jokeLine = document.createTextNode(this.decodeHtml(this.joke[i]));
					jokeLine.className = 'thin medium normal';
					wrapper.appendChild(jokeLine);
					wrapper.appendChild(document.createElement("br"));
			}
			var lastJokeLine = document.createTextNode(this.decodeHtml(this.joke[this.joke.length-1]));
			lastJokeLine.className = 'thin medium bright';
			wrapper.appendChild(lastJokeLine);
		} else {
			jokeNode = document.createTextNode(this.decodeHtml(this.joke));
			wrapper.appendChild(jokeNode);
		}
		return wrapper;
	},

	// escape a string for display in html
	decodeHtml: function(html){
		var txt = document.createElement("textarea");
		txt.innerHTML = html;
		return txt.value;
	}
});
