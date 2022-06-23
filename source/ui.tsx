import React, {FC} from 'react';
import {Newline, Text, Box} from 'ink';
import puppeteer from 'puppeteer';

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
}

const App: FC<AppTypes> = ({url = 'www.example.com' }) => {
	const [result, setResult] = React.useState<null | PerfObj>(null)

	async function getResults() {
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		
		await page.goto(`https://${url}`);

		const p = JSON.parse(
			await page.evaluate(() => JSON.stringify(window.performance.getEntriesByType('navigation')))
		);

		const perfObj = {
			responseEnd: p[0].responseEnd.toFixed(2),
			domInteractive: p[0].domInteractive.toFixed(2),
			domContentLoadedEventStart: p[0].domContentLoadedEventStart.toFixed(2),
			domContentLoadedEventEnd: p[0].domContentLoadedEventEnd.toFixed(2),
			domComplete: p[0].domComplete.toFixed(2),
			total: p[0].duration.toFixed(2),
		}
		setResult(perfObj)
	}

	if (result === null) {
		getResults()
		return (
			<Text color="green">Getting DOM statistics for {url}...</Text>
		)
	}

	if (result !== null) {
		const { responseEnd, domInteractive, domComplete, domContentLoadedEventStart, domContentLoadedEventEnd, total } = result

		return (
			<>
			<Text>
				URL tested: <Text color="green">{url}</Text>
				<Newline />
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
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{responseEnd}ms    |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{(domInteractive - responseEnd).toFixed(2)}ms    |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{(domContentLoadedEventStart - domInteractive).toFixed(2)}ms    |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{(domContentLoadedEventEnd - domContentLoadedEventStart).toFixed(2)}ms    |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{(domComplete - domContentLoadedEventEnd).toFixed(2)}ms    |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{(total - domComplete).toFixed(2)}ms    |</Text></Box>
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
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{responseEnd}ms |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
			</Box>
			<Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{domInteractive}ms |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
			</Box>
			<Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{domContentLoadedEventStart}ms |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
			</Box>
			<Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{domContentLoadedEventEnd}ms |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
			</Box>
			<Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{domComplete}ms |</Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text>|</Text></Box>
			</Box>
			<Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text></Text></Box>
				<Box justifyContent="flex-end" width="16.67%"><Text color="cyan">{total}ms |</Text></Box>
			</Box>

			</>
		)

	}

	return null;
}

module.exports = App;
export default App;
