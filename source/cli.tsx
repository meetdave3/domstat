#!/usr/bin/env node
import React, {FC} from 'react';
import { Text, Box, useApp} from 'ink';
import puppeteer from 'puppeteer';
import {render} from 'ink';
import meow from 'meow';

const cli = meow(`
	Usage
	  $ domstat

	Options
		--url  Url to test

	Examples
	  $ domstat --url=example.com
`, {
	flags: {
		url: {
			type: 'string'
		}
	}
});

type AppTypes = {
	url?: string
}

type PerfObj = {
	responseEnd: number,
	domInteractive: number,
	domContentLoadedEventStart: number,
	domContentLoadedEventEnd: number,
	domComplete: number,
	total: number,
	transferSize: number,
	nextHopProtocol: string,
	resourceLoadingComplete: number,
	numberOfRequests: number,
	fcp: number,
	totalJsBytes: string,
	jsCoveragePerc: number
	totalCssBytes: string,
	cssCoveragePerc: number,
}



function setUrl(url: string): string {
	if (url.startsWith('https://')) {
		return url
	}

	if (url.startsWith('http://')) {
		return url.replace('http://', 'https://')
	}

	if (!url.startsWith('https://')) {
		return `https://${url}`
	}

	return url;

}
   
function convertBytes(x: string): string {
	const units = ['bytes', 'kB', 'mB'];
  let l = 0, n = parseInt(x, 10) || 0;

  while(n >= 1024 && ++l){
      n = n/1024;
  }
  
  return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

const App: FC<AppTypes> = ({url = 'www.example.com' }) => {
	const [r, setR] = React.useState<null | PerfObj>(null)
	const { exit } = useApp()
	const parsedUrl = setUrl(url)

	async function getResults() {
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		await page.setViewport({ width: 1366, height: 768});
		await page.setCacheEnabled(false);
		await Promise.all([
			page.coverage.startJSCoverage(),
			page.coverage.startCSSCoverage(),
		]);
		await page.goto(parsedUrl, {waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'], timeout: 0});
		
		const [jsCoverage, cssCoverage] = await Promise.all([
			page.coverage.stopJSCoverage(),
			page.coverage.stopCSSCoverage(),
		]);

		let totalJsBytes = 0;
		let jsUsedBytes = 0;
		let totalCssBytes = 0;
		let cssUsedBytes = 0;
		let jsCoveragePerc = 0;
		let cssCoveragePerc = 0;

		for (const entry of jsCoverage) {
			totalJsBytes += entry.text.length;
			for (const range of entry.ranges) jsUsedBytes += range.end - range.start - 1;
		}
		for (const entry of cssCoverage) {
			totalCssBytes += entry.text.length;
			for (const range of entry.ranges) cssUsedBytes += range.end - range.start - 1;
		}

		if (totalJsBytes > 0) {
			jsCoveragePerc = +((jsUsedBytes / totalJsBytes) * 100).toFixed(2)
		}
		if (totalCssBytes > 0) {
			cssCoveragePerc = +((cssUsedBytes / totalCssBytes) * 100).toFixed(2)
		}
		
		const p = JSON.parse(
			await page.evaluate(() => JSON.stringify(window.performance.getEntriesByType('navigation')))
		);
		const a = JSON.parse(
			await page.evaluate(() => JSON.stringify(window.performance.getEntriesByType('resource')))
		);
		const t = JSON.parse(
			await page.evaluate(() => JSON.stringify(window.performance.getEntriesByType('paint')))
		);

		const resourceLoadingComplete = a[a.length - 1].responseEnd.toFixed(2)
		const numberOfRequests = a.length

		const fcp = t[1].startTime.toFixed(2)

		const perfObj = {
			responseEnd: p[0].responseEnd.toFixed(2),
			domInteractive: p[0].domInteractive.toFixed(2),
			domContentLoadedEventStart: p[0].domContentLoadedEventStart.toFixed(2),
			domContentLoadedEventEnd: p[0].domContentLoadedEventEnd.toFixed(2),
			domComplete: p[0].domComplete.toFixed(2),
			total: p[0].duration.toFixed(2),
			transferSize: p[0].transferSize.toFixed(2),
			nextHopProtocol: p[0].nextHopProtocol,
			resourceLoadingComplete,
			numberOfRequests,
			fcp,
			totalJsBytes: convertBytes(totalJsBytes.toString()),
			jsCoveragePerc,
			totalCssBytes: convertBytes(totalCssBytes.toString()),
			cssCoveragePerc,
		}
		setR(perfObj)
		exit()
	}

	if (r === null) {
		getResults()
		return (
			<Text color="green">Getting DOM timings for {parsedUrl}...</Text>
		)
	}

	if (r !== null) {
		const size = convertBytes(r.transferSize.toString())

		return (
			<>
			<Text>
				URL: <Text color="green">{parsedUrl}</Text>
			</Text>
			<Text>
				Protocol: <Text color="green">{r.nextHopProtocol}</Text>
			</Text>
			<Text>
				Document transfer size: <Text color="green">{size}</Text>
			</Text>
			<Text>
				Resource loading complete: <Text color="green">{r.resourceLoadingComplete}ms</Text>
			</Text>
			<Text>
				Requests: <Text color="green">{r.numberOfRequests}</Text>
			</Text>
			<Text>
				First contentful paint: <Text color="green">{r.fcp}ms</Text>
			</Text>
			<Text>
				Total Javscript size / Coverage (used bytes): <Text color="green">{r.totalJsBytes} / {r.jsCoveragePerc}%</Text>
			</Text>
			<Text>
				Total CSS size / Coverage (used bytes): <Text color="green">{r.totalCssBytes} / {r.cssCoveragePerc}%</Text>
			</Text>

			<Box>
				<Box borderStyle="single" width="16.67%"><Text>domLoading</Text></Box>
				<Box borderStyle="single" width="16.67%"><Text>domInteractive</Text></Box>
				<Box borderStyle="single" width="16.67%"><Text>domContentLoadedEventStart</Text></Box>
				<Box borderStyle="single" width="16.67%"><Text>domContentLoadedEventEnd</Text></Box>
				<Box borderStyle="single" width="16.67%"><Text>domComplete</Text></Box>
				<Box borderStyle="single" width="16.67%"><Text>loadEventEnd</Text></Box>
			</Box>
			
			<Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{r.responseEnd}ms    |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{(r.domInteractive - r.responseEnd).toFixed(2)}ms    |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{(r.domContentLoadedEventStart - r.domInteractive).toFixed(2)}ms    |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{(r.domContentLoadedEventEnd - r.domContentLoadedEventStart).toFixed(2)}ms    |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{(r.domComplete - r.domContentLoadedEventEnd).toFixed(2)}ms    |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{(r.total - r.domComplete).toFixed(2)}ms    |</Text></Box>
			</Box>
			<Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
			</Box>
			<Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{r.responseEnd}ms |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
			</Box>
			<Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{r.domInteractive}ms |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
			</Box>
			<Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{r.domContentLoadedEventStart}ms |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
			</Box>
			<Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{r.domContentLoadedEventEnd}ms |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
			</Box>
			<Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{r.domComplete}ms |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
			</Box>
			<Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{r.total}ms |</Text></Box>
			</Box>
			</>
		)
	}

	return <></>;
}

(async function () {
	const { waitUntilExit, unmount } = render(<App url={cli.flags.url}/>);
	await waitUntilExit()
	await unmount()
	process.exit()
})()
