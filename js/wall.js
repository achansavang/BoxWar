function Wall(normal, point, w, h) {
	Entity.call(this);
	

	if(!this.textureLoaded)
	{
		SceneManager.img_loader.addEventListener( 'load', this.onLoadImg );
		SceneManager.img_loader.load( this.texture_path );
	}
	var material = new THREE.MeshBasicMaterial( { map: this.texture, overdraw: true } );
	var geometry = new THREE.PlaneGeometry( w, h );
	var mesh = new THREE.Mesh( geometry, material );
	this.setMesh( mesh );

	var q = (new THREE.Vector3( 0, 0, 1 )).getQuatRotationTo(normal);
	this.setOrientation(q.x, q.y, q.z, q.w);
	this.setPosition(point.x, point.y, point.z);

	var constant = - point.dot( normal );
	// physics
	this.attachPhysics( new PhysicalObject({mode: physics_mode.STATIC, mass: Infinity, collidable: true, restitution: 0.5, friction:0.7, collider: new Plane(normal, constant, w, h)}) );
};

Wall.prototype = Object.create(Entity.prototype);
Wall.prototype.constructor = Wall;

// Wall.prototype.geometry = new THREE.CubeGeometry( 50, 50, 50 );
Wall.prototype.texture = new THREE.Texture();
Wall.prototype.texture_path = local+'/assets/textures/tile.jpg';
Wall.prototype.textureLoaded = false;	// not sure if it is necessary

Wall.prototype.onLoadImg = function(event) {
	var _this = Wall.prototype;
	_this.texture.image = event.content;
	_this.texture.needsUpdate = true;
	SceneManager.img_loader.removeEventListener( 'load', this.onLoadImg );
	_this.textureLoaded = true;
}
