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

describe('ae-ultraslim-object Array-property Test Suite', function () {
  beforeEach(function(){
    console.log = function () {}; // override standard logger
  });
  
  it('runs specs.', function () {
    expect(true).toBe(true);
  });
});


describe('ae-ultraslim-object function for array properties', function () {
  var o1, o2, called;
  
  beforeEach(function () {
    o1 = {list: [1, 2, 3, 4]};
    o2 = {list: [{name: 'John'}, {name: 'Jack'}, {name: 'Jil'}]};
    æ.object(o1);
    æ.object(o2);
    called = false;
  });
  
  
  it('fires change listener on array replacement.', function () {
    o1.addChangeListener('list', (x, v1, v2) => {
      called = true;
    });
    
    o1.list = [0,10,100];
    
    expect(called).toBe(true);
  });
  
  xit('fires change listener on set[].', function () {
    o1.addChangeListener('list', (x, v1, v2) => {
      called = true;
    });
    
    o1.list[5] = 5;
    
    expect(called).toBe(true);
  });
  
  it('fires change listener on inserting pritive values (numbers).', function () {
    o1.addChangeListener('list', (x, v1, v2) => {
      called = true;
    });

    o1.list.push(5);
    
    expect(called).toBe(true);
  });
  
  it('fires change listener on inserting objects.', function () {
    o2.addChangeListener('list', (x, v1, v2) => {
      called = true;
    });

    o2.list.push({name:'Jim'});
    
    expect(called).toBe(true);
  });
});