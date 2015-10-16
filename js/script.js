var TabModel = Backbone.Model.extend({
	defaults: {
		name: "tab unamed"
	}
});

var TabCollection = Backbone.Collection.extend({
	model: TabModel
});

var TabViewHead = Backbone.View.extend({
	tagName: "li",
	className: "tab_item",
	events: {
		"click" : "clickTab"
	},
	initialize: function() {
		this.listenTo(this.model, "change", this.render);
	},
	clickTab: function() {
		this.model.collection.forEach(function(model) {
			model.set("visible", false);
		});
		this.model.set("visible", true);
	},
	template: _.template($("#tab_template").html()),
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		(this.model.get("visible")) ? this.$el.addClass("active") : this.$el.removeClass("active");
		return this;
	}
});
var TabViewContent = Backbone.View.extend({
	className: "content_item",
	template: _.template($("#tab_content").html()),
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

var TabsViewContent = Backbone.View.extend({
	el:".tabs_content",
	initialize: function() {
		this.listenTo(this.collection, "change", this.render);
		this.render();
	},
	render: function() {
		this.$el.empty();
		_.each(this.collection.models, this.renderItem, this);
	},
	renderItem: function(model) {
		var itemView = new TabViewContent({model:model}).render().$el;
		(model.get("visible")) ? itemView.addClass("visible") : itemView.addClass("hidden");
		this.$el.append(itemView[0]);
	}
});

var TabsViewHead = Backbone.View.extend({
	el: ".tabs",
	initialize: function() {
		this.render();
	},
	render: function() {
		_.each(this.collection.models, this.renderItem, this);
	},
	renderItem: function(model) {
		var itemView = new TabViewHead({model:model});
		this.$el.append(itemView.render().el);
	}
});
var collection = new TabCollection([
	{name: "tab 1", content: "content tab 1", visible: true},
	{name: "tab 2", content: "content tab 2", visible: false},
	{name: "tab 3", content: "content tab 3", visible: false}
]);

var tabs = new TabsViewHead({
	collection: collection
});
var contents = new TabsViewContent({
	collection: collection
});