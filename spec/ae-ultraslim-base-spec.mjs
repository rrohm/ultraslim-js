/* 
 * The MIT License
 *
 * Copyright 2024 Robert Rohm r.rohm@aeonium-systems.de.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/* global expect, jasmine */

import æ from '../src/src/ae-ultraslim.mjs';
//import 'jasmine-ajax';
//require('jasmine-ajax')

describe('ae-ultraslim Test Suite', function () {
  it('runs specs.', function () {
    expect(true).toBe(true);
  });
});

describe('ae-ultraslim library', function () {
  it('provides the æ object.', function () {
    expect(æ).toBeDefined();
  });
});

describe('ae-ultraslim æ object', function () {
  it('provides the æ.templates object.', function () {
    expect(æ.templates).toBeDefined();
  });
  it('provides the æ.view() function.', function () {
    expect(æ.view).toBeDefined();
    expect(typeof æ.view).toBe('function');
  });
});
describe('ae-ultraslim æ.templates.load() template loader', function () {
  var request, fragmentURL;
  var onSuccess, onFailure, onDone;

  beforeEach(function () {
    onSuccess = jasmine.createSpy('onSuccess');
    onFailure = jasmine.createSpy('onFailure');
    onDone = jasmine.createSpy('onDone');
  });

  afterEach(function () {
  });

  xit('loads templates from a URL string and caches them.', function () {
    expect(æ.templates.load).toBeDefined();
    fragmentURL = '__spec__/spec/data/fragment1.html';

    æ.templates.cache = {}; // reset cache
    æ.templates.onLoad = onSuccess;
    æ.templates.onError = onFailure;
    æ.templates.onDone = onDone;

    æ.templates.load(fragmentURL);

    expect(onSuccess).toHaveBeenCalled();
    expect(onDone).toHaveBeenCalled();
    expect(æ.templates.cache).toBeDefined();
    expect(æ.templates.cache[fragmentURL]).toBeDefined();
  });

  xit('loads templates from a config.url and caches them.', function () {
    expect(æ.templates.load).toBeDefined();
    fragmentURL = 'fragment1.html';

    æ.templates.cache = {}; // reset cache
    æ.templates.onLoad = onSuccess;
    æ.templates.onError = onFailure;
    æ.templates.onDone = onDone;

    æ.templates.load({url: fragmentURL});

    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith({status: 200, responseText: "<div>FRAGMENT 1</div>"});

    expect(onSuccess).toHaveBeenCalled();
    expect(onDone).toHaveBeenCalled();
    expect(æ.templates.cache).toBeDefined();
    expect(æ.templates.cache[fragmentURL]).toBeDefined();
  });

  xit('passes through optional controllers.', function () {
    // it actually works, but the matcher needs fixing
    expect(æ.templates.load).toBeDefined();
    fragmentURL = 'fragment1.html';
    const text = "<div>FRAGMENT 1</div>";
    var controller = {};
    var config = {url: fragmentURL, controller: controller};

    æ.templates.cache = {}; // reset cache
    æ.templates.onLoad = onSuccess;
    æ.templates.onError = onFailure;
    æ.templates.onDone = onDone;

    æ.templates.load(config);

    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith({status: 200, responseText: text});

    expect(onSuccess).toHaveBeenCalled();
    expect(onDone).toHaveBeenCalled();
    expect(onDone).toHaveBeenCalledWith(text, config);
    
    expect(æ.templates.cache).toBeDefined();
    expect(æ.templates.cache[fragmentURL]).toBeDefined();
  });

  xit('fetches templates from the cache if already loaded.', function () {
    expect(æ.templates.load).toBeDefined();
    fragmentURL = 'fragment1.html';
    æ.templates.cache = {};// reset cache
    æ.templates.onLoad = onSuccess;
    æ.templates.onError = onFailure;
    æ.templates.onDone = onDone;
    æ.templates.load(fragmentURL);

    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith({status: 200, responseText: "<div>FRAGMENT 1</div>"});

    æ.templates.load(fragmentURL);
    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith({status: 200, responseText: "<div>FRAGMENT 1</div>"});

    expect(onSuccess).toHaveBeenCalled();
    expect(onSuccess.calls.count()).toBe(1);
    expect(onDone).toHaveBeenCalled();
    expect(onDone.calls.count()).toBe(2);
    expect(æ.templates.cache).toBeDefined();
    expect(æ.templates.cache[fragmentURL]).toBeDefined();
  });

  xit('calls the error handler if XHR status not 2xx.', function () {
    fragmentURL = 'fragment1.html';
    æ.templates.cache = {};// reset cache
    æ.templates.onLoad = onSuccess;
    æ.templates.onError = onFailure;
    æ.templates.onDone = onDone;
    æ.templates.load(fragmentURL);

    request = jasmine.Ajax.requests.mostRecent();
    request.respondWith({status: 404, responseText: "404 Not found."});

    expect(onSuccess.calls.count()).toBe(0);
    expect(onFailure.calls.count()).toBe(1);
    expect(onDone.calls.count()).toBe(0);
  });

  xit('calls the error handler if url is invalid.', function () {
  });
});

