/**
 * @author Anthony Chansavang / http://github.com/achansavang
 *
 *	This file handles initializations. Hook the components together.
 */

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	main_menu.center();
}

function initCamera() {
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.y = 20;
	camera.position.x = -20 * Math.sin( theta * Math.PI / 360 );
	camera.position.z = 40 * Math.cos( theta * Math.PI / 360 );
	// camera.position.y = 300;
	// camera.position.x = 500 * Math.sin( theta * Math.PI / 360 );
	// camera.position.z = 400 * Math.cos( theta * Math.PI / 360 );
	camera.useQuaternion = true;
	camera.lookAt( new THREE.Vector3( 0, 200, 0 ) );
}

function initScene() {
	// Lighting
	var ambientLight = new THREE.AmbientLight( Math.random() * 0x10 );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
	directionalLight.position.x = Math.random() - 0.5;
	directionalLight.position.y = Math.random() - 0.5;
	directionalLight.position.z = Math.random() - 0.5;
	directionalLight.position.normalize();
	scene.add( directionalLight );

	var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
	directionalLight.position.x = Math.random() - 0.5;
	directionalLight.position.y = Math.random() - 0.5;
	directionalLight.position.z = Math.random() - 0.5;
	directionalLight.position.normalize();
	scene.add( directionalLight );


	// Walls & ground
	
	world.add( new Wall(new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 0 ), 250, 250) );
	world.add( new Wall(new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( -125, 62.5, 0 ), 250, 125) );
	world.add( new Wall(new THREE.Vector3( -1, 0, 0 ), new THREE.Vector3( 125, 62.5, 0 ), 250, 125) );
	world.add( new Wall(new THREE.Vector3( 0, 0, 1 ), new THREE.Vector3( 0, 62.5, -125 ), 250, 125) );
	world.add( new Wall(new THREE.Vector3( 0, 0, -1 ), new THREE.Vector3( 0, 62.5, 125 ), 250, 125) );
	
	for(var i = 0; i < 30; i++)
	{
		world.addBox(0,10 + i * 30,i*4);
	}
	
	var q = (new THREE.Quaternion()).setFromAxisAngle(new THREE.Vector3( 1, 0, 0 ), Math.PI/10);
	var q2 = (new THREE.Quaternion()).setFromAxisAngle(new THREE.Vector3( 0, 1, 0 ), -Math.PI/6);
	q.multiply(q2);

	octree.update();
}
var s
function configureEvents() {
	window.addEventListener( 'resize', onWindowResize, false );

	function onWorldObjectCreated(event) {
		// event.object.addEventListener( 'physicsenabledchange', onEntityPhysicsEnabledChange);
		scene_manager.addEntity(event.object);
		// if(event.object._physicsEnabled)
		physics_engine.add(event.object.physics);

		event.object.addEventListener( 'entityposechanged', octree.onEntityPoseChanged );
	}
	
	function onWorldObjectDestroyed(event) {
		scene_manager.removeEntity(event.object);
		physics_engine.remove(event.object.physics);
	}

	world.addEventListener( 'worldobjectcreated', onWorldObjectCreated);
	world.addEventListener( 'worldobjectdestroyed', onWorldObjectDestroyed);
	/////////////////////////////////////

	octree.onEntityPoseChanged = function(event) {
		if(octree._to_update.indexOf(event.object.bounding_volume) === -1)
			octree._to_update.push(event.object.bounding_volume);
	}
}

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	//

	initMenu();

	initCamera();

	scene = new THREE.Scene();

	world = new BoxWorld();

	octree = new Octree(null, new THREE.Vector3(0,150,0), 150, 150, 150);

	scene_manager = new SceneManager(scene, octree);

	collision_detector = new CollisionDetector(octree);

	physics_engine = new PhysicsEngine({collision_detector: collision_detector, gravity: new THREE.Vector3( 0, -9.81*3, 0 ), handle_collisions: true});

	input_listener = new InputListener(container);

	controller = new Controller(input_listener, scene_manager, camera, world);

	scene_manager.init();

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	debug_viewer = new DebugViewer(scene_manager, physics_engine);
	debug_viewer.setVisible(true);
	debug_viewer.setOctreeVisible(false);

	container.appendChild(renderer.domElement);

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild( stats.domElement );

	//
	configureEvents();
	
	//

	initScene();
}

//
function animate() {

	var now = new Date();
	var timeSinceLastFrameMs = now.getTime() - last_date.getTime();

	requestAnimationFrame( animate );
	
	scene_manager.update();

	controller.update(timeSinceLastFrameMs / 1000);

	world.update();
// s.physics._velocity.set(0,-10,0);
	physics_engine.step(timeSinceLastFrameMs / 1000 );

	render();
	
	stats.update();

	camera.lookAt(new THREE.Vector3( ));

	last_date = new Date();
}

function render() {
	renderer.render( scene, camera );
}

var DEBUG = true;
var controller;
var container, stats;
var octree, scene_manager, input_listener, world, camera, scene, renderer, physics_engine, debug_viewer;
var plane;
var theta = 45, isShiftDown = false, isCtrlDown = false;

var ROLLOVERED;

var last_date = new Date();

var smore;

init();
animate();