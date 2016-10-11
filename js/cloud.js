function Cloud(type, color) {

	Entity.call(this);

	this.type = type == undefined ? '' : type;
	this.color = color == undefined ? 0x000000 : color;
	
	if(!this.textureLoaded)
	{
		SceneManager.img_loader.addEventListener( 'load', this.onLoadImg );
		SceneManager.img_loader.load( this.texture_path );
	}
	this.material = new THREE.MeshBasicMaterial( { map: this.texture, overdraw: true } );
	this.setMesh( new THREE.Mesh( this.geometry, this.material ) );

	// physics
	var obb = OBB.prototype.createOBB(this._mesh.geometry.vertices);
	this.attachPhysics( new PhysicalObject({ collider: obb}) );
	this.physics.setOBB(obb);
	this.physics.bind(this);
	
}

Cloud.prototype = Object.create( Entity.prototype );
Cloud.prototype.constructor = Cloud;

Cloud.prototype.geometry = new THREE.CubeGeometry( 10, 10, 10 );
Cloud.prototype.texture = new THREE.Texture();
Cloud.prototype.texture_path = local+'assets/textures/lavatile.jpg';
Cloud.prototype.textureLoaded = false;	// not sure if it is necessary

Cloud.prototype.onLoadImg = function(event) {
	var _this = Cloud.prototype;
	_this.texture.image = event.content;
	_this.texture.needsUpdate = true;
	SceneManager.img_loader.removeEventListener( 'load', this.onLoadImg );
	_this.textureLoaded = true;
}

function GotoCloud() {
	Cloud.call(this, 'goto', 0x0B8F10);
}

GotoCloud.prototype = Object.create(Cloud.prototype);
GotoCloud.prototype.constructor = GotoCloud;

