///<reference path="../../typings/d3.d.ts"/>
///<reference path="../../typings/three.d.ts"/>
///<reference path="../../typings/jquery.d.ts"/>
///<amd-dependency path="angular"/>
///<amd-dependency path="jquery"/>

import d3 = require('d3');
import THREE = require('three');
import Graph3dGeometry = require('./graph3d-geometry');
import flaming3ds   = require('json!flaming');

var options = {
    selector    : '#flaming',
    antialias   : true,
    canvas      : {
        width   : null,
        height  : 600
    }
}

class Flaming{

    scene       : THREE.Scene;
    camera      : THREE.Camera;
    renderer    : THREE.Renderer;
    lightHemi   : THREE.HemisphereLight;
    lightDir    : THREE.DirectionalLight;
    mixers      : Array<any> = [];
    object      : JQuery;
    clock       : THREE.Clock = new THREE.Clock();
    canvasSize  : {
        w : number,
        h : number
    }

    constructor(){

        /**
         * Get dom object by options.selector
         * @returns {JQuery}
         */
        var setDomObject = () =>{
            this.object = $(options.selector);
        }

        /**
         * Get canvas size
         * @returns {{w: number, h: any}}
         */
        var setCanvasSize  = () => {
            this.canvasSize = { w : this.object.width(), h : options.canvas.height};
        }

        /**
         * Set renderer
         *
         * @returns {THREE.WebGLRenderer}
         */
        var setRenderer = () => {
            this.renderer = new THREE.WebGLRenderer({antialias:options.antialias});
            // attach renderer to DOM
            this.object[0].appendChild(this.renderer.domElement);
            this.renderer.setSize(this.canvasSize.w, this.canvasSize.h);
            this.renderer.setClearColor( 0xDADADA );
            this.renderer.setPixelRatio( window.devicePixelRatio );

            this.renderer.gammaInput = true;
            this.renderer.gammaOutput = true;

            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.cullFace = THREE.CullFaceBack;
        }

        /**
         * Set scene
         */
        var setScene = () => {
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
            this.scene.fog.color.setHSL( 0.6, 0, 1 );
        }

        // get dom
        setDomObject();

        // get canvas size
        setCanvasSize();

        // set renderer
        setRenderer();

        // create scene
        setScene();

        // camera
        this.setCamera();

        // lights
        this.setLights();

        // ground
        this.setGround();

        // model
        this.setModel(flaming3ds);

        // start scene
        this.animateScene();
        console.warn('---- ends ----');
    }

    private setCamera(){
        this.camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 5000 );
        this.camera.position.set( 0, 0, 250 );
        //this.camera.position.set(0,1,10);
        //this.camera.lookAt(this.scene.position);
        this.scene.add(this.camera);
    }

    private setLights(){
        // hemi light
        this.lightHemi = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        this.lightHemi.color.setHSL( 0.6, 1, 0.6 );
        this.lightHemi.groundColor.setHSL( 0.095, 1, 0.75 );
        this.lightHemi.position.set( 0, 500, 0 );
        this.scene.add( this.lightHemi );

        // directional light
        this.lightDir = new THREE.DirectionalLight( 0xffffff, 1 );
        this.lightDir.color.setHSL( 0.1, 1, 0.95 );
        this.lightDir.position.set( -1, 1.75, 1 );
        this.lightDir.position.multiplyScalar( 50 );
        this.scene.add( this.lightDir );

        this.lightDir.castShadow = true;
        this.lightDir.shadowMapWidth = 1024;
        this.lightDir.shadowMapHeight = 1024;

        var d = 50;
        this.lightDir.shadowCameraLeft = -d;
        this.lightDir.shadowCameraRight = d;
        this.lightDir.shadowCameraTop = d;
        this.lightDir.shadowCameraBottom = -d;

        this.lightDir.shadowCameraFar = 3500;
        this.lightDir.shadowBias = -0.0001;
    }

    private setGround(){
        var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
        var groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x050505 } );
        groundMat.color.setHSL( 0.095, 1, 0.75 );

        var ground = new THREE.Mesh( groundGeo, groundMat );
        ground.rotation.x = -Math.PI/2;
        ground.position.y = -33;
        this.scene.add( ground );
        ground.receiveShadow = true;
    }

    private setModel(modelGeometry){

        var loader = new THREE.JSONLoader();
        loader.load( "lib/models/flaming.json", (modelGeometry) => {
            var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 20, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );
            var mesh = new THREE.Mesh( modelGeometry, material );

            var s = 0.35;
            mesh.scale.set( s, s, s );
            mesh.position.y = 15;
            mesh.rotation.y = -1;

            mesh.castShadow = true;
            mesh.receiveShadow = true;

            this.scene.add( mesh );
            var mixer = new THREE.AnimationMixer( mesh );
            mixer.addAction( new THREE.AnimationAction( modelGeometry.animations[ 0 ] ).warpToDuration( 1 ) );
            this.mixers.push( mixer );
        });
    }

    flamingPos : Object = {
        x : 0,
        y : 0,
        z : -5
    };
    private animateScene(){
        requestAnimationFrame( this.animateScene.bind(this) );
        //this.lightDir.color.setHSL( this.tmp, this.tmp, 0.95 );
        this.flamingPos.x += 0.01;
        this.flamingPos.y += 0.01;
        this.flamingPos.z += 0.01;
        if(this.flamingPos.y > 10) this.flamingPos.y = -1;
        if(this.flamingPos.z < -10) this.flamingPos.z = 1;
        // this.lightDir.position.set( -1, 1.75, 1 );
        this.lightDir.position.set( -1, this.flamingPos.y, this.flamingPos.z );
        this.lightDir.position.multiplyScalar( 50 );
        this.render();
    }

    private render(){
        var delta = this.clock.getDelta();
        for ( var i = 0; i < this.mixers.length; i ++ ) {
            this.mixers[ i ].update( delta );
        }
        this.renderer.render(this.scene, this.camera);
    }

}


export = Flaming;