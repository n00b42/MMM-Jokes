/* Magic Mirror Module Jokes
 *
 * 2016 Aaron Kable
 * 2017 Jon Robinson (fork)
 * 2025 Maximilian Senftleben (fork)
 *
 * MIT Licensed.
 */

var NodeHelper = require('node_helper');

function isValidHttpUrl(string) {
	let url;
	try {
		url = new URL(string);
	} catch (_) {
		return false;
	}
	return url.protocol === "http:" || url.protocol === "https:";
}


module.exports = NodeHelper.create({
	start: function() {
		this.fetchers = {};
	},
	socketNotificationReceived: function(notification, conf) {
		if(notification === 'REGISTER_JOKE_FETCHER') {
			console.log("MMM-Jokes: Register new joke fetcher", conf.url)
			this.sendSocketNotification('TEST');
			const self = this
			if(conf.url.length == 0 || !isValidHttpUrl(conf.url)) {
				this.sendSocketNotification('INCORRECT_URL', conf.url);
			} else {
				if(conf.url in this.fetchers) {
					clearInterval(this.fetchers[conf.url])
					delete this.fetchers[conf.url];
				}
				setTimeout( () => {
					const fetchJoke = () => {
						fetch(conf.url)
						.then((response) => { if (response.ok) { return response.json(); }; throw new Error('Something went wrong'); })
						.then((json) => {
							let joke = json;
							let joke2 = "";
							if(conf.extraction.length > 0) {
								for(const e of conf.extraction.split('/')) {
									if(isNaN(parseInt(e))) {
										joke = joke[e];
									} else {
										joke = joke[parseInt(e)];
									}
								}
							}
							if(conf.extraction2.length > 0) {
								joke2 = json;
								for(const e of conf.extraction2.split('/')) {
									if(isNaN(parseInt(e))) {
										joke2 = joke2[e];
									} else {
										joke2 = joke2[parseInt(e)];
									}
								}
								if(joke2.length > 0) {
									joke = [ joke, joke2 ];
								}
							}
							if(joke.length > 0) {
								self.sendSocketNotification('JOKE_EVENT', joke);
							}
						})
						.catch((error) => {
							self.sendSocketNotification('JOKE_FETCH_ERROR', error);
						})
					}
					this.fetchers[conf.url] = setInterval( fetchJoke, conf.interval);
					fetchJoke();
				}, conf.delay ?? 0);
			}
		}
	}
});
