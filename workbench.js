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
var introMusicUrl = "resources/music/Smetana,_Má_vlast_-_Vltava_-_The_Moldau.ogg"
var theMusic = new Howl({
  urls: [introMusicUrl],
  autoplay: true,
  loop: false,
  volume: 0.2,
    onload: function() {
        console.log("music onload")
    },
    onplay: function() {
        console.log('music onplay')
    },
    onend: function() {
        console.log('music onend');
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


// TODO: theSun.position.set(0, 0, 3000000)
sunLight = new THREE.DirectionalLight( 0xffffff, 2 );
sunLight.position.set(0, 0, -1)
scene.add(sunLight);


// setup the theater
theEarth.position.set(0, 0, 0)
theEarth.rotation.x = deg2rad(0)  // earth rotates as ecliptic
theMoon.position.set(384400, 0, 0)
theMoon.rotation.x = deg2rad(5.145)

// camera under south pole
camera.position.set(theMoon.position.x+5000, 1750, -1200)
camera.lookAt(theEarth.position)

scene.add(theSun)
scene.add(theEarth)
scene.add(theMoon)



/* Telemetry console clock */
var clock = new THREE.Clock()

var samplingRate = 1600 // sample every 1 second
var lastSample = 0

var render = function(time) {
    requestAnimationFrame(render)
    
    var clockTime = clock.getElapsedTime()
    var clockDelta = clock.getDelta()
    
    /* do we sample telemetry this frame? */
    var sampling = time > lastSample + samplingRate
    if ( sampling ) {
        lastSample = time
    }

    var logger = function (message) {
        if ( sampling ) {
            console.info(message)
        }
    }

    logger({
        'time': time,
        'delta': clockDelta,
        'ping': samplingRate
    })
    
    /*
     * equatorial rotation of scene bodies
     */
    var rotations = [ // body, rate[rad/s]
        [theEarth, 7.292115e-5],
        [theMoon,  2.6617e-6],
    ]
    rotations.forEach( function(rot) {
        var body = rot[0]
        var rate = rot[1]
        var rads = clockDelta * 1

        quaternion = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3( 0, 1, 0 ),
            rads
        )
        //logger({'body': body.name, 'rads': rads, 'rot': body.rotation.y})
        body.quaternion.multiply(quaternion)
    })
    
    renderer.render(scene, camera)
};


// TODO keep it aligned with theSun
render();
console.log('called render')


/* TODO perhaps THREEx.WindowResize should handle this? */
var updateAspectRatio = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    
    camera.updateProjectionMatrix();
}
window.addEventListener( 'resize', updateAspectRatio )

