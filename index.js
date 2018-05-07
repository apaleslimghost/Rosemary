var toposort = require('toposort'),
    moment   = require('moment'),
    duration = require('parse-duration');

function concatMap(xs, f) {
	return xs.reduce(
		function(ys, x) { return ys.concat(f(x)); },
		[]
	);
}

function values(obj) {
	return Object.keys(obj).map(function(k) {
		return obj[k];
	});
}

function Task(name, length, deps) {
	this.name = name;
	this.length = moment.duration(duration(length));
	this.deps = deps;

	Task.instances[name] = this;
}

Task.instances = {};

Task.deps = function() {
	return concatMap(values(this.instances), function(task) {
		return task.depPairs();
	});
};

Task.sort = function() {
	return toposort(this.deps()).map(function(k) {
		return Task.instances[k];
	});
};

Task.deadline = function(time) {
	return this.sort().map(function(task) {
		return [
			time.subtract(task.length).clone(),
			task
		];
	});
};

Task.prototype.toString = function() {
	return this.name + '(' + this.length.humanize() + ')';
};

Task.prototype.depPairs = function() {
	return this.deps.map(function(dep) {
		return [this.name, dep];
	}, this);
};


new Task('boil', '10m', ['chop']);
new Task('chop', '5m', ['wash']);
new Task('wash', '1m', []);

console.log(Task.deadline(moment()));