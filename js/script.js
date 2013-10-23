!function(){
	
	function SubModel(){
		
	}

	function TodoList(type){
		this.type = type
		if(/grocer/i.test(type))
			this.items = Echo.observableArray([
				{title : 'Bananas'},
				{title : 'Apple juice'},
				{title : 'Orange'},
				{title : 'Yogurt'},
				{title : 'Bread'},
				{title : 'Eggs'},
				{title : 'Bacon'},
				{title : 'Soya milk'},
				{title : 'Pasta'}
			])
		else this.items = Echo.observableArray([])
		
	}
	TodoList.prototype = {
		constructor : TodoList,
		
		removeItem : function(closeButton, ulList){
			if($(closeButton).is('a.close'))
				this.items.remove(closeButton.parentNode)
		},
		
		updateList : function(form){
			var newTodoItem = {}
			$('input[type="text"]', form).each(function(){
				newTodoItem[this.name] = this.value
			})
			this.items.push(newTodoItem)
		},
		
		closeButton : function(li, li, e){
			$('a.close', li)[0].style.display = e.type === 'mouseout'? 'none' : 'block' 
		},
		
		render : function(){
			var xmlhttp, self = this
			if (window.XMLHttpRequest) {
		        xmlhttp = new XMLHttpRequest();
		    } else {
		        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		    }
		
		    xmlhttp.onreadystatechange = function() {
		        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		            var res = JSON.parse(xmlhttp.responseText)
		            self.items.concat(res)
		        }
		    }
		
		    xmlhttp.open("GET", "js/todos.json", true);
		    xmlhttp.send();
		},
		
		styleButton : function(button){
			button.style.color = 'red'
			return true
		},
		
		highlightClose : function(close, liItem, evt){
			console.log('mouse event')
			if(evt.type === 'mouseover')
				close.style.color = 'red'
			else 
				close.style.color = 'white'
		}
	}
	
	/*Echo.define('SubModel', SubModel)
	Echo.define('TodoList', function(SubModel){
		return TodoList
	})*/
	// on DOM ready
	Echo.bind(new TodoList('Groceries'), '#Todo1, .modelReport')
	Echo.bind(new TodoList('Todos'), '#Todo2, .modelReport')
	
	window.Person = {
		"firstName" : "Parag",
		"age" : "30",
		"hobbies" : Echo.observable("painting, guitaring")
	}
	Echo.bind(window.Person, '#Dummy')
}()

