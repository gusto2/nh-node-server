
YUI({// set 'combine' to false during client-side development
    combine: true,
    // set the same URL on which you installed express-yuicombo in your routes
    comboBase: '/yui-combo?',
}).use(
        'node', 'app-base', 'node', 'nahovno-views',
        function (Y) {


//            var app = {
//                // Application Constructor
//                initialize: function () {
//                    this.bindEvents();
//                },
//                // Bind Event Listeners
//                //
//                // Bind any events that are required on startup. Common events are:
//                // 'load', 'deviceready', 'offline', and 'online'.
//                bindEvents: function () {
////                    document.addEventListener('deviceready', this.onDeviceReady, false);
//                },
//                // deviceready Event Handler
//                //
//                // The scope of 'this' is the event. In order to call the 'receivedEvent'
//                // function, we must explicitly call 'app.receivedEvent(...);'
//                onDeviceReady: function () {
////                    app.receivedEvent('deviceready');
//                },
//                // Update DOM on a Received Event
//                receivedEvent: function (id) {
////                    var parentElement = document.getElementById(id);
////                    var listeningElement = parentElement.querySelector('.listening');
////                    var receivedElement = parentElement.querySelector('.received');
////
////                    listeningElement.setAttribute('style', 'display:none;');
////                    receivedElement.setAttribute('style', 'display:block;');
//
//                    console.log('Received Event: ' + id);
//                }
//            };
//
//            app.initialize();


            var app = new Y.App({
                views: {
                    frontpage: {type: "NahovnoFrontpageView"}
                },
                root: "/",
                serverRouting: false,
                viewContainer: '#container',
                container: '#container'
            });

            app.route('/', function (req, res, next) {
                app.showView('frontpage');
            });


            app.render().dispatch().save('/');


        }
);


