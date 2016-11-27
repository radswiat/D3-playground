///<reference path="../../typings/d3.d.ts"/>
///<reference path="../../typings/three.d.ts"/>
///<reference path="../../typings/jquery.d.ts"/>
///<amd-dependency path="angular"/>
///<amd-dependency path="jquery"/>

import d3 = require('d3');
import THREE = require('three');

// selector : #3d.graph
// height : 200
// antialias : true
// bgcolor : '0xDADADA'
class Graph3dGeometry{

    scene       : THREE.Scene;
    camera      : THREE.Camera;
    renderer    : THREE.Renderer;
    options     : any;
    light       : THREE.PointLight;

    private data : any;
    private canvasSize  : any;
    private domObject   : JQuery;
    private boxMeshes   : Array<THREE.Mesh> = [];

    constructor(options){
        this.options = options;
    }

    protected createGeometry(){

        var options = this.options;
        this.data = options.data;

        /**
         * Get dom object by options.selector
         * @returns {JQuery}
         */
        var setDomObject = () =>{
            this.domObject = $(options.selector);
        }

        /**
         * Get canvas size
         * @returns {{w: number, h: any}}
         */
        var setCanvasSize  = () => {
            this.canvasSize = { w : this.domObject.width(), h : options.height};
        }

        /**
         * Set renderer
         *
         * @returns {THREE.WebGLRenderer}
         */
        var setRenderer = () => {
            this.renderer = new THREE.WebGLRenderer({antialias:options.antialias});
            // attach renderer to DOM
            this.domObject[0].appendChild(this.renderer.domElement);
            this.renderer.setSize(this.canvasSize.w, this.canvasSize.h);
            this.renderer.setClearColor( 0xDADADA );

        }

        /**
         * Set scene
         */
        var setScene = () => {
            this.scene = new THREE.Scene();
            // create camera
            //this.camera = new THREE.PerspectiveCamera(45, this.canvasSize.w / this.canvasSize.h, 1, 100);
            this.camera = new THREE.OrthographicCamera( this.canvasSize.w / -2,
                this.canvasSize.w / 2,
                this.canvasSize.h / 2,
                this.canvasSize.h / -2,
                - 2000, 1000);
            this.camera.position.set(0,1,10);
            this.camera.lookAt(this.scene.position);
            this.scene.add(this.camera);
        }

        // get dom
        setDomObject();

        // get canvas size
        setCanvasSize();

        // set renderer
        setRenderer();

        // create scene
        setScene();

        this.setGround();

        // evaluate data to build up geometry
        angular.forEach(this.data, (data) => {
            this.setGeometry(data.geometry);
        });

        // start scene
        this.animateScene();
    }

    private setGround(){
        var boxGeometry = new THREE.BoxGeometry(1400.0, 1.0, 1400.0);
        var boxMaterials = [
            new THREE.MeshLambertMaterial({color : 0xf7f7f7,side: THREE.DoubleSide, vertexColors: THREE.FaceColors,blending: THREE.NormalBlending}),
            new THREE.MeshLambertMaterial({color : 0xf7f7f7,side: THREE.DoubleSide, vertexColors: THREE.FaceColors,blending: THREE.NormalBlending}),
            new THREE.MeshLambertMaterial({color : 0xf7f7f7,side: THREE.DoubleSide, vertexColors: THREE.FaceColors,blending: THREE.NormalBlending}),
            new THREE.MeshLambertMaterial({color : 0xf7f7f7,side: THREE.DoubleSide, vertexColors: THREE.FaceColors,blending: THREE.NormalBlending}),
            new THREE.MeshLambertMaterial({color : 0xf7f7f7,side: THREE.DoubleSide, vertexColors: THREE.FaceColors,blending: THREE.NormalBlending}),
            new THREE.MeshLambertMaterial({color : 0xf7f7f7,side: THREE.DoubleSide, vertexColors: THREE.FaceColors,blending: THREE.NormalBlending}),
        ];
        var boxMaterial = new THREE.MeshFaceMaterial(boxMaterials);
        var boxMesh = new THREE.Mesh(boxGeometry , boxMaterial);
        boxMesh.position.set(0.0, -85.0, 0.0);
        boxMesh.receiveShadow = true;

        //this.light = new THREE.DirectionalLight(0x2b5556, 1 );
        //this.light.position.x = 100;
        //this.light.position.y = 100;
        //this.light.position.z = 100;
        //this.light.intensity = 3;
        //this.scene.add(this.light);
        this.scene.add(boxMesh);
        this.scene.add(new THREE.AmbientLight(0x1c1c1c))
        var directionalLight = new THREE.DirectionalLight(0x1c1c1c);
        directionalLight.position.set(100, 100, 200);
        directionalLight.castShadow = true;
        directionalLight.intensity = 8.5;
        directionalLight.shadowMapHeight = 1024;
        directionalLight.shadowMapWidth = 1024;
        directionalLight.castShadow = true;
        directionalLight.shadowMapWidth = 2048;
        directionalLight.shadowMapHeight = 2048;
        directionalLight.shadowCameraNear = 100;
        directionalLight.shadowCameraFar = 2000;
        directionalLight.shadowCameraFov = 30;
        this.scene.add(directionalLight);

        //this.light.castShadow = true;
    }

    /**
     * Build up geometry for each cube
     * requires:
     * - size
     * - materials
     * - position
     * @param geometry
     */
    private setGeometry(geometry){

        var normalizeY = (geometry) => {
            let bottomMargin = 10;
            let boxHeight = geometry.size[1];
            let canvasHeight = this.canvasSize.h;
            geometry.position[1] = ( geometry.position[1] + boxHeight/2 ) - canvasHeight/2 + bottomMargin;
            return geometry.position;
        }

        geometry.position = normalizeY(geometry);

        var boxGeometry = new THREE.BoxGeometry(...geometry.size);
        var boxMaterials = [];
        angular.forEach(geometry.materials, (material) => {
            //material.shading = THREE.SmoothShading;
            //boxMaterials.push(new THREE.MeshBasicMaterial(material));
            boxMaterials.push(new THREE.MeshLambertMaterial(material));
        });
        var boxMaterial = new THREE.MeshFaceMaterial(boxMaterials);
        var boxMesh = new THREE.Mesh(boxGeometry , boxMaterial);
        boxMesh.position.set(...geometry.position);
        this.boxMeshes.push(boxMesh);
        this.scene.add(boxMesh);
        boxMesh.castShadow = true;

        //this.light = new THREE.DirectionalLight(0x2b5556, 1 );
        //this.light.position.x = 100;
        //this.light.position.y = 100;
        //this.light.position.z = -100;
        //this.light.intensity = 3;
        //this.scene.add(this.light);
        //this.light.castShadow = true;

    }

    private cx : number = 0;
    private cxs : boolean = false;

    private animateScene(){

        if(this.cx > 7){
            this.cxs = !this.cxs;
        }else if(this.cx < -7){
            this.cxs = !this.cxs;
        }

        if(this.cxs){
            this.cx += 0.1;
        }else{
            this.cx -= 0.1;
        }


        angular.forEach(this.boxMeshes, (boxMesh) => {
            //boxMesh.rotateOnAxis(new THREE.Vector3(0, 1, 0).normalize(), 0.0075);
        })
        this.camera.lookAt(new THREE.Vector3(this.cx,-1,0));
        requestAnimationFrame(this.animateScene.bind(this));
        this.renderScene();
    }

    private renderScene(){
        this.renderer.render(this.scene, this.camera);
    }

}

export = Graph3dGeometry;