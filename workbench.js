/**
 * Workbench
 */

/* Math */

// Astronomical Unit [km]
var AU = 149597871

// return radians of an angle
function deg2rad(angle) {
  //  discuss at: http://phpjs.org/functions/deg2rad/
  // original by: Enrique Gonzalez
  // improved by: Thomas Grainger (http://graingert.co.uk)
  //   example 1: deg2rad(45);
  //   returns 1: 0.7853981633974483

  return angle * .017453292519943295 // (angle / 180) * Math.PI;
}

// append new renderer to the document body
var renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// reference point is the Sun @ 0, 0, 0
var theSun = THREE.Object3D()
    
    /**
    new THREE.Mesh(
    new THREE.SphereGeometry(696342, 18, 18),
    new THREE.MeshBasicMaterial({
        color: 0xffffff
    })
)
*/
//Mesh(


// the Earth and the Moon
var theEarth = new THREE.Mesh(
    new THREE.SphereGeometry(6371, 18, 18),
    new THREE.MeshLambertMaterial({
        color : 0x50999c,
        map: THREE.ImageUtils.loadTexture( "resources/textures/earthmap1k.jpg" ),
    })
)
var theMoon = new THREE.Mesh(
    new THREE.SphereGeometry(1740, 36, 36),
    new THREE.MeshPhongMaterial({
        color : 0xb2a1a1,
        map: THREE.ImageUtils.loadTexture( "resources/textures/moonmap1k.jpg" ),
        // Map: THREE.ImageUtils.loadTexture( "resources/textures/moonbump1k.jpg"),
        normalMap: THREE.ImageUtils.loadTexture( "resources/textures/Moon.normalMap.png" ),
		normalScale: new THREE.Vector2( 0.5, 0.5 ),
		wrapRGB: new THREE.Vector3( 0.575, 0.5, 0.5 ),
    })
)

// some ambient music
var theMusic = new Howl({
  urls: ["resources/music/Air_(Bach).ogg"],
  autoplay: false,
  loop: false,
  volume: 0.1,
    onplay: function() {
        console.log('PLAY Air')
    },
    onend: function() {
        console.log('END Air');
    }
})

console.log('construct done')

/* Construct scene and camera */

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(42,
                                         window.innerWidth / window.innerHeight,
                                         1, 5*AU)
var winResize = new THREEx.WindowResize(renderer, camera)
scene.add(camera)


// no moving orbits, planets in line with the Sun
//theSun.position.set(0, 0, 3000000)
theEarth.position.set(AU, 0, 0)
theMoon.position.set(AU + 384400, 0, 0)

theMoon.rotation.x = 6 // well sort of
camera.position.set(theMoon.position.x + 2000, 1500, 1400)
camera.lookAt(theEarth.position)

scene.add(theSun)
scene.add(theEarth)
scene.add(theMoon)

var clock = new THREE.Clock();
var render = function(time) {
    requestAnimationFrame(render)
    
    // slow rotation accoring to elapsed time
    quaternion = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3( 0, 1, 0 ), Math.PI / 32000
    )
    // theMoon.quaternion.multiply(quaternion)

    
    camera.position.z += 0.05
    //camera.lookAt(theEarth.position)
    
    renderer.render(scene, camera)
};




// TODO keep it aligned with theSun
sunLight = new THREE.DirectionalLight( 0xffffff, 2 );
sunLight.position.set(0, 1, -.5)
scene.add(sunLight);

render();
console.log('set camera and called render')

// once rendering is done, start playing music
console.log('starting game engine, haha')


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
