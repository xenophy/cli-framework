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

# Specs Dir
SPEC_DIR = $(CURRENT_DIR)/test/specs

# Sources
SRCS = $(shell find lib -type f -name '*.js')

# Specs
SPECS = $(shell find test/specs -type f -name '*.js')

.PHONY: test

test:
	$(MOCHA) $(SPECS)

test-coverage:
	$(MOCHA) -R html-cov $(SPECS) > coverage.html

jshint:
	jshint $(SRCS)

FORCE:
