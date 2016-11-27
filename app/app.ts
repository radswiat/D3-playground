///<reference path="../typings/d3.d.ts"/>
///<amd-dependency path="angular"/>

import Graph = require('./components/graph');
import Graph3d = require("./components/graph3d");
import Flaming = require("./components/flaming");

class App{

    app : any;
    graphs : Object = {};

    constructor(){
        this.app = angular.module('App', []);
    }

    private main(){
        this.app.directive('mainApp', () => {
            return {
                restrict : 'A',
                link : ($scope, $element, $attr) => {
                    this.mainRun($scope, $element, $attr);
                }
            }
        })
    }

    public init(){
        this.main();
        angular.bootstrap(document, ['App']);
    }

    private mainRun($scope, $element, $attr){

        $scope.graph = {};
        $scope.graph.min = 30;
        $scope.graph.max = 200;
        $scope.graph.normalize = true;

        // 3d
        var graph3d = new Graph3d({
            selector : '#3d.graph',
            height : 200,
            antialias : true,
            bgcolor : '0xDADADA',
            data : [
                25, 7, 5, 26, 11, 8, 25,
                14, 4, 9, 14, 11, 6, 4,
                29, 11, 10, 12, 3, 8, 10,
                24, 18, 25, 9, 3, 12, 3
            ]
        });

        // flaming
        var flaming = new Flaming();

        // Graph 1
        var graph1 = new Graph({
            width: 500,
            height: 150
        });
        graph1.drawSimpleNoSvg([
            25, 7, 5, 26, 11, 8, 25,
            14, 1, 9, 14, 11, 2, 2,
            29, 11, 1, 12, 1, 8, 10,
            24, 18, 25, 9, 3, 12, 3
        ]);
        this.graphs['nosvg'] = graph1;

        // Graph 2
        var graph2 = new Graph({
            width: 938,
            height: 150
        });
        graph2.draw('#svg1',[
            25, 7, 5, 26, 11, 8, 25, 14, 23, 19,
            14, 11, 22, 29, 11, 13, 12, 17, 18, 10,
            24, 18, 25, 9, 3
        ]);
        this.graphs['svg1'] = graph2;

        // Graph 3
        var graph3 = new Graph({
            width: 938,
            height: 150
        });
        graph3.draw('#svg2',[
            9, 1, 14, 39, 11, 8, 25, 14, 23, 19, 14, 11, 22,
            29, 17, 18, 10, 11, 13, 12,
            24, 18, 25, 9, 3, 25, 7, 5, 26,14, 39, 11, 8,
            25,19, 14,11, 13, 12, 9, 2, 4, 5,9, 11
        ]);
        this.graphs['svg2'] = graph3;

        $scope.random = (graph, min, max, normalize) => {
            let dataSet = [];
            for(let i = 45; i>0; i--){
                let value = Math.floor(Math.random() * max) + min;
                dataSet.push(value);
            }
            console.warn(dataSet.length);
            let currentGraph = this.graphs['svg2'];
            currentGraph.setNormalization(normalize);
            currentGraph.update(dataSet);
        }
    }



}

var app = new App();
app.init();

//
//var dataSet;
//var app = new App({
//    width: 500,
//    height: 200
//});
//
//// svg 1
//dataSet = [ 25, 7, 5, 26, 11, 8, 25, 14, 23, 19,
//    14, 11, 22, 29, 11, 13, 12, 17, 18, 10,
//    24, 18, 25, 9, 3 ];
//app.drawSimpleNoSvg(dataSet);
//
//// svg 2
//dataSet = [ 25, 7, 5, 26, 11, 8, 25, 14, 23, 19,
//    14, 11, 22, 29, 11, 13, 12, 17, 18, 10,
//    24, 18, 25, 9, 3 ];
//app.draw('#svg', dataSet);
//
//// svg 3
//dataSet = [ 9, 1, 14, 39, 11, 8, 25, 14, 23, 19, 14, 11, 22,
//     29, 17, 18, 10, 11, 13, 12,
//    24, 18, 25, 9, 3, 25, 7, 5, 26,14, 39, 11, 8, 25,19, 14,11, 13, 12, 9, 2, 4, 5,9, 11 ];
//app.draw('#svg2', dataSet);
//
//// svg 4
//dataSet = [];
//for(let i = 100; i>0; i--){
//    let value = Math.floor(Math.random() * 40) + 1;
//    dataSet.push(value);
//}
//app.draw('#svg2', dataSet);