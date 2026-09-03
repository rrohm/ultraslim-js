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

describe('ae-ultraslim æ.view controllers', function () {

  var model, controller, listener1, listener2, listener3, init;

  beforeEach(function () {
    init = jasmine.createSpy('listener3');
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


  it('has the model made observable', function () {
    expect(model.getChangeListeners).toBeDefined();
    expect(model.addChangeListener).toBeDefined();
    expect(model.clearChangeListeners).toBeDefined();
  });

  it('moves change listeners when model elements get replaced.');

  it('fires change listeners of model elements, when model gets replaced as a whole');

  it('re-renders the view when the model gets changed');
});