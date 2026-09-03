/* 
 * The MIT License
 *
 * Copyright 2024 Robert Rohm&lt;r.rohm@aeonium-systems.de&gt;.
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

/* global expect, NodeList, spyOn, jasmine */

import æ from '../src/src/ae-ultraslim.mjs';

describe('ae-ultraslim æ.view content viewer', function () {
  it('provides the æ.view.show() function', function () {
    expect(æ.view('foo').show).toBeDefined();
    expect(typeof æ.view('foo').show).toBe('function');
//    expect(typeof æ.view('foo').show('foo')).toBe('object');
  });


  describe('View.show(fragmentURL, controller)', function () {
    var request, fragmentURL;
    var onSuccess, onFailure, onDone;
    var el, router, view;
    var controller = {
      init: function () {
        console.log('controller.init CALLED');
      }};

    beforeEach(function () {
//      jasmine.Ajax.install();

      onSuccess = jasmine.createSpy('onSuccess');
      onFailure = jasmine.createSpy('onFailure');
      onDone = jasmine.createSpy('onDone');
      el = document.createElement('DIV');
      document.getElementsByTagName('BODY').item(0).appendChild(el);
      el.id = 'VIEW';
      
      fragmentURL = '__spec__/spec/data/fragment1.html';
      view = æ.view('#VIEW');
      router = æ.router();
      router.on('/', function(){
        view.show(fragmentURL, controller);
      });
      
    });

    afterEach(function () {
//      jasmine.Ajax.uninstall();
    });

    xit('invokes the controller.init(element) method, if present', async function () {
      controller.init = function () {
        console.log('controller.init CALLED');
      };
      spyOn(controller, 'init').and.callThrough();

      æ.templates.cache = {}; // reset cache
      await router.navigate('/');

      expect(æ.templates.cache).toBeDefined();
//      expect(æ.templates.cache[fragmentURL]).toBeDefined();

      expect(controller.init).toHaveBeenCalled();
    });
    
    xit('takes also controllers without .init(element) method.', function () {
      controller = {};

      æ.templates.cache = {}; // reset cache
      router.navigate('/');

      request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({status: 200, responseText: "<div>FRAGMENT 1</div>"});

      expect(æ.templates.cache).toBeDefined();
      expect(æ.templates.cache[fragmentURL]).toBeDefined();
    });
  });

  describe('View.render(template, model, controller)', function () {
    var view;
    beforeEach(function () {
      view = æ.view('foo');
    });

    it('passes the template through if no model given.', function () {
      var t = '<div ae-repeat="data">would repeated with model {{id}} </div>';
      expect(view.render(t)).toEqual(t);
    });

//    xit('returns a DOM NodeList if ae- is used (and a model is given)', function () {
//      var t = '<div ae-repeat="data">would repeated with model {{id}} </div>';
//      expect(view.render(t, {}) instanceof NodeList).toBe(true);
//    });
    it('returns an object if ae- is used (and a model is given)', function () {
      var tIn = '<div ae-repeat="data">would repeated with model {{id}} </div>';
      var tOut = '<div ae-repeat="data">would repeated with model  </div>';
      expect(typeof view.render(tIn, {})).toBe('object');
    });

    it('returns a string if ae- is NOT used (and a model is given)', function () {
      var tIn = '<div data="data">would repeated with model {{id}} </div>';
      var tOut = '<div data="data">would repeated with model {{id}} </div>';
      expect(typeof view.render(tIn, {})).toBe('string');
      expect(view.render(tIn, {})).toEqual(tOut);
    });

    it('renders a string if ae- is NOT used ', function () {
      var t = '<div data="data">data with model {{id}} </div>';
      var result = '<div data="data">data with model 123 </div>';
      var model = {
        id: 123,
        unused: 'unused data'
      };
      spyOn(view, 'replace').and.callThrough();
      expect(view.render(t, model)).toEqual(result);
      expect(view.replace).toHaveBeenCalled();
    });

    it('evaluates ae-repeat attributes', function () {
      var t = '<div class="ok" ae-repeat="data">would repeated with model {{id}} </div>';
      var model = {
        data: [{id: 123}, {id: 456}],
        unused: 'unused data'
      };

      spyOn(view, 'replace').and.callThrough();

      var list = view.render(t, model);
      var result = '';
      for (var i = 0; i < list.length; i++) {
        result += list[i].outerHTML;
      }
      // new: repeated nodes get a new attribute assigned as marker for better removel (ae-repeated="true")
      expect(result).toEqual('<div class="ok" ae-repeated="true">would repeated with model 123 </div><div class="ok" ae-repeated="true">would repeated with model 456 </div>');
    });

    xit('applies model properties as values to {{...}} placeholders', function () {

    });
  });

  describe('View.replace(template, model)', function () {
    var view;
    beforeEach(function () {
      view = æ.view('foo');
    });

    it('replaces placeholders with model property values', function () {
      var t = '<div data="data">would {{t}} repeated with model {{id}} </div>';
      var result = '<div data="data">would be repeated with model 123 </div>';
      var model = {
        id: 123,
        unused: 'unused data',
        t: 'be'
      };

      expect(view.replace(t, model)).toEqual(result);
    });

    it('replaces multiple occurences', function () {
      var t = 'foo {{id}} foo {{id}} ';
      var result = 'foo 123 foo 123 ';
      var model = {
        id: 123,
        unused: 'unused data'
      };

      expect(view.replace(t, model)).toEqual(result);
    });

    it('replaces null-properties with empty strings', function () {
      var t = 'ID {{id}} is {{name}} ';
      var result = 'ID 123 is  ';
      var model = {
        id: 123,
        name: null
      };

      expect(view.replace(t, model)).toEqual(result);
    });
  });

//  describe('View.process(element, model, controller)', function () {
//    
//  });
  
  describe('View.replace(template, model) filtering', function () {
    var view;
    var controller = {
      init: function () {
        console.log('controller.init CALLED');
      },
      filterTest: function(input){
        return '###' + input + '###';
      }
    };
    beforeEach(function () {
      view = æ.view('foo');
      view.controller = controller;
    });
    
    it('applies filter function', function () {
      var t = 'ID {{id}} is {{name|filterTest}} ';
      var result = 'ID 123 is ###TEST### ';
      var model = {
        id: 123,
        name: 'TEST'
      };

      expect(view.replace(t, model)).toEqual(result);
    });
    
    it('applies filter function also on single instances with trailing other placeholders', function () {
      var t = '{{name|filterTest}} is ID {{id}} ';
      var result = '###TEST### is ID 123 ';
      var model = {
        id: 123,
        name: 'TEST'
      };

      expect(view.replace(t, model)).toEqual(result);
    });
  });
});