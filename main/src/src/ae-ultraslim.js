/* 
 * The MIT License
 *
 * Copyright 2026 Robert Rohm r.rohm@aeonium-systems.de.
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

/* global Function, this, NodeList, Node */

(function (Æ) {
  'use strict';
  console.log('ae-ultraslim start', window.æ);
  /**
   * The æ namespace provides the three basic methods æ.router(), æ.view() and æ.service() of the ae-ultraslim 
   * framework. 
   * 
   * @namespace æ
   * @type Æ|Window.æ|window.æ|window.ultraslim
   * @tutorial getting_started
   */
  var æ = window.æ || new Æ();
  window.æ = window.ultraslim = æ;

}(function () {
  console.log('ae-ultraslim initialization');
  /**
   * The template loader. 
   */
  this.templates = {};
  
  /**
   * Registry Array for created services
   */
  this.services = [];
  
  var attrPrefix = 'ae-';
  var expPrefix = '{{';
  var expSuffix = '}}';

  /**
   * The internal view cache.
   */
  var views = {};
  var me = this;

  /**
   * Load a template fragment from a given URL or reuse it from æ.templates 
   * cache. If config is an object, it is propagated to the onDone handler or
   * the onError handler.
   * 
   * @param {String|Object} config URL or optional configuration object.
   * @returns {undefined}
   */
  this.templates.load = function (config) {
    var me = this;
    var xhr = new XMLHttpRequest();
    var url = (typeof config === 'string') ? config : config.url;
    var confObj = (typeof config === 'object') ? config : undefined;

    if (this.cache[url]) {
      var t = this.cache[url];
      if (me.onDone && me.onDone instanceof Function) {
        me.onDone(t, confObj);
      }
      return;
    }

    xhr.addEventListener('load', function () {
      var t = xhr.responseText;

      if (xhr.status < 300) {
        if (me.onLoad && me.onLoad instanceof Function) {
          var processed = me.onLoad(t);
          t = (processed) ? processed : t;
        }
        me.cache[url] = t;
        if (me.onDone && me.onDone instanceof Function) {
          me.onDone(t, confObj);
        }

      } else {
        if (me.onError && me.onError instanceof Function) {
          me.onError(confObj);
        }
      }
    });
    xhr.addEventListener('error', function () {
      if (me.onError && me.onError instanceof Function) {
        me.onError(confObj);
      }
    });
    xhr.open('GET', url);
    xhr.send();
  };

  /**
   * Optional handler for HTTP success - not called for status codes other than 
   * 2xx codes!
   */
  this.templates.onLoad = undefined;
  /**
   * Optional handler for HTTP failure, also for HTTP error codes like 4xx or 
   * 5xx codes.
   */
  this.templates.onError = undefined;

  /**
   * Default onDone handler - takes the loaded template and passes it through. 
   * Provide a custem handler following this pattern, at need.
   * @param {type} template
   * @returns {String}
   */
  this.templates.onDone = function (template) {
    return template;
  };
  this.templates.cache = {};

  /**
   * Create a REST service API object for the given model property. 
   * @function service
   * @memberOf æ
   * @param {Object} o The model object
   * @param {String} prop The property of the model to create a service for
   * @param {Object} config The configuration object
   * @returns {ae-ultraslimL#166.service.service}
   */
  this.service = function (o, prop, config) {
    console.log("æ.data() ", o, prop, config);
    if (o === undefined || typeof o !== 'object' || typeof o !== 'object') {
      throw new Error("o is not an object.");
    }
    if (config === undefined || typeof config !== 'object') {
      throw new Error("No configuration object.");
    }
    if (config.onError !== undefined && typeof config.onError !== 'function') {
      throw new Error("onError-handler is not a function.");
    }
    if (config.onBeforeSend !== undefined && typeof config.onBeforeSend !== 'function') {
      throw new Error("onBeforeSend-handler is not a function.");
    }
    if (config.onDone !== undefined && typeof config.onDone !== 'function') {
      throw new Error("onDone-handler is not a function.");
    }
    // if data property does not exist: create as an emtpy array.
    if (!o.hasOwnProperty(prop)) {
      o[prop] = [];
      this.object(o);
    }
    var service = {};
    service = {};
    service.url = (typeof config === 'string') ? config : config.url;
    service.dataProp = (config.dataProp !== undefined) ? config.dataProp : undefined;
    service.onError = (typeof config.onError === 'function') ? config.onError : undefined;
    service.onBeforeSend = (typeof config.onBeforeSend === 'function') ? config.onBeforeSend : undefined;
    service.onSuccess = (typeof config.onSuccess === 'function') ? config.onSuccess : undefined;
    service.onDone = (typeof config.onDone === 'function') ? config.onDone : undefined;
    æ.services.push(service);
    /**
     * Have the service issue a GET request and load data from the service URL.
     * @param {Object} config A configuration object that may contain these elements:
     * <ul>
     *   <li>Function<strong>onSuccess</strong>: Success handler, overriding the
     *    general success handler of the service.</li>
     *   <li>Function<strong>onError</strong>: Error handler, overriding the
     *    general error handler of the service.</li>
     *   <li>Function<strong>onDone</strong>: Done handler, overriding the
     *    general done handler of the service.</li>
     * </ul>
     * @returns {undefined}
     */
    service.load = function (config) {
      console.log("æ.data.http.get", o, this.url);
      var xhr = new XMLHttpRequest();

      xhr.addEventListener('load', function (e) {
        console.log("æ.data.http.get onload", o, e, xhr);
        if (xhr.status < 400) {
          var data = JSON.parse(xhr.responseText);
          o[prop] = (service.dataProp !== undefined) ? data[service.dataProp] : data;
        }

        defaultLoadHandling(config, xhr);
      });
      xhr.open('GET', this.url);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      defaultOnBeforeSendHandling(config, xhr);
      xhr.send();
    };
    service.delete = function (id, config) {
      console.log("æ.data.http.delete", o, this.url);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function () {
        defaultLoadHandling(config, xhr);
      });
      xhr.open('DELETE', this.url + '/' + id);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      defaultOnBeforeSendHandling(config, xhr);
      xhr.send();
    };
    service.create = function (data, config) {
      console.log("æ.data.http.post", o, this.url);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function () {
        defaultLoadHandling(config, xhr);
      });
      xhr.open('POST', this.url);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      defaultOnBeforeSendHandling(config, xhr);
      xhr.send(JSON.stringify(data));
    };
    service.save = function (data, config) {
      console.log("æ.data.http.put", o, this.url);
      var xhr = new XMLHttpRequest();
      xhr.addEventListener('load', function () {
        defaultLoadHandling(config, xhr);
      });
      xhr.open('PUT', this.url);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      defaultOnBeforeSendHandling(config, xhr);
      xhr.send(JSON.stringify(data));
    };

    function defaultOnSuccessHandling(config, xhr) {
      if (config && config.onSuccess && config.onSuccess instanceof Function) {
        config.onSuccess(xhr.status, xhr);
      } else if (service.onSuccess) {
        service.onSuccess(xhr.status, xhr);
      }
    }
    function defaultOnDoneHandling(config, xhr) {
      if (config && config.onDone && config.onDone instanceof Function) {
        config.onDone(xhr.status, xhr);
      } else if (service.onDone) {
        service.onDone(xhr);
      }
    }
    function defaultOnErrorHandling(config, xhr) {
      if (config && config.onError && config.onError instanceof Function) {
        config.onError(xhr.status, xhr);
      } else if (service.onError) {
        service.onError(xhr.status, xhr);
      }
    }
    function defaultOnBeforeSendHandling(config, xhr) {
      if (config && config.onBeforeSend && config.onBeforeSend instanceof Function) {
        config.onBeforeSend(xhr);
      } else if (service.onBeforeSend) {
        service.onBeforeSend(xhr);
      }
    }
    function defaultLoadHandling(config, xhr) {
      if (xhr.status < 400) {
        defaultOnSuccessHandling(config, xhr);
      } else {
        defaultOnErrorHandling(config, xhr);
      }
      defaultOnDoneHandling(config, xhr);
    }
    return service;
  };

  /**
   * Make a plain javascript object observable, i.e., replace it's fields 
   * with properties built on getters and setters.
   * @param {type} o The object to be made observable.
   * @returns {undefined}
   */
  this.object = function (o) {
    var me = this;
    var data = [];
    var listeners = {};

    console.log("æ.object() ", o);
    if (!o) {
      return;
    }

    function makeGetter(data, prop) {
      return  function () {
        return data[prop];
      };
    }
    function makeSetter(data, prop) {
      console.log('makeSetter', data, prop);
      return function (value) {
        console.log('set', this, this[prop], prop, value, typeof value, Array.isArray(value));
        if (Array.isArray(prop)) {
          console.log('set', 'array prop');
        }
        if (Array.isArray(this)) {
          console.log('set', 'array this');
        }
        if (Array.isArray(value)) {
          console.log('set.array');
          value.push = function (e) {
            console.log("PUSH (SETTER)", value, e);
            Array.prototype.push.call(value, e);
            if (listeners[prop]) {
              for (var i in listeners[prop]) {
                listeners[prop][i](o, null, value);
              }
            }
          };
          value.pop = function (e) {
            console.log("PUSH (SETTER)", value, e);
            Array.prototype.pop.call(value);
            if (listeners[prop]) {
              for (var j in listeners[prop]) {
                listeners[prop][j](o, null, value);
              }
            }
          };
          value.unshift = function (e) {
            console.log("UNSHIFT (SETTER)", value, e);
            Array.prototype.unshift.call(value, e);
            if (listeners[prop]) {
              for (var k in listeners[prop]) {
                listeners[prop][k](o, null, value);
              }
            }
          };
          value.shift = function (e) {
            console.log("SHIFT (SETTER)", value, e);
            Array.prototype.shift.call(value);
            if (listeners[prop]) {
              for (var l in listeners[prop]) {
                listeners[prop][l](o, null, value);
              }
            }
          };
          value.replace = function (index, e) {
            console.log("SPLICE (SETTER)", value, index, e);
            Array.prototype.splice.call(value, index, 1, e);
            if (listeners[prop]) {
              for (var l in listeners[prop]) {
                listeners[prop][l](o, null, value);
              }
            }
          };
        } else if (typeof value === 'object' && !Array.isArray(this)) {
          // ATTENTION! JS array are objects, too! So we need to exclude them explicitly!
          console.log('set.object ', value);
          me.object(value);
        } else {
          console.log("set else !!!!!!!!!!!!!!!!!", typeof value);
        }

        var oldValue = data[prop];
        data[prop] = value;
        if (listeners[prop]) {
          for (var i in listeners[prop]) {
            listeners[prop][i](o, oldValue, value);
          }
        }
        
        if (Array.isArray(this)) {
          console.log('set ', 'array this', this);
          for (var j in listeners) {
            console.log('listeners', j, listeners[j]);
          }
        }
      };
    }
    listeners.size = function () {
      var s = 0;
      var names = Object.getOwnPropertyNames(listeners);
      for (var i in names) {
        if (names[i] !== 'length' && names[i] !== 'size') {
          s++;
        }
      }
      return s;
    };
    for (var prop in o) {
      console.log("æ.object(): processing ", prop, typeof o[prop]);
      if (o[prop] instanceof Function) {
        console.log('æ.object(): skip function ');
        continue;
      }
      if (prop === 'http' && prop.get && prop.put && prop.delete && prop.post) {
        console.log('æ.object(): skip http');
        continue;
      }

      data[prop] = o[prop];
      delete o[prop]; // important: avoids endless getter/setter loops!

      Object.defineProperty(o, prop, {
        get: makeGetter(data, prop),
        set: makeSetter(data, prop),
        enumerable: true,
        configurable: true
      });
      // breadth-first recursion into object values
      if (Array.isArray(o[prop])) {
        this.object(o[prop]);
        o[prop].push = function (e) {
          console.log("PUSH", prop, o[prop], e);
          Array.prototype.push.call(o[prop], e);
          if (listeners[prop]) {
            me.object(e);
            for (var i in listeners[prop]) {
              listeners[prop][i](o, null, e);
            }
          }
        };
      } else if (typeof o[prop] === 'object') {
        this.object(o[prop]);
      }
    }
    if (o.addChangeListener) {
      console.log("æ.object(): o.addChangeListener exists.", o);
    }
    /**
     * Registers a listener function for the property with the given name with 
     * the parameters (object, oldValue, newValue). Listeners get fired by the poperty setter methods or by 
     * o.fireChangeListeners(). 
     * 
     * @param {String} prop The property name
     * @param {Function} f The listener function, should have parameters (object, oldValue, newValue);
     * @returns {undefined}
     */
    o.addChangeListener = function (prop, f) {
      console.log("o.addChangeListener", prop, f);
      if (!listeners[prop]) {
        listeners[prop] = [];
      }
      listeners[prop].push(f);
    };

    /**
     * Get the array of listeners.
     * @returns {Array} The array of listeners.
     */
    o.getChangeListeners = function () {
      return listeners;
    };

    /**
     * Remove all change listeners from the object.
     * @returns {undefined}
     */
    o.clearChangeListeners = function () {
      listeners = {};
      listeners.size = function () {
        var s = 0;
        var names = Object.getOwnPropertyNames(listeners);
        for (var i in names) {
          if (names[i] !== 'length' && names[i] !== 'size') {
            s++;
          }
        }
        return s;
      };
    };


    /**
     * A convenience method for firing <i>all</i> change listeners, e.g., for notifying observers of the current value.
     * @returns {undefined}
     */
    o.fireChangeListeners = function () {
      var names = Object.getOwnPropertyNames(listeners);
      for (var i in names) {
        if (names[i] !== 'length' && names[i] !== 'size') {
          if (listeners[names[i]].length) {
            for (var j = 0; j < listeners[names[i]].length; j++) {
              if (typeof listeners[names[i]][j] === 'function') {
                listeners[names[i]][j](o, o[names[i]], o[names[i]]);
              }
            }
          }
        }
      }
    };

    // Finally: go through properties and add listener for object properties
    // in order to migrate listeners when the object property gets replaced
    // as a whole.
    // ATTENTION! JS array are objects, too! So we need to exclude them explicitly!
    for (var prop2 in o) {
      if (typeof o[prop2] === 'object' && !Array.isArray(o[prop2])) {
        /*jshint loopfunc: true */
        console.log('æ.object(): add obj-mover listeners:', prop2, o);
        o.addChangeListener(prop2, function (theObj, oldValue, newValue) {
          console.log("changeListener", theObj, oldValue, newValue);
          if (!oldValue) {
            return;
          }
          if (oldValue === newValue) {
            return;
          }
          
          if (oldValue.getChangeListeners) {
            if (!newValue.addChangeListener) {
              me.object(newValue);
            }
//            console.log('æ.object(): add obj-mover listeners ...');
            var listeners = oldValue.getChangeListeners();
            for (var n in listeners) {
              if (n === 'size') {
                continue;
              }
              if (listeners[n].length) {
                for (var i = 0; i < listeners[n].length; i++) {
                  newValue.addChangeListener(n, listeners[n][i]);
                }
              }
            }
          }
        });
      }
    }
  }
  ;

  /**
   * Inner class for view instances - they wrap a DOM element and provide 
   * methods for loading new content into the element.
   * @constructs View
   * @param {type} name
   * @returns {ae-ultraslim.View} A new ae-ultraslim view instance.
   */
  var View = function (name) {
    /**
     * The controller for this view, may be undefined.
     */
    this.controller = undefined;
    this.init(name);
  };

  /**
   * Initialize the view handling. 
   * @param {type} name The view name
   * @returns {undefined}
   */
  View.prototype.init = function (name) {
    console.log('View.prototype.init');
    this.elementName = name;
    this.element = document.querySelector(this.elementName);
    if (this.element === undefined) {
      throw new Error('Element not found for selector: ' + name);
    }

    var view = this;
    /**
     * Template handler for views with model and controller, initializes the 
     * model object. 
     * 
     * @param {type} template The template text
     * @param {type} config The config object, may contain a controller with a model
     * @returns {undefined}
     */
    me.templates.onDone = function (template, config) {
//      console.log('me.templates.onDone', template, config);
      var model = (config && config.controller && config.controller.model) ? config.controller.model : undefined;
      if (model && typeof model === 'object') {
        me.object(model);
      }
      var control = (config && config.controller) ? config.controller : undefined;
      view.onLoad(template, model, control);
    };
  };

  /**
   * Display a view and optionally use a controller for the view - the 
   * controller is also responsible for providing the data model.
   *  
   * @param {String} fragmentURL
   * @param {Object} controller
   * @returns {undefined}
   */
  View.prototype.show = function (fragmentURL, controller) {
    console.log("View.prototype.show()", fragmentURL, controller, typeof controller);
    // old controller and unload required?
    if (this.controller && typeof this.controller.exit === 'function') {
      this.controller.exit(this.getEl());
    }
    this.controller = controller;

    if (controller && controller.model && typeof controller.model === 'object') {
      console.log('View.prototype.show with controller ', controller, controller.model);
      me.object(controller.model);
    }
    me.templates.load((controller) ? {url: fragmentURL, controller: controller} : fragmentURL);
  };

  /**
   * Default onLoad handler that the view uses for the template loader, has to 
   * take care of setting the content to the view and, if applied, rendering
   * model data into the content. Rendering model data is delegated to a 
   * separate method.
   * @param {String} t The template text
   * @param {Object} model Optional: data model for this view 
   * @param {Object} controller Optional: controller for this view 
   * @returns {undefined}
   */
  View.prototype.onLoad = function (t, model, controller) {
    console.log('View.prototype.onLoad', model, controller);
    if (model !== undefined) {
      t = this.render(t, model, controller);
    }
    if (t instanceof NodeList) {
      console.log('View.prototype.onLoad rendered NodeList');

      this.getEl().innerHTML = '';
      for (var i = 0; i < t.length; i++) {
        this.getEl().appendChild(t.item(i));
      }
    } else {
      console.log('View.prototype.onLoad rendered', typeof t);
      this.getEl().innerHTML = t;
      this.process(this.getEl(), model, controller);
    }
    if (controller && typeof controller.init === 'function') {
      controller.init(this.getEl());
    }
  };

  /**
   * Default view error handler, empty.
   * @param {type} e Event
   * @returns {undefined}
   */
  View.prototype.onError = function (e) {
    console.log('View.prototype.onError', e);
  };

  /**
   * Process a DOM element, i.e., find and evaluate attributes for the framework,
   * create bindings, etc.
   * 
   * @param {type} element A DOM element
   * @param {type} model The model to evaluate against or to bind to
   * @param {type} controller The controller to bind to
   * @returns {undefined}
   */
  View.prototype.process = function (element, model, controller) {
    console.log('View.prototype.process', element, model, controller);
    var view = this, attr;
    /**
     * Inner function for recursive processing.
     * @param {type} node
     * @returns {undefined}
     */
    var doProcess = function (node) {
      // process element nodes: 
      console.log("View.prototype.doProcess", node);
      if (node.nodeType === 1) {
        var parent = node.parentNode;
        for (var m = 0; m < node.attributes.length; m++) {
          attr = node.attributes.item(m);
          if (attr.value.indexOf(expPrefix) > -1) {
            attr.value = view.replace(attr.value, model);
          }
        }
        for (var j = 0; j < node.attributes.length; j++) {
          attr = node.attributes.item(j);

          // ae-repeat
          if (attr.name === attrPrefix + 'repeat') {
            console.log("View.prototype.doProcess repeat", attr.value);
            
            var modelObject = model;
            var data = undefined;
            if (attr.value.indexOf('.') > -1) {
              var modelObjectPath = attr.value.split('.');
              console.log("View.prototype.doProcess repeat modelObjectPath", modelObjectPath);
              for (var mopI = 0; mopI < modelObjectPath.length -1; mopI++) {
                var modelObjectPathSegment = modelObjectPath[mopI];
                console.log("View.prototype.doProcess repeat modelObjectPath[i]", modelObjectPathSegment);
                modelObject = modelObject[modelObjectPathSegment];
              }
              if (modelObject) {
                data = modelObject[modelObjectPath[modelObjectPath.length -1]];
              }
            } else {
              data = modelObject[attr.value];
            }
            
            if (data) {
              var newNodes = [];

              if (data.length > 0) {
                for (var k = 0; k < data.length; k++) {
                  var d = data[k];
                  var n = node.cloneNode(true);
                  n.attributes.removeNamedItem(attrPrefix + 'repeat');
                  n.setAttribute(attrPrefix + 'repeated', true);
                  view.process(n, d);
                  newNodes.push(n);
                }
                for (var l = 0; l < newNodes.length; l++) {
                  node.parentNode.insertBefore(newNodes[l], node);
                }
              } 

              // attach model listener
              /*jshint loopfunc: true */
              if (modelObject.addChangeListener) {
                modelObject.addChangeListener(attr.value, function (sender, oldValue, newData) {
                  console.log('model.onChange', node, sender, oldValue, newData);
                  var newNodes = [];

                  var i = 0;
                  while (i < parent.childNodes.length) {
                    if (parent.childNodes[i].attributes && parent.childNodes[i].attributes.getNamedItem(attrPrefix + 'repeated')) {
                      parent.removeChild(parent.childNodes[i]);
                    } else {
                      i++;
                    }
                  }
                  if (newData.length > 0) {
                    for (var k = 0; k < newData.length; k++) {
                      var d = newData[k];
                      var n = node.cloneNode(true);
                      n.attributes.removeNamedItem(attrPrefix + 'repeat');
                      n.setAttribute(attrPrefix + 'repeated', true);
                      view.process(n, d);
                      // TODO: Better insert the repeated children at the original position of the template node, 
                      // not just append them at the end!
                      parent.appendChild(n);
                    }
                  }
                });
              }
            } else {
              console.error("View.prototype.doProcess repeat: Model has no value named '"+ attr.value + "'", model);
            }

            // remove original "template" node
            node.parentNode.removeChild(node);

            // ae-click
          } else if (attr.name === attrPrefix + 'click') {
            node.onclick = view.createHandler(node, 'click', attr.value);

            // ae-dblclick
          } else if (attr.name === attrPrefix + 'dblclick') {
            node.ondblclick = view.createHandler(node, 'dblclick', attr.value);

          } else if (attr.name === attrPrefix + 'mousedown') {
            node.onmousedown = view.createHandler(node, 'mousedown', attr.value);

          } else if (attr.name === attrPrefix + 'mouseup') {
            node.onmouseup = view.createHandler(node, 'mouseup', attr.value);
            
            // ae-enabled
          } else if (attr.name === attrPrefix + 'enabled') {
            
            // 1.: Simple: direct binding to model property: 
            if (model[attr.value]) {
//              var data = model[attr.value];
              throw "Not supported: Binding 'enabled' to model property.";
              
            } else {
              console.log("ae-enabled", node, attr.value);
              var dis;
              if (typeof attr.value === "function") {
                console.log("ae-enabled", "function");
                dis = !(attr.value)();
              } else if (typeof attr.value === "string") {
                console.log("ae-enabled", "string");
                if (attr.value.indexOf('model') === 0) {
                  var propNames = attr.value.split('.');
                  model.addChangeListener(propNames[1], function (sender, oldValue, newData) {
                    console.log("ae-enabled", 'model.onChange', node, sender, oldValue, newData);
                    node.disabled = (model[propNames[1]] === undefined);
                    console.log("ae-enabled", "model changed", node.disabled);
                  });
                  dis = (model[propNames[1]] === undefined);
                }
              } else {
                console.log("ae-enabled", "eval");
                dis = !eval(attr.value);
              }
              
              console.log("ae-enabled", dis);
              node.disabled = dis;
            }
            
            
            // ae-bind
          } else if (attr.name === attrPrefix + 'bind') {
            console.log(attrPrefix + 'bind', attr.value);
            var fqPropName = attr.value;
//            node.attributes.removeNamedItem(attrPrefix + 'bind');
            var propValue = new Function("console.log(" + fqPropName+"); return " + fqPropName).call(view);
            console.log(attrPrefix + 'bind', propValue);
            if (node.type === 'checkbox') {
              node.checked = propValue;
            } else {
              node.value = propValue;
            }

            if (fqPropName.lastIndexOf('.') > 0) {
              var name = fqPropName.substr(0, fqPropName.lastIndexOf('.'));
              console.log('name: ', name);
              var propOwner = new Function("return " + name).call(view);
              /*jshint loopfunc: true */
              node.onchange = function (event) {
                console.log('onchange on bound control: ', node, event);
                if (node.type === 'checkbox') {
                  propOwner[fqPropName.substr(fqPropName.lastIndexOf('.') + 1)] = (node.checked === true);
                } else {
                  propOwner[fqPropName.substr(fqPropName.lastIndexOf('.') + 1)] = node.value;
                }
                console.log('onchange on bound control: ', propOwner);
              };
            }

            view.createListener(fqPropName, node);

            // ae-model
          } else if (attr.name === attrPrefix + 'model') {
            console.log(attrPrefix + 'model', attr.value);
            var textContent = "";
            try {
              textContent = new Function("return " + attr.value).call(view);
            } catch (e) {
              console.log(attrPrefix + 'model', attr.value, e);
            }
            node.textContent = textContent;
            view.createTextBinding(attr.value, node);
          }
        }
      }
      // process text nodes: 
      if (node.nodeType === 3) {
        if (node.nodeValue.indexOf(expPrefix) > -1) {
          var t = view.replace(node.nodeValue, model);
          if (t.indexOf('<p>') > -1 || t.indexOf('<i>') > -1 || t.indexOf('<strong>') > -1 || t.indexOf('<br>') > -1 || t.indexOf('<div>') > -1 || t.indexOf('<h1>') > -1 || t.indexOf('<h2>') > -1 || t.indexOf('<h3>') > -1 || t.indexOf('<h4>') > -1 || t.indexOf('<h5>') > -1 || t.indexOf('<h6>') > -1) {
            var e = document.createElement("span");
            e.innerHTML = t;
            node.replaceWith(e);
          } else {
            node.nodeValue = t;
          }
        }
      }
      for (var i = 0; i < node.childNodes.length; i++) {
        doProcess(node.childNodes.item(i));
      }
    };

    if (element instanceof NodeList) {
      for (var i = 0; i < element.length; i++) {
        doProcess(element.item(i));
      }
    } else if (element instanceof Node) {
      doProcess(element);
    } else {
      throw new Error('Element must be a DOM Node or NodeList instance.');
    }
  };

  /**
   * Factory for event handlers, creates a closure for JS event handling code, 
   * or, if code is a controller method name, returns the reference to the 
   * controller method directly.
   * @param {DOMNode} node The DOM node
   * @param {string} event The event name
   * @param {string} code The code to execute
   * @returns {Function} The event handler function
   */
  View.prototype.createHandler = function (node, event, code) {
    var me = this;
    console.log('View.prototype.createHandler', me, node.id, event, code);
    var regex = new RegExp('[(].*[)]');
    if (code.toLowerCase().startsWith('this.controller.') && !regex.test(code)) {
      return function (e) {
//        e.preventDefault();
//        e.stopPropagation();
        var f = eval(code.replace('this.controller', 'me.controller'));
        f.call(me.controller, e);
      };
    } else {
      return function (e) {
        console.log('View.prototype.createHandler function', me, node, event);
        if (event === 'click' || event === 'dblclick') {
//          e.preventDefault();
//          e.stopPropagation();
        }
        var f = new Function(code);
        f.call(me, e);
      };
    }
  };

  /**
   * Try to find the object of the given property (fully qualified name necessary)
   * and, if it supports change listeners (see æ.object()), then add a 
   * changeListener, that sets the controls value to the value of the 
   * property. 
   * 
   * @param {string} fqPropName The fully qualified property name
   * @param {DOMNode} control The control, must be an input element.
   * @returns {undefined}
   */
  View.prototype.createListener = function (fqPropName, control) {
    var view = this;
    console.log('View.prototype.createListener', fqPropName, control);
    if (fqPropName.lastIndexOf('.') > 0) {
      var oName = fqPropName.substr(0, fqPropName.lastIndexOf('.'));
      var propName = fqPropName.substr(fqPropName.lastIndexOf('.') + 1);
      console.log('names: ', 'Object=' + oName, 'Prop=' + propName);

      var o = new Function("return " + oName).call(view);
      console.log('Object', o);

      if (o && o.addChangeListener && o.addChangeListener instanceof Function) {
        o.addChangeListener(propName, function (sender, oldValue, newValue) {
          console.log('View.prototype.createListener.onChange ', sender, oldValue, newValue, control.type);
          if (control.type === 'checkbox') {
            control.checked = (newValue);
          } else {
            control.value = newValue;
          }
        });
      }

      // do we need a listener on the parent object? yes, if parent is not controller
      if (oName.lastIndexOf('.') > 0 && oName !== 'this.controller' && oName !== 'this.controller.model') {
        var parentName = oName.substr(0, oName.lastIndexOf('.'));
        var parent = new Function('return ' + parentName).call(view);

        if (parent && parent.addChangeListener && parent.addChangeListener instanceof Function) {
          var parentPropName = oName.substr(oName.lastIndexOf('.') + 1);
          parent.addChangeListener(parentPropName, function (sender, oldValue, newValue) {
            if (newValue) {
              if (control.type === 'checkbox') {
                control.checked = newValue[propName];
              } else {
                control.value = newValue[propName];
              }
            } else {
              control.value = null;
            }
            control.onchange = function () {
              if (control.type === 'checkbox') {
                newValue[propName] = control.checked;
              } else {
                newValue[propName] = control.value;
              }
            };
          });
        }
      }
    }
  };

  View.prototype.createTextBinding = function (fqPropName, textnode) {
    var view = this;
    console.log('View.prototype.createTextBinding', fqPropName, textnode);
    if (fqPropName.lastIndexOf('.') > 0) {
      var oName = fqPropName.substr(0, fqPropName.lastIndexOf('.'));
      var propName = fqPropName.substr(fqPropName.lastIndexOf('.') + 1);
      console.log('names: ', 'Object=' + oName, 'Prop=' + propName);

      var o = new Function("return " + oName).call(view);
      console.log('Object', o);

      if (o && o.addChangeListener && o.addChangeListener instanceof Function) {
        o.addChangeListener(propName, function (sender, oldValue, newValue) {
          console.log('View.prototype.createTextBinding.onChange ', sender, oldValue, newValue);
          textnode.textContent = newValue;
        });
      }

      // do we need a listener on the parent object? yes, if parent is not controller
      if (oName.lastIndexOf('.') > 0 && oName !== 'this.controller' && oName !== 'this.controller.model') {
        var parentName = oName.substr(0, oName.lastIndexOf('.'));
        var parent = new Function('return ' + parentName).call(view);

        if (parent && parent.addChangeListener && parent.addChangeListener instanceof Function) {
          var parentPropName = oName.substr(oName.lastIndexOf('.') + 1);
          parent.addChangeListener(parentPropName, function (sender, oldValue, newValue) {
            if (newValue) {
              textnode.textContent = newValue[propName];
            } else {
              textnode.textContent = '';
            }
          });
        }
      }
    }
  };


  View.prototype.filter = function (type, t) {
    console.log("FILTER", type, t);
    switch (type) {
      case "Date":
        if (!t || (t.trim && t.trim() === '')) {
          return '';
        }
        var date = new Date();
        date.setTime(t);
        return date.toLocaleDateString('de-DE');

      default:
        if (this.controller.hasOwnProperty(type) && this.controller[type] instanceof Function) {
          return this.controller[type](t);
        } else {
          return t;
        }
    }
  };

  /**
   * Render model data into the template: 
   * - if there is no model: process the template with an emtpy dummy,
   * - if there is a model but there are no directivess: just set the model
   * - else (model and directives): process template, i.e. apply bindings etc.
   * 
   * @param {String} template
   * @param {Object} model
   * @param {Object} controller Optional controller object
   * @returns {String|DOMNodeList}
   */
  View.prototype.render = function (template, model, controller) {
    console.log('View.prototype.render', model, controller);
    // if no model: just return template:
    if (!model) {
      console.log('View.prototype.render 1');
      return this.replace(template, {});
    }

    if (template.indexOf(attrPrefix) > -1) {
      console.log('View.prototype.render 3');
      if (template.indexOf(expPrefix) > -1) {
        console.log('View.prototype.render 3.1');
        template = this.replace(template, model);
      }
      var el = document.createElement('DIV');
      el.innerHTML = template;
      this.process(el, model, controller);
      return el.childNodes;
    }

    // if no directives: only apply model data
    if (template.indexOf(attrPrefix) === -1) {
      console.log('View.prototype.render 2');
      if (template.indexOf(expPrefix) > -1) {
        console.log('View.prototype.render 2.1');
        template = this.replace(template, model, false);
      }
      return template;
    }
  };

  /**
   * String templating for object data, replaces all {{...}}
   * placeholders with the values of corresponding properties of the model 
   * object.
   * @param {String} template
   * @param {Object} model
   * @param {boolean} doCreateResponsiveElement
   * @returns {String} The template string with replaced placeholders.
   */
  View.prototype.replace = function (template, model, doCreateResponsiveElement) {
    if (template.trim() === '') {
      return template;
    }
    console.log('REPLACE', template, model, doCreateResponsiveElement);
//    console.log('REPLACE', model, doCreateResponsiveElement);
    var s = template;
    var placeholders = template.match(/(\{{.+?\}})/g);
    if (placeholders && placeholders.length > 0) {
      for (var i = 0; i < placeholders.length; i++) {
        var placeholder = placeholders[i];
        var prop = placeholder.substr(2, placeholder.length - 4);
        var filter = undefined;
        if (prop.indexOf('|') > -1) {
          prop = prop.substr(0, prop.indexOf('|'));
          filter = placeholder.substr(placeholder.indexOf('|') + 1, placeholder.length - 3 - placeholder.indexOf('|'));
        }
        console.log('REPLACE >', placeholder, prop, filter);

        var t = '';
        if (model.hasOwnProperty(prop)) {
          t = (model[prop]) ? model[prop] : '';
          if (filter) {
            t = this.filter(filter, t);
          }
          s = s.replace(placeholder, (doCreateResponsiveElement === true) ? '<span ae-model="' + prop + '">' + t + '</span>' : t);
          console.log('REPLACE a', t);
        } else if (prop.indexOf('.') > -1) {
          t = new Function('try { return this.' + prop + '; } catch (ex) { return "{{' + prop + '}}";} ').call(model);
          s = s.replace(placeholder, t);
          console.log('REPLACE b', t);
        } else {
          // At present, placeholders that could not be resolved cannot be deleted.
//          s = s.replace(placeholder, '*'+ t + '*');
          console.log('REPLACE c', placeholder, prop, model);
        }
      }
    }
    return s;
  };

  /**
   * Convenience method for querying the view's DOM element.
   * @returns {Element} The view element.
   */
  View.prototype.getEl = function () {
    this.element = document.querySelector(this.elementName);
    if (this.element === undefined) {
      throw new Error('Element not found for selector: ' + name);
    }
    return this.element;
  };
  /**
   * Register a DOM element as a view container, and create a View wrapper for 
   * it.
   * @function view
   * @memberOf æ
   * @param {type} name
   * @returns {ae-ultraslim.View}
   */
  this.view = function (name) {
    if (!views[name]) {
      console.log('CREATE VIEW ', name);
      views[name] = new View(name);
    }
    return views[name];
  };

  /**
   * Constructor for a ae-ultraslim router.
   * @constructs Router
   * @param {Object} config Configuration object.
   */
  var Router = function (config) {
    var me = this;
    this.root = config.root || null;
    this.useHash = config.useHash || false;
    this.routes = {};

    /**
     * The default route handler, gets called if no route match is found.
     */
    this.defaultHandler = undefined;

    window.addEventListener('DOMContentLoaded', function () {
      me.init();
    });
  };

  /**
   * Register a default route handler that should be used for all routes that 
   * cannot get resolved. 
   * 
   * @memberOf Router
   * @param {function} handler
   * @returns {undefined}
   */
  Router.prototype.default = function (handler) {
    if (handler instanceof Function) {
      this.defaultHandler = handler;
    } else {
      throw new Error('The default route handler must be a function.');
    }
  };

  /**
   * Initial wiring of the router, scanning of the page.
   * 
   * @memberOf router
   * @returns {undefined}
   */
  Router.prototype.init = function () {
    console.log('Router.prototype.init');
    var me = this;
    window.onhashchange = function (event) {
      me.onhashchange.apply(me, [event]);
    };
    window.onload = function (event) {
      me.onhashchange.apply(me, [event]);
    };
  };

  /**
   * Register a route URL with a handler function. 
   * 
   * @memberOf router
   * @param {Sting} routeURL
   * @param {Function} handler
   * @returns {undefined}
   */
  Router.prototype.on = function (routeURL, handler) {
    console.log('Router.prototype.on', routeURL, handler);
    if (handler instanceof Function) {
      this.routes[routeURL] = handler;
    } else {
      throw new Error('Handler needs to be a function.');
    }
  };

  /**
   * Register a default error hander. It will get called if a route cannot be
   * resolved.
   * 
   * @param {Function} handler
   * @returns {undefined}
   */
  Router.prototype.onError = function (handler) {
    if (handler instanceof Function) {
      this.errorHandler = handler;
    } else {
      throw new Error('The default error handler must be a function.');
    }
  };

  /**
   * The router's handler for window.onload and window.onhashchange events.
   * @param {DOMEvent} event An OnLoad or OnHashChange event.
   * @returns {undefined}
   */
  Router.prototype.onhashchange = function (event) {
    console.log('Router.prototype.onhashchange', event);
    var href = window.location.href;
    var route = '';
    if (event.type === 'load') {
      if (href.indexOf('#') > 0) {
        route = href.substr(href.indexOf('#') + 1);
      }
    } else if (event.newURL.indexOf('#') > 0) {
      route = event.newURL.substr(event.newURL.indexOf('#') + 1);
    }
    console.log(route);
    this.navigate(route);
  };


  /**
   * Navigate to a route, i.e., try to lookup a handler and invoke it with 
   * eventually defined route parameters or jump the default route.
   * @param {String} routeURL
   * @returns {undefined}
   */
  Router.prototype.navigate = function (routeURL) {
    console.log('Router.prototype.navigate', routeURL);

    if (routeURL === '') {
      routeURL = '/';
    }
    var handler = this.routes[routeURL];
    var params;

    this.params = params;

    if (handler === undefined) {
      for (var route in this.routes) {
        // have params?
        if (route.indexOf(':') > 0) {
          var routeParts = route.split('/');
          var urlParts = routeURL.split('/');
          try {
            if (urlParts.length === routeParts.length) {
              params = {};
              this.params = params;
              for (var i = 0; i < routeParts.length; i++) {
                if (routeParts[i].charAt(0) === ':') {
                  params[routeParts[i].substr(1)] = urlParts[i];
                } else {
                  if (urlParts[i] !== routeParts[i]) {
                    params = undefined;
                    throw new Error('not matching!');
                  }
                }
              }
              handler = this.routes[route];
              break;
            }
          } catch (e) {
            continue;
          }
        }
      }
    }
    if (handler === undefined) {
      handler = this.defaultHandler;
    }
    if (handler === undefined) {
      if (this.errorHandler) {
        this.errorHandler({url: routeURL});
        return;
      } else {
        throw new Error('No handler for route: ' + routeURL);
      }
    }
    if (handler instanceof Function) {
      handler((params) ? {params: params} : undefined);
    } else {
      throw new Error('Handler is not a function.');
    }
  };

  /**
   * Create a new ultraslim.Router. 
   * @function router
   * @memberOf æ
   * @param {String} root The root URL, currently not used,
   * @param {Boolean} useHash Whether to use hashed URLs or not, currently not used.
   * @returns {Router} A new ae-ultraslim router instance.
   */
  this.router = function (root, useHash) {
    return new Router({
      root: root,
      useHash: useHash
    });
  };
}));