/**
 * "Earth rise"
 *
 * Watch the planet Earth rise over the horizon of the Moon.
 *
 */



/**
 * Mythical Math
 */

var AU = 149597871; // 1 Astronomical Unit [km]

function deg2rad(angle) {
  //  discuss at: http://phpjs.org/functions/deg2rad/
  // original by: Enrique Gonzalez
  // improved by: Thomas Grainger (http://graingert.co.uk)
  //   example 1: deg2rad(45);
  //   returns 1: 0.7853981633974483

  return angle * .017453292519943295; // (angle / 180) * Math.PI;
}


/* construct scene, camera and attach renderer to the document body */
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50,
		window.innerWidth / window.innerHeight, 1, AU);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* setup directional light, above us with small tilt */
light = new THREE.DirectionalLight( 0xffffff, 0.8 );
light.position.set( 0.2, 1, 0 );
scene.add( light );

/* add the Earth */
var earth = new THREE.Mesh(
    new THREE.SphereGeometry(6371, 18, 18),
    new THREE.MeshPhongMaterial({
        color : 0xff0000,
        wireframe: true,
    })
);
earth.position.z = -camera.position.z - 384400;
scene.add(earth) // cube is a lie

/* add the Moon */    
var material = new THREE.MeshPhongMaterial({
    color : 0x00ff00,
    wireframe: true,
});

var cube = new THREE.Mesh(
            new THREE.SphereGeometry(1740, 18, 18),
            material);
    cube.rotation.z = deg2rad(5.1 + 1.5);  
    scene.add(cube) // cube is a lie

// keep track of the Earth
camera.lookAt(earth.position);
    
    

// The Sphere!
// The MOON

var clock = new THREE.Clock();

camera.position.y = 1750;
// camera.position.z = 1780;


var render = function(time) {
    requestAnimationFrame(render);
    
    // slow rotation accoring to elapsed time
    quaternion = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI / 4096);
    cube.quaternion.multiply(quaternion);

    renderer.render(scene, camera);
};


var winResize = new THREEx.WindowResize(renderer, camera)

render();

// have some air
var sound = new Howl({
  urls: ['resources/music/Air_(Bach).ogg'],
  autoplay: true,
  loop: false,
  volume: 0.2,
    onplay: function() {
        console.log('PLAY Air')
    },
    onend: function() {
        console.log('END Air');
    }
})


// once rendering is done, start playing music
