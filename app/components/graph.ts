///<reference path="../../typings/d3.d.ts"/>
///<amd-dependency path="angular"/>

import d3 = require('d3');

class Graph{

    private svgWidth : number;
    private svgHeight: number;

    private rectMargin      : number = 2;
    private rectDataScale   : number = 4;

    private elementSelector : string;
    private dataSet         : Array<number>;

    private svg             : any;
    private rect            : any;
    private labels          : any;

    private scale           : any = null;
    private normalize       : boolean = false;

    constructor(params){
        this.svgWidth = params.width;
        this.svgHeight = params.height;
    }

    public draw(elementSelector, dataSet){
        this.elementSelector = elementSelector;
        this.dataSet = dataSet;
        this.setLinearScale();
        this.createElements();
        this.styleElements();
    }

    private createElements(){
        this.svg = d3.select(this.elementSelector).append('svg');
        this.rect = this.svg.selectAll('rect')
            .data(this.dataSet)
            .enter()
            .append('rect');
        // labels
        this.svg.selectAll('text').remove();
        this.labels = this.svg.selectAll('text')
            .data(this.dataSet)
            .enter()
            .append('text')
            .transition();
    }

    private setLinearScale(){

        // is normalization turned on ?
        if(!this.normalize){ this.scale = (val) => { return val }; return;}

        // set scale
        this.scale = d3.scale .linear()
                        .domain([0,d3.max(this.dataSet)])
                        .range([0, this.svgHeight]);
    }

    private styleElements(){

        var rectDataScale = this.rectDataScale;

        // normalize enabled?
        // turn off the static normalization
        if(this.normalize){
            rectDataScale = 1;
        }

        // set svg width and height
        this.svg.attr('width', this.svgWidth)
            .attr('height', this.svgHeight);

        // set rect x and y
        this.rect.attr('x', (data, index) => {
                var dataCount = this.dataSet.length;
                return ( ( this.svgWidth - ( dataCount * this.rectMargin ) ) / dataCount * index ) + ( this.rectMargin * index );
            })
            .attr('y', (data) => {
                return this.svgHeight - ( this.scale(data) * rectDataScale);
            });

        // set rect width and height
        this.rect.attr('width', (data) => {
                var dataCount = this.dataSet.length;
                return ( this.svgWidth - ( dataCount * this.rectMargin ) ) / dataCount;
            })
            .attr('height', (data) => {
                return this.scale(data) * rectDataScale;
            })

        // apply css styles // 50 124 126
        this.rect.attr('fill', (data, index) => {
            return 'rgb(50, ' + ( 80 + index ) + ', ' + ( 80 + index ) + ')';
        });

        if(angular.isDefined(this.labels)){
            this.labels.text((data, index) => {
                return data;
            }).attr('x', (data, index) => {
                var dataCount = this.dataSet.length;
                var width = ( this.svgWidth - ( dataCount * this.rectMargin ) ) / dataCount;
                return ( ( this.svgWidth - ( dataCount * this.rectMargin ) ) / dataCount * index ) + ( this.rectMargin * index ) + width / 2;
            }).attr('y', (data) => {
                return this.svgHeight - ( this.scale(data) * rectDataScale) + 12;
            }).attr('font-size', '10px')
            .attr('text-anchor', 'middle')
            .attr('fill', 'white');
        }
    }

    public setNormalization(value : boolean){
        this.normalize = value;
    }

    public update(dataSet){
        this.dataSet = dataSet;
        this.setLinearScale();

        // rectangles
        //this.svg.selectAll('rect').remove();
        this.rect = this.svg.selectAll('rect')
            .data(this.dataSet)
            .on('mouseover', function(){
                this.lastColor = d3.select(this).attr('fill');
                d3.select(this).transition().attr('fill', 'orange');
                d3.select(this).attr('cursor', 'pointer');
            })
            .on('mouseout', function(){
                d3.select(this).transition().attr('fill', this.lastColor);
                d3.select(this).attr('cursor', 'pointer');
            })
            //.enter()
            //.append('rect')
            .transition()
            .duration(250)
            .delay((data, index) => {
                return index * 20;
            })
            .each('start', function() {
                d3.select(this).attr('fill', '#409799');
            })

            .ease('cubic-in-out');


        // labels
        //this.svg.selectAll('text').remove();
        this.labels = this.svg.selectAll('text')
                                .data(this.dataSet)
                                //.enter()
                                //.append('text')
                                .transition()
                                .duration(250)
                                .delay((data, index) => {
                                    return index * 25;
                                })

                                .ease('cubic-in-out');

        this.styleElements();
    }

    public drawSimpleNoSvg(dataSet){
        d3.select("#nosvg")
            .selectAll('div')
            .data(dataSet)
            .enter()
            .append("div")
            .style('height', (data : number, index) => {
                return (data * 5 ) + 'px';
            });
    }

}

export = Graph;
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
//    29, 17, 18, 10, 11, 13, 12,
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