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

# Docs Repository Name
DOCS_REPONAME = cli-framework-docs

# Docs Repository Path
DOCS_REPOPATH = $(CURRENT_DIR)/../$(DOCS_REPONAME)

# Docs Temp Dir
DOCS_TEMP = $(CURRENT_DIR)/.docstemp

# Sources
SRCS = $(shell find lib -type f -name '*.js')

# Specs
SPECS = $(shell find test/specs -type f -name '*.js')

.PHONY: test jshint docs

test:
	$(MOCHA) $(SPECS)

test-coverage:
	$(MOCHA) -R html-cov $(SPECS) > coverage.html

jshint:
	jshint $(SRCS)

docs:
	@if [ ! -d $(DOCS_REPOPATH) ]; then \
		cd ../; \
		git clone git@github.com:xenophy/cli-framework.git $(DOCS_REPONAME); \
		git checkout gh-pages; \
	fi
	@if [ ! -d $(DOCS_TEMP) ]; then \
		mkdir $(DOCS_TEMP); \
	fi
	@jsduck $(CURRENT_DIR)/lib --output $(DOCS_TEMP) --title="CLI Framework"
	@cp -Rf $(DOCS_TEMP)/* $(DOCS_REPOPATH)
	cd $(DOCS_REPOPATH);\
	git checkout gh-pages;\
	git add *;\
	git commit -a -m "Re:Generate Documentation.";\
	git push origin gh-pages;

FORCE:
