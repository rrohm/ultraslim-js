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

/* global expect, jasmine, Function */

import æ from '../src/src/ae-ultraslim.mjs';

describe('ae-ultraslim-object Test Suite', function () {
  beforeEach(function(){
    console.log = function () {}; // override standard logger
  });
  
  it('runs specs.', function () {
    expect(true).toBe(true);
  });
});


describe('ae-ultraslim-object function', function () {
  var o1, o2, listener1, listener2, listener3;
  
  beforeEach(function () {
    o1 = {id: 123, name: "Max"};
    o2 = {id: 123, name: "Max", address: {street: 'Downingstreet', nr: 10}};
    æ.object(o1);
    æ.object(o2);
    listener1 = jasmine.createSpy('listener1');
    listener2 = jasmine.createSpy('listener2');
    listener3 = jasmine.createSpy('listener3');
  });
  
  it('is provided.', function () {
    expect(æ.object).toBeDefined();
    expect(typeof æ.object).toEqual('function');
  });

  it('creates getters.', function () {

    expect(o1.id).toBe(123);
    expect(o1.name).toBe('Max');

    o1.id = 234;
    o1.name = "M. Mustermann";

    expect(o1.id).toBe(234);
    expect(o1.name).toBe('M. Mustermann');

    o1.id = 345;
    o1.name = "M. Müller";
    
    expect(o1.id).toBe(345);
    expect(o1.name).toBe('M. Müller');
  });
  
  xit('creates setters.', function () {
    
  });
  
  it('fires single change listeners.', function () {
    o1.addChangeListener('name', listener1);
    o1.addChangeListener('id', listener3);
    o1.name = "M. Müller";
    
    expect(listener1).toHaveBeenCalled();
    expect(listener1).toHaveBeenCalledWith(o1, 'Max', 'M. Müller');
    expect(listener3).not.toHaveBeenCalled();
    
  });
  
  it('fires multiple change listeners.', function () {
    o1.addChangeListener('name', listener1);
    o1.addChangeListener('name', listener2);
    o1.addChangeListener('id', listener3);
    o1.name = "M. Müller";
    
    expect(listener1).toHaveBeenCalled();
    expect(listener2).toHaveBeenCalled();
    expect(listener1).toHaveBeenCalledWith(o1, 'Max', 'M. Müller');
    expect(listener2).toHaveBeenCalledWith(o1, 'Max', 'M. Müller');
    expect(listener3).not.toHaveBeenCalled();
    
  });
  
  it('returns a list of all listeners.', function () {
    o1.addChangeListener('name', listener1);
    o1.addChangeListener('name', listener2);
    o1.addChangeListener('id', listener3);
    
    expect(o1.getChangeListeners).toBeDefined();
    var listeners = o1.getChangeListeners();
    
    expect(listeners.name).toBeDefined();
    expect(listeners.id).toBeDefined();
    expect(listeners.name.length).toEqual(2);
    expect(listeners.id.length).toEqual(1);
  });
  
  it('lets you clear all listeners.', function () {
    o1.addChangeListener('name', listener1);
    o1.addChangeListener('name', listener2);
    o1.addChangeListener('id', listener3);
    
    expect(o1.getChangeListeners).toBeDefined();
    expect(o1.clearChangeListeners).toBeDefined();
    
    o1.clearChangeListeners();
    var listeners = o1.getChangeListeners();
    
    expect(listeners.name).not.toBeDefined();
    expect(listeners.id).not.toBeDefined();
  });
  
  xit('is reentrant', function () {
    
  });
  
  it('makes sub-objects observable', function () {
    o2.addChangeListener('name', listener1);
    o2.address.addChangeListener('street', listener2);

    o2.name = "M. Müller";
    o2.address.street = 'Schlossallee';
    
    expect(listener1).toHaveBeenCalled();
    expect(listener2).toHaveBeenCalled();
    expect(listener1).toHaveBeenCalledWith(o2, 'Max', 'M. Müller');
    expect(listener2).toHaveBeenCalledWith(o2.address, 'Downingstreet', 'Schlossallee');
    expect(listener3).not.toHaveBeenCalled();
  });
  
  it('traps setting sub-objects ', function () {
    o2.addChangeListener('address', listener1);
    o2.address.addChangeListener('street', listener2);
    var a0 = o2.address;
    var a1 = {street: 'a1'};
    var a2 = {street: 'a2'};
    
    o2.address = a1;
    o2.address = a2;
    
    expect(listener1).toHaveBeenCalled();
    expect(listener1).toHaveBeenCalledWith(o2, a0, a1);
    expect(listener1).toHaveBeenCalledWith(o2, a1, a2);
    expect(listener2).not.toHaveBeenCalled();
    expect(listener3).not.toHaveBeenCalled();
  });
  
  it('returns the listeners count with the listeners.size() function', function () {
    expect(o1.getChangeListeners).toBeDefined();
    expect(o1.getChangeListeners()).toBeDefined();
    expect(typeof o1.getChangeListeners()).toEqual('object');
    expect(o1.getChangeListeners().size).toBeDefined();
    expect(o1.getChangeListeners().size instanceof Function).toBe(true);
    expect(o1.getChangeListeners().size()).toBe(0);
    
    o1.addChangeListener('name', listener1);
    expect(o1.getChangeListeners().size()).toBe(1);
  });
  
  it('returns the listeners in an asoc. array, i.e. object.', function () {
    expect(o1.getChangeListeners).toBeDefined();
    expect(o2.getChangeListeners).toBeDefined();
    
    expect(o1.getChangeListeners() instanceof Object).toBe(true);
    expect(typeof o1.getChangeListeners()).toEqual('object');
    expect(o1.getChangeListeners().size()).toBe(0);
  });
  
  it('moves change listeners when elements get replaced.', function () {
    o2.addChangeListener('address', function(){});
    o2.address.addChangeListener('street', listener2);
    
    var a0 = o2.address;
    var a1 = {street: 'a1'};
    var a2 = {street: 'a2'};
    
    expect(o2.getChangeListeners().size()).toEqual(1);
    expect(o2.address.getChangeListeners().size()).toEqual(1);

    o2.address = a2;

    expect(o2.getChangeListeners().size()).toEqual(1);
    expect(o2.address.getChangeListeners().size()).toEqual(1);
    
    o2.address.street = 'new street ...'; // throws
    expect(listener2).toHaveBeenCalled();
  });
});