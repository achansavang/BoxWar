function Controller(input_listener, scene_manager, camera, world) {

	// speed in unit/sec
	var camera_speed = 200;
	var mouse_sensitivity = 3;

	// used for camera motion
	var buf_vector = new THREE.Vector3(0, 0, 0);
	var mouse_down = false;
	var mouse2D = new THREE.Vector3(0,0,0);

	this.projector = new Projector();

	input_listener.useEventStack(true);

	function moveCamera(timeSinceLastFrameInSec) {

		buf_vector.set(0,0,0);
		var speed = camera_speed * timeSinceLastFrameInSec;

		// strife left
		if(input_listener.keyPressed[37])
		{	
			buf_vector.x += speed;
		}

		// forward
		if(input_listener.keyPressed[38])
		{
			buf_vector.z += speed;
		}

		// backward
		if(input_listener.keyPressed[40])
		{
			buf_vector.z += -speed;
		}

		// strife right
		if(input_listener.keyPressed[39])
		{
			buf_vector.x += - speed;
		}

		if(input_listener.keyPressed[33])
		{
			buf_vector.y += -speed;
		}

		if(input_listener.keyPressed[34])
		{
			buf_vector.y += speed;
		}

		camera.position.sub(buf_vector.applyQuaternion(camera.quaternion));
	};

	var objects_cache;
	this.update = function(timeSinceLastFrameInSec) {
		moveCamera(timeSinceLastFrameInSec);

		var stack = input_listener.event_stack;

		// look for the last click
		while(stack.length !== 0)
		{
			var evt = stack.pop();

			var mouse3D = new THREE.Vector3(0,0,0);

			var mouse2D = input_listener.current_mouse_position.clone();

			raycaster = this.projector.pickingRay( mouse2D, camera );

			var obj = scene_manager.pick( raycaster );

			if(obj !== undefined)
			{
				var dir = raycaster.ray.direction.clone();

				if(evt.type === 'mousedown')
				{
					// world.removeBox(obj);
					obj.physics.applyForce( dir.multiplyScalar(3000000) );
				}

				// var mat = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: true } );

				// if(objects_cache !== undefined)
				// {
				// 	for(var i = 0; i < objects_cache.length; i++)
				// 	{
				// 		if(!(objects_cache[i] instanceof Plane))
				// 			scene_manager.census[objects_cache[i]._id]._mesh.setMaterial(mat);
				// 	}
				// }

				// var objects = scene_manager.findObjectsNear(obj._id);
				// mat = new THREE.MeshLambertMaterial( { color: 0xFF0000, shading: THREE.FlatShading, overdraw: true } );
				// for(var i = 0; i < objects.length; i++)
				// {
				// 	if(!(objects[i] instanceof Plane))
				// 		scene_manager.census[objects[i]._id]._mesh.setMaterial(mat);
				// }

				// objects_cache = objects;

				break;
			}
		}

		input_listener.emptyEventStack();
	};

}

Controller.prototype.constructor = Controller;