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

describe('ae-ultraslim æ.service', function () {

  var model, controller, listener1, listener2, listener3, init;

  beforeEach(function () {
    init = jasmine.createSpy('init');
    listener1 = jasmine.createSpy('listener1');
    listener2 = jasmine.createSpy('listener2');
    listener3 = jasmine.createSpy('listener3');

    model = {id: 123, name: "Max", address: {street: 'Downingstreet', nr: 10}};
    controller = {
      model: model,
      init: init
    };
    æ.object(model);
  });

  it('is a function', function () {
    expect(æ.service).toBeDefined();
    expect(typeof æ.service).toEqual('function');
  });

  it('accepts a global config.onError handler function', function () {
    var handler = function () {};
    var service = æ.service(model, 'address', {
      onError: handler
    });

    expect(service).toBeDefined();
    expect(service.onError).toBeDefined();
    expect(service.onError).toEqual(handler);
  });

  it('rejects a global config.onError handler if it is not a function', function () {
    expect(function () {
      æ.service(model, 'address', {
        onError: "handler"
      });
    }).toThrowError('onError-handler is not a function.');
  });

  it('accepts a global config.onBeforeSend handler function', function () {
    var handler = function () {};
    var service = æ.service(model, 'address', {
      onBeforeSend: handler
    });

    expect(service).toBeDefined();
    expect(service.onBeforeSend).toBeDefined();
    expect(service.onBeforeSend).toEqual(handler);
  });

  it('accepts a config.dataProp property', function () {
    var handler = function () {};
    var propertyName = 'this-is-the-data';
    var service = æ.service(model, 'address', {
      url: 'bla',
      dataProp: propertyName,
      onBeforeSend: handler
    });

    expect(service).toBeDefined();
    expect(service.dataProp).toBeDefined();
    expect(service.dataProp).toEqual(propertyName);
  });

  it('rejects a global config.onBeforeSend handler if it is not a function', function () {
    expect(function () {
      æ.service(model, 'address', {
        onBeforeSend: "handler"
      });
    }).toThrowError('onBeforeSend-handler is not a function.');
  });

  it('accepts a global config.onDone handler function', function () {
    var handler = function () {};
    var service = æ.service(model, 'address', {
      onDone: handler
    });

    expect(service).toBeDefined();
    expect(service.onDone).toBeDefined();
    expect(service.onDone).toEqual(handler);
  });

  it('rejects a global config.onDone handler if it is not a function', function () {
    expect(function () {
      æ.service(model, 'address', {
        onDone: "handler"
      });
    }).toThrowError('onDone-handler is not a function.');
  });

  describe('sending GET requests', function () {
    beforeEach(function () {
      jasmine.Ajax.install();
      model.persons = [];
      listener1 = jasmine.createSpy('listener1');
      listener2 = jasmine.createSpy('listener2');
      listener3 = jasmine.createSpy('listener3');
    });
    afterEach(function () {
      jasmine.Ajax.uninstall();
    });
    it('loads model property', async function () {
      var service = æ.service(model, 'persons', {
        url: '__spec__/spec/data/persons.json'
      });
      await service.load();

      let request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({status: 200, responseText: '[{"id":1000,"name":"Maurer"},{"id":1001,"name":"Mueller"}]'});

      expect(model.persons.length).toEqual(2);
      expect(model.persons[1].id).toBeDefined();
      expect(model.persons[1].id).toEqual(1001);
    });
    it('loads model from data property', function () {
      var service = æ.service(model, 'persons', {
        url: 'test/data/persons.json',
        dataProp: 'data'
      });
      service.load();

      let request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({status: 200, responseText: '{"some":"thing","data":[{"id":1000,"name":"Maurer"},{"id":1001,"name":"Mueller"}]}'});

      expect(model.persons.length).toEqual(2);
      expect(model.persons[1].id).toBeDefined();
      expect(model.persons[1].id).toEqual(1001);
    });
    it('calls global onBeforeSend-, onSuccess- and onDone-handlers', function () {
      var service = æ.service(model, 'persons', {
        url: 'test/data/persons.json',
        onBeforeSend: listener1,
        onSuccess: listener2,
        onDone: listener3
      });
      service.load();

      let request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({status: 200, responseText: '[{"id":1000,"name":"Maurer"}]'});

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
      expect(listener3).toHaveBeenCalled();
    });
    it('calls overriding onBeforeSend-, onSuccess- and onDone-handlers', function () {
      var service = æ.service(model, 'persons', {
        url: 'test/data/persons.json',
        onBeforeSend: listener1,
        onSuccess: listener2,
        onDone: listener3
      });

      var listener4 = jasmine.createSpy('listener4');
      var listener5 = jasmine.createSpy('listener5');
      var listener6 = jasmine.createSpy('listener6');

      service.load({
        onBeforeSend: listener4,
        onSuccess: listener5,
        onDone: listener6
      });

      let request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({status: 200, responseText: '[{"id":1000,"name":"Maurer"}]'});

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
      expect(listener3).not.toHaveBeenCalled();
      expect(listener4).toHaveBeenCalled();
      expect(listener5).toHaveBeenCalled();
      expect(listener6).toHaveBeenCalled();
    });
    it('skips overriding  onBeforeSend-, onSuccess- and onDone-Handler if it is not a function.', function () {

      var service = æ.service(model, 'persons', {
        url: 'test/data/persons.json',
        onBeforeSend: listener1,
        onSuccess: listener2,
        onDone: listener3
      });

      service.load({
        onBeforeSend: 'listener4',
        onSuccess: 'listener5',
        onDone: 'listener6'
      });

      let request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({status: 200, responseText: '[{"id":1000,"name":"Maurer"}]'});

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
      expect(listener3).toHaveBeenCalled();
    });

    it('calls global oError- and onDone-handlers', function () {
      var listener4 = jasmine.createSpy('listener4');
      var service = æ.service(model, 'persons', {
        url: 'test/data/persons.json',
        onBeforeSend: listener1,
        onSuccess: listener2,
        onError: listener3,
        onDone: listener4
      });
      service.load();

      let request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({status: 403, responseText: 'Authorization required.'});

      expect(listener1).toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
      expect(listener3).toHaveBeenCalled();
      expect(listener4).toHaveBeenCalled();

    });
    it('calls overriding oError- and onDone-handlers', function () {
      var service = æ.service(model, 'persons', {
        url: 'test/data/persons.json',
        onBeforeSend: listener1,
        onSuccess: listener2,
        onError: listener3,
        onDone: listener4
      });

      var listener4 = jasmine.createSpy('listener4');
      var listener5 = jasmine.createSpy('listener5');
      var listener6 = jasmine.createSpy('listener6');
      var listener7 = jasmine.createSpy('listener7');
      var listener8 = jasmine.createSpy('listener8');

      service.load({
        onBeforeSend: listener5,
        onSuccess: listener6,
        onError: listener7,
        onDone: listener8
      });

      let request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({status: 403, responseText: 'Authorization required.'});

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
      expect(listener3).not.toHaveBeenCalled();
      expect(listener4).not.toHaveBeenCalled();
      expect(listener5).toHaveBeenCalled();
      expect(listener6).not.toHaveBeenCalled();
      expect(listener7).toHaveBeenCalled();
      expect(listener8).toHaveBeenCalled();

    });
    it('skips overriding onError-Handler if it is not a function.', function () {
      var service = æ.service(model, 'persons', {
        url: 'test/data/persons.json',
        onBeforeSend: listener1,
        onSuccess: listener2,
        onError: listener3,
        onDone: listener4
      });

      var listener4 = jasmine.createSpy('listener4');
      var listener5 = jasmine.createSpy('listener5');
      var listener6 = jasmine.createSpy('listener6');
      var listener7 = jasmine.createSpy('listener7');
      var listener8 = jasmine.createSpy('listener8');

      service.load({
        onBeforeSend: listener5,
        onSuccess: listener6,
        onError: 'listener7',
        onDone: listener8
      });

      let request = jasmine.Ajax.requests.mostRecent();
      request.respondWith({status: 403, responseText: 'Authorization required.'});

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
      expect(listener3).toHaveBeenCalled();
      expect(listener4).not.toHaveBeenCalled();
      expect(listener5).toHaveBeenCalled();
      expect(listener6).not.toHaveBeenCalled();
      expect(listener7).not.toHaveBeenCalled();
      expect(listener8).toHaveBeenCalled();

    });
  });

});