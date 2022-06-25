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
		--url  string (optional). Url to test. Default = www.example.com
		--headless  boolean (optional). Puppeteer mode. Default = true

	Examples
	  $ domstat --url=example.com --headless=false

```
