# domstat

domstat is like [httpstat](https://github.com/reorx/httpstat) but for dom events

Helps in measuring [critical rendering path](https://web.dev/critical-rendering-path-measure-crp/) of a webpage & reports other browser timings & metrics

## Example output

![](https://i.ibb.co/NsFkC54/Screenshot-2022-06-26-at-00-07-39.png)

## Install

```bash
npm install --global domstat
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

	Check version
		$ domstat --version

```
