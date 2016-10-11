function Box(w, h, d) {
	Entity.call(this);

	var geometry = new THREE.CubeGeometry( w, h, d );
	this.material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: true } );
	this.setMesh( new THREE.Mesh( geometry, this.material ) );

	// physics
	var x_ = new THREE.Vector3(w/2,0,0);
	var y_ = new THREE.Vector3(0,h/2,0);
	var z_ = new THREE.Vector3(0,0,d/2);
	var obb = new OBB(new THREE.Vector3(), new THREE.Quaternion(), x_, y_, z_);//

	var radius = x_.clone().add(y_).add(z_).length();
	var sphere = new Sphere(new THREE.Vector3(), radius+1);

	this.attachPhysics( new PhysicalObject({is_enabled: true, mass: 150, center_of_mass: new THREE.Vector3( 0, 0, 0 ), uniform_density: false, restitution: 0.2, friction: 0.4, collider:obb, sphere: sphere}) );
};

Box.prototype = Object.create(Entity.prototype);
Box.prototype.constructor = Box;
