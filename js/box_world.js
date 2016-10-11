function BoxWorld() {
	World.call(this);
	
	var boxes = new Array();
	var clouds = new Array();

	this.add = function(obj) {
		this.sendObjectCreatedEvent( obj );
	};

	this.addBox = function(x,y,z) {
		box = new Box(10,10,10);
		boxes.push(box);
		box.setPosition(x,y,z);

		this.sendObjectCreatedEvent( box );

		return box;
	};

	this.removeBox = function(box) {
		var idx = boxes.indexOf(box);
		if(idx !== -1)
		{
			boxes[idx].destroy();
			boxes.splice( idx, 1 );
			this.sendObjectDestroyedEvent( box );
		}
	};

	this.update = function() {
	};
}

BoxWorld.prototype = Object.create(World.prototype);
BoxWorld.prototype.constructor = BoxWorld;
