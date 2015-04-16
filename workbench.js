function deg2rad(angle) { return (angle / 180) * Math.PI };

/**
 * Init
 */

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50,
		window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//
//var geometry = new THREE.BoxGeometry(1, 1, 1);
//var geometry = new THREE.BoxGeometry(1, 1, 1);
//var material = new THREE.MeshBasicMaterial({
//	color : 0x00ff00,
//	wireframe : true,
//});
//var cube = new THREE.Mesh(geometry, material);
//// scene.add(cube);

camera.position.z = 5;

// Moon "cube"

/**
 * The Moon differs from most satellites of other planets in that its orbit is
 * close to the plane of the ecliptic, and not to the Earth's equatorial plane.
 * 
 * The plane of the lunar orbit is inclined to the ecliptic by about 5.1°,
 * whereas the Moon's spin axis is inclined by only 1.5°.
 */

var material = new THREE.MeshBasicMaterial({
color : 0x00ff00,
wireframe : true,
});

var cube = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32),
		material);
cube.rotation.z = deg2rad(23);  
scene.add(cube)

var curve = new THREE.QuadraticBezierCurve(
	new THREE.Vector3( -1, 0, 0 ),
	new THREE.Vector3( 2, 1.5, 0 ),
	new THREE.Vector3( 1, 0, 0 )
);

var path = new THREE.Path( curve.getPoints( 50 ) );

var geometry = path.createPointsGeometry( 50 );
var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

//Create the final Object3d to add to the scene
var curveObject = new THREE.Line( geometry, material );
scene.add(curveObject);

var winResize = new THREEx.WindowResize(renderer, camera)

/**
 * Render
 */

var clock = new THREE.Clock();

var render = function(time) { // time [ms]
	requestAnimationFrame(render);

	// This block ensure that planet rotates at 1 revolution per second
	// For each frame we get a correct degree and set it
	//newRotation = 0.01;
	//cube.rotation.y += newRotation; // [rad]
	
	quaternion = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), 0.01);
	cube.quaternion.multiply(quaternion);
	
	// console.log(cube.rotation.y);

	if ( camera.position.z > 3 ) {
		camera.position.z -= 0.005;
	}
	renderer.render(scene, camera);
};

render();
