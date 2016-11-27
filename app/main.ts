requirejs.config({
    baseUrl: 'app/',
    paths: {
        json    : '../lib/json',
        text    : '../lib/text',
        d3      : '../lib/d3',
        three   : '../lib/three',
        jquery  : '../lib/jquery',
        angular : '../lib/angular',
        flaming : '../lib/models/flaming.json'
    },
    shims : {
        angular : {
            exports : 'angular',
            deps : ['jquery']
        }
    }
});

require(['app']);