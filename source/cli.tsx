#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './ui';

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

render(<App url={cli.flags.url}/>);
