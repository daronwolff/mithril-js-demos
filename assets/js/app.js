(function(){
	m.route.mode = "hash";

	//
	// Menu, nav from Json
	//
	var menuComponent = {
		options: m.prop([]),
		active:m.prop(0),
		controller: function() {
			var opt = m.request({
				method: "get",
				url: "/menu.json"
			}).then(menuComponent.options);
		},
		view: function() {
			var menu = this.options();
			return m("ul.actual-"+this.active(),[
				menu.map(function(x,y){
					return m("li",{ title: x.id, class: (menuComponent.active() == x.id )?"active":"" },[
						m("a",{href:x.href, id:x.id, onclick: m.withAttr("id",menuComponent.active) }, x.title)
					])
				})
			]);
		}
	};
	m.mount(document.getElementById("menu-horizontal"),menuComponent);

	// 
	// Simple home page
	// 
	var home = {
		view: function( controller ) {
			return m("h1.center.page-title", "Welcome, you are in home");
		}
	};

	//
	// Simple dashboard webpage
	//
	var dashboard = {
    	controller: function() {
        	return {id: m.route.param("userID")};
    	},
    	view: function(controller) {
        	return [ 
        		m("h1.page-title","Welcome to dashboard"), 
         	];
    	}
	};

	//
	// Song component
	//
	var song = {
		info: m.prop([]),
		controller: function() {
			var content = m.request({
				method: "get",
				url: "/contents.json"
			}).then(song.info)			
		},
		view: function() {
			var info = this.info()
			return [
				m("h1.center.page-title",info.title),
				m("h2.center",info.content)
			];
		}
	};

	//
	// Todo List
	//
	var todo = {};
	todo.Todo = function(data){
		this.description = m.prop(data.description);
		this.done = m.prop(false);
	};
	todo.TodoList = Array;

	todo.vm = (function() {
		var vm = {};
		vm.init = function() {
			vm.list = new todo.TodoList();
			vm.description = m.prop("");
			vm.add = function() {
				if(vm.description()) {
					console.log(vm.description());
					let ob = new todo.Todo({ description: vm.description() })
					vm.list.push(ob);
					vm.description("");
				}else{	
					alert("Enter a valid task")
				}
			}
		};
		return vm;
	}());

	todo.controller = function() {
		todo.vm.init();
	};

	todo.view = function() {
		return [
			m("h1.center.page-title","Task list"),
			m("div.container.todo",[
				m("input[type=text]",{ placeholder:"Enter the task", value: todo.vm.description(), onchange: todo.vm.description }),
				m("br"),
				m("a.btn.btn-success", { onclick: todo.vm.add } , "Add new")
			])
		];
	};

	//
	// Container
	//
	var container = document.getElementById("main");
	m.route(container,"/",{
		"/": home,
		"/dashboard": dashboard,
		"/song": song,
		"/todo":todo
	});
})();