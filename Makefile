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

# Current Dir
CURRENT_DIR=$(shell pwd)

# mocha path
MOCHA = mocha

# Library Dir
LIBDIR = $(CURRENT_DIR)/lib

# Sources
SRCS = $(shell find lib -type f -name '*.js')

.PHONY: test

test:
	$(MOCHA) test/specs

test-coverage:
	$(MOCHA) -R html-cov test/specs > coverage.html

jshint:
	jshint $(SRCS)

FORCE:
