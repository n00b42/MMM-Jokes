# Module: MMM-Jokes

The `MMM-Jokes` module can show jokes from a web API.


## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-Jokes',
		position: 'lower_third',
		config: {
		    url: 'https://v2.jokeapi.dev/joke/Any?type=single', // required
		    extraction: 'joke', // required most of the time
		}
	}
]
````

## Example APIs

- jokeapi.dev
`{ url: "https://v2.jokeapi.dev/joke/Any?type=single", extraction: 'joke' }`
- witzapi.de
`{ url: "https://witzapi.de/api/joke", extraction: "0/text" }`
- official-joke-api.appspot.com/
`{ url: "https://official-joke-api.appspot.com/random_joke", extraction: "setup", extraction2: "punchline" }`

## Configuration options

- `url`: URL for the GET fetch request
- `extraction`: json path for extraction of actual joke from payload. E.g. `value/0/joke` would extract from `payload.value[0].joke`
- `extraction2`: optional, equivalent to `extraction` but for an optional punchline / second part.
- `delay`: delay before fetching first joke (default 2s)
- `interval`: interval for fetching new jokes (default 10min)
- `animationSpeed`: animation speed when joke is changed (default 2000)

## Credits

- 2016 Aaron Kable (original module)
- 2017 Jon Robinson (fork)
