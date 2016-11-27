///<reference path="../../typings/d3.d.ts"/>
///<reference path="../../typings/three.d.ts"/>
///<reference path="../../typings/jquery.d.ts"/>
///<amd-dependency path="angular"/>
///<amd-dependency path="jquery"/>

import d3 = require('d3');
import THREE = require('three');
import Graph3dGeometry = require('./graph3d-geometry');

// selector : #3d.graph
// height : 200
// antialias : true
// bgcolor : '0xDADADA'
class Graph3d extends Graph3dGeometry{

    constructor(options) {
        super(options);
        var newData = [];
        angular.forEach(angular.copy(this.options.data), (data, index) => {
           newData.push({
               geometry : {
                   size : [30.0, data * 5, 30.0],
                   position : [-450 + ( 40 * index ), 0.0, 0.0],
                   materials : [{color:0x2b5556}, {color:0x2b5556}, {color:0x46A4A6}, {color:0x327C7E}, {color:0x327C7E},{color:0x327C7E}]
               }
           })
        });
        this.options.data = newData;
        this.createGeometry();
    }

}

export = Graph3d;