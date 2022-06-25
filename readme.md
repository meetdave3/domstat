# domstat

domstat is [httpstat](https://github.com/reorx/httpstat) for dom events

Helps in measuring [critical rendering path](https://web.dev/critical-rendering-path-measure-crp/) of a webpage

## Example output

![](https://i.ibb.co/rwX5KPP/Screenshot-2022-06-23-at-20-54-48.png)

## Install

```bash
$ npm install --global domstat
```


## CLI

```
$ domstat --help

  Usage
	  $ domstat

	Options
		--url  String. Url to test. Default is www.example.com
		--headless  Boolean. Pass flag to run test in headless mode

	Examples
	  $ domstat --url=example.com --headless

```
