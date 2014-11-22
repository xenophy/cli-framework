#############################################################################
# Makefile for CLI Framewrok test
#
# Use "mocha" test framework for node.js
# Plase install "mocha" like a folloing:
#
# > sudo npm install -g mocha
#
# or change path to your installed mocha.
#
# Kazuhiro Kotsutsumi <kotsutsumi@xenophy.com>
#############################################################################

MOCHA = mocha
.PHONY: test

test:
	$(MOCHA) test/specs

test-coverage:
	$(MOCHA) -R html-cov test/specs > coverage.html

FORCE:
