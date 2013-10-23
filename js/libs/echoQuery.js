/**
 * @desc This is just a DOM engine like jQuery or Zepto. It has all the basic methods needed to run Echoapp internally. You can easily replace this with jQuery or your favorite DOM library if you need more than the basic methods
 * @dependencies None
 */
!function(){
	// ================================================================================
	// Private
	var ARRAY = '[object Array]',
		OBJECT = '[object Object]',
		STRING = '[object String]',
		FUNCTION = '[object Function]'
	var _slice = Array.prototype.slice
	var _noop = function(){};
	var _typeof = function(item){ return Object.prototype.toString.call(item) }
	var _extend = function(destination, source){
		for (var prop in source)
		    if (source[prop] && source[prop].constructor && source[prop].constructor === Object) {
		      	destination[prop] = destination[prop] || {};
		     	arguments.callee(destination[prop], source[prop]);
		    } else
		      	destination[prop] = source[prop];
	  return destination;
	}
	var _nativeBind = Function.prototype.bind
	
	var _takeout = function extract(array, from, to) {
		if (!isNaN(from)) {
			var rest = array.slice((to || from) + 1 || array.length),
				new_len = from < 0 ? array.length + from : from,
				removed = array[new_len];
			array.length = new_len;
			array.push.apply(array, rest);
			return removed;
		} else return extract.call(array, array, array.indexOf(from));
	}
	
	var _matches = 'matchesSelector' in document.body? 'matchesSelector' : 'webkitMatchesSelector'
	
	
	
	
	
	
	
	
	var _domStore = { // Does some internal dom event-storage/cleanup operations
        gid: 1,
        _create : function(id){
        	this[id] = this[id] || {}
        	return id 
        },
        cleanUp: function(elem) {
            if (elem.nodeType === 1) for (var i = 0, nodes = elem.getElementsByTagName("*"), l = nodes.length; i < l && this.destroy(nodes[i]); i++) {}
        },
        destroy: function(el) {
            if (el) delete this[el._ec_];
            return el;
        },
        clid: function(el, bool) {
            return (bool)? el._ec_ : this._create(el._ec_ || (el._ec_ = ++this.gid));
        }
    }
    
    var _ik = [ 'after', 'prepend', 'before', 'append' ]
    var _createEvent = function(type, props) {
		var event = document.createEvent(special_events[type] || 'Events');
		if (props)
			_.extend(event, props);
		event.initEvent(type, !(props && props.bubbles === false), true, null, null, null, null, null, null, null, null, null, null, null, null);
		return event;
	};
	
	/**
         * @desc Creates DOM from html-string or nodelist and appends to a context
         * @param String/Nodelist containing html or selector(s)
         * @param String context within which to append the html fragment
         * @param String key
         * @return Nodelist
         */
     var _createDOM = function(html /* String or HTMLCollection/Nodelist */ , context /* DOM Element or Nodelist/HTMLCollection or App.dom object */ , key) {
        if (!html) return [];
        var container = document.createElement("DIV"),
            // Create a 'div' element if html is string
            fragment = context ? document.createDocumentFragment() : undefined,
            // create a doc fragment if context is available
            nodes;
        if (key) var key_num = _ik.indexOf(key); // this is optional for the DOM insertion functions e.g append, prepend etc
        nodes = _slice.call(_typeof(html) !== STRING ? !('length' in html) ? [html] : html : (function() {
            container.innerHTML = html;
            return container.childNodes;
        })()); // Append in the created 'div' and get all the childnodes
        nodes.forEach(function(node) {
            if (node.nodeName.toUpperCase() === 'SCRIPT' && (!node.getAttribute('type') || node.getAttribute('type').indexOf('javascript') > -1)) window['eval'].call(window, node.innerHTML); // ... if its a script, evaluate it
            if (fragment) fragment.appendChild(node); // If fragment is created, append the node in the fragment
        });

        //TODO check this block of code for performance
        context && (context.nodeName ? _insert(context, fragment, key_num) : _.each(context, function(parent) {
            _insert(parent, fragment.cloneNode(true), key_num);
        }));
        return nodes; //Nodelist
    };
    
    var _insert = function(context, nodes, k) {
            var parent = (!k || k == 3) ? context : context.parentNode;
            parent.insertBefore(nodes, !k ? parent.firstChild : // prepend
            k == 1 ? context.nextSibling : // after
            k == 2 ? context : // before
            null); // append
        }
    
    
    
    
    
    
    
    
    
	if (!Array.prototype.forEach) {
	    Array.prototype.forEach = function (fn, scope) {
	        'use strict';
	        var i, len;
	        for (i = 0, len = this.length; i < len; ++i) {
	            if (i in this) {
	                fn.call(scope, this[i], i, this);
	            }
	        }
	    };
	}
	
	var _each = function(obj, fn, scope){
		if(_typeof(obj) === OBJECT)
			for(var key in obj){
				fn.call(scope || obj, obj[key], key, obj)
			}
		else if(_typeof(obj) === ARRAY) return obj.forEach(fn, scope) 
	}
    
    
    
    
    
    
    
    
    
	var special_events = {};
  	special_events.click = special_events.mousedown = special_events.mouseup = special_events.mousemove = 'MouseEvents';
  	
  	var storeListener = function(elem, evt, fn) {
			var id = _domStore.clid(elem),
				t = _domStore[id]._cb =  _domStore[id]._cb || {},
				a = t[evt] = t[evt] || [];
			a[a.length] = fn;
			return fn;
		};
		
	var _createMethod = function(prop, context){
		return function(data){
			var ret
			this.each(function(){
				if(typeof data === 'undefined') ret = (context || this)[prop]
				else (context || this)[prop] = $.isFunction(data)? data() : data
			})
			return typeof data === 'undefined'? ret : this
		}
	}
	
	
	
	
	
	
	
	
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	/* DOM engine */
	window.$ = function(sel, context){
		return new $.prototype._init(sel, context)
	}
	
	$.prototype = {
		constructor : $,
		
		_init : function(sel, context){
			var frag;
			if(/<([\w:]+)/.test(sel) || typeof sel === 'undefined'){
				frag = document.createDocumentFragment()
				frag.appendChild(document.createElement('DIV'))
			}
			var self = this
			//self.sel = sel || 'div'
			self.parent = context || document
			var nodes = frag? _slice.call(frag.children) : _typeof(sel) === STRING? _slice.call(self.parent.querySelectorAll(sel)) : 'nodeName' in sel?  [sel] : _slice.call(sel)
			nodes.forEach(function(node, idx){
				self[idx] = node
			})
			self.length = nodes.length
		},
		
		on : function(evtName, handler){
			this.each(function(){
				this.addEventListener(evtName, storeListener(this, evtName, handler), false)
			})
			return this
		},
		
		off : function(evtName, handler){
			var callbacks, handler, noparams = arguments.length === 0;
			return this.each(function() {
				var el = this, id = _domStore.clid(el, true), listener_obj = (id in _domStore)? _domStore[id]._cb : null;
				if (listener_obj) {
					if (noparams) {
						_domStore.destroy(el);
						_each(listener_obj, function(callback, e) {
							while ( handler = callback.pop()) {
								el.removeEventListener(e, handler, false);
							}
							delete listener_obj[e];
						});
					} else {
						if (callback) {
							_takeout(listener_obj[evt], listener_obj[evt].indexOf(callback))
							el.removeEventListener(evt, callback, false);
						} else {
							while ( handler = listener_obj[evt].pop()) {
								el.removeEventListener(evt, handler, false);
							}
							delete listener_obj[evt];
						}
					}
				}
			});
		},
		
		trigger : function(evt, /* Array */data){
			if (this.length === 0)
				return this
			if ( typeof evt == 'string')
				evt = _createEvent(evt);
			evt.data = data;
			return this.each(function() {
				console.log('dispatching ' + evt.type);
				this.dispatchEvent(evt);
				return true;
			});
		},
		
		html : _createMethod('innerHTML'),
		
		each : function(fn){
			for(var i = 0, l = this.length; i < l && fn.call(this[i], this[i], i, this) !== false; i++){}
			return this
		},
		
		val : _createMethod('value'),
		
		data : function(key, val){
			var ret;
			this.each(function(){
				var id = _domStore.clid(this), data = _domStore[id]._data
				if(typeof val === 'undefined') ret = typeof key === 'undefined'? data : (data && data[key] || data) 
				else {
					if(typeof key === 'undefined') throw new TypeError
					else {
						if(!('_data' in _domStore[id])) _domStore[id]._data = {}
						_domStore[id]._data[key] = val
					}
				}
			})
			return ret
		},
		
		closest : function(sel){
			if(!sel) return $(document.body)
			var res = []
			this.each(function(node, i, echoQueryObj){
				var element = this, parent = element.parentNode
				while(_matches in parent && !parent[_matches](sel)) {
				    //display, log or do what you want with element
				    parent = parent.parentNode;
				}
				if(parent !== document) res[i] = parent
			})
			return $(res)
		},
		
		children : function(){
			var res = []
			this.each(function(){
				res = res.concat(_slice.call(this.children))
			})
			return $(res)
		},
		
		remove : function(){
			return this.each(function(){
				var id = _domStore.clid(this)
				$(this).off()
				delete _domStore[id]
				this.parentNode.removeChild(this)
			})
		},
		
		is : function(sel){
			var node = this[0]
			return node[_matches](sel)
		}
	}
	
	$.prototype._init.prototype = $.prototype
	
	
	_ik.forEach(function(operator) {
        $.prototype[operator] = function(expression) {
            return this.each(function() {
                _createDOM(expression, this, operator);
            });
        };
    });
	/* DOM engine */
	// ================================================================
	
	$.extend = _extend
	$.isFunction = function(data){ return _typeof(data) === FUNCTION }
	$.isArray = function(data){ return _typeof(data) === ARRAY }
	$.isPlainObject = function(data){ return _typeof(data) === OBJECT }
	$.each = function(obj, fn){
		if(_typeof(obj) === OBJECT && !('length' in obj))
			for(var key in obj)
				fn.call(obj, obj[key], key, obj)
		else
			for(var i = 0, l = obj.length; i < l && fn.call(obj, obj[i], i, obj) !== false; i++){}
		return obj	
	}
	$.proxy = function(func, context){
		var args, bound;
	    if (_nativeBind && func.bind === _nativeBind) return _nativeBind.apply(func, _slice.call(arguments, 1));
	    if (!$.isFunction(func)) throw new TypeError;
	    args = _slice.call(arguments, 2);
	    return bound = function() {
	      if (!(this instanceof bound)) return func.apply(context, args.concat(_slice.call(arguments)));
	      _noop.prototype = func.prototype;
	      var self = new _noop;
	      _noop.prototype = null;
	      var result = func.apply(self, args.concat(_slice.call(arguments)));
	      if (Object(result) === result) return result;
	      return self;
	    };
	}
	
}()