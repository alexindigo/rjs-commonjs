# rjs-commonjs

Extracted commonJs (and dependencies) module from jrburke/r.js.

[![Build Status](https://travis-ci.org/alexindigo/rjs-commonjs.svg?branch=master)](https://travis-ci.org/alexindigo/rjs-commonjs)

Allows to wrap CommonJS modules with `define` statements including dependency list for AMD environment,
but without pulling all the dependencies, as `r.js` does it.

Also exposes `rjsCommonjs.commonjs` and `rjsCommonjs.transform` objects from `r.js` if greater flexibility is required.

## Example

```javascript
var fs = require('fs');
var rjsCommonjs = require('rjs-commonjs');

var moduleName = 'rendr/client/app_view';
var content    = fs.readFileSync(require.resolve(moduleName), {encoding: 'utf8'});

console.log('BEFORE:\n', content);

// wraps with define statement
// and adds list of dependencies
content = rjsCommonjs(moduleName, content);

console.log('AFTER:\n', content);
```

### Before

```javascript
var _ = require('underscore'),
    Backbone = require('backbone'),
    BaseView = require('../shared/base/view'),
    isServer = (typeof window === 'undefined');


if (!isServer) {
  Backbone.$ = window.$ || require('jquery');
}

module.exports = BaseView.extend({
  el: 'body',

  constructor: function() {
    BaseView.apply(this, arguments);

    _.defaults(this.options, {
      contentEl: '#content'
    });

    /**
     * Grab the element that contains the main view.
     */
    this.$content = Backbone.$(this.options.contentEl);
    this._bindInterceptClick();
  },

  hasPushState: typeof window !== "undefined" && window.history.pushState != null,

  render: function() {},

  setCurrentView: function(view) {
    this.$content.html(view.el);
    view.render();
  },

  _bindInterceptClick: function() {
    this.$el.on('click', 'a:not([data-pass-thru])', this._interceptClick.bind(this));
  },

  _interceptClick: function(e) {
    /**
     * We want the actual value of the attribute, rather than the
     * full URL, so we use jQuery instead of just e.currentTarget.href
     */
    var href = Backbone.$(e.currentTarget).attr('href');
    if (this.shouldInterceptClick(href, e.currentTarget, e)) {
      e.preventDefault();
      this.app.router.redirectTo(href);
    }
  },

  shouldInterceptClick: function(href, el, e) {
    var hashParts, isHashClick;

    if (!(href && this.hasPushState) || e.metaKey || e.shiftKey) {
      return false;
    }

    hashParts = href.split('#');
    isHashClick = hashParts.length > 1 && hashParts[0] === window.location.pathname;
    return !isHashClick && href.slice(0, 1) === '/' && href.slice(0, 2) !== '//';
  }

});

```

### After

```javascript
define('rendr/client/app_view',['require','exports','module','underscore','backbone','../shared/base/view','jquery'],function (require, exports, module) {var _ = require('underscore'),
    Backbone = require('backbone'),
    BaseView = require('../shared/base/view'),
    isServer = (typeof window === 'undefined');


if (!isServer) {
  Backbone.$ = window.$ || require('jquery');
}

module.exports = BaseView.extend({
  el: 'body',

  constructor: function() {
    BaseView.apply(this, arguments);

    _.defaults(this.options, {
      contentEl: '#content'
    });

    /**
     * Grab the element that contains the main view.
     */
    this.$content = Backbone.$(this.options.contentEl);
    this._bindInterceptClick();
  },

  hasPushState: typeof window !== "undefined" && window.history.pushState != null,

  render: function() {},

  setCurrentView: function(view) {
    this.$content.html(view.el);
    view.render();
  },

  _bindInterceptClick: function() {
    this.$el.on('click', 'a:not([data-pass-thru])', this._interceptClick.bind(this));
  },

  _interceptClick: function(e) {
    /**
     * We want the actual value of the attribute, rather than the
     * full URL, so we use jQuery instead of just e.currentTarget.href
     */
    var href = Backbone.$(e.currentTarget).attr('href');
    if (this.shouldInterceptClick(href, e.currentTarget, e)) {
      e.preventDefault();
      this.app.router.redirectTo(href);
    }
  },

  shouldInterceptClick: function(href, el, e) {
    var hashParts, isHashClick;

    if (!(href && this.hasPushState) || e.metaKey || e.shiftKey) {
      return false;
    }

    hashParts = href.split('#');
    isHashClick = hashParts.length > 1 && hashParts[0] === window.location.pathname;
    return !isHashClick && href.slice(0, 1) === '/' && href.slice(0, 2) !== '//';
  }

});

});
```

## License

MIT
