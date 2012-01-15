.PHONY: test

test:
	node_modules/.bin/nodeunit test/conversion.test.js
