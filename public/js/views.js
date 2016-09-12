YUI.add('nahovno-views', function (Y) {

    function alertMessage(msg) {
        if (msg)
            Y.one('#message').setHTML(Y.Escape.html(msg));
        else
            Y.one('#message').setHTML(Y.Escape.html(''));
    }

    // front page view
    Y.NahovnoFrontpageView = Y.Base.create('NahovnoFrontpageView', Y.View, [], {
        render: function () {
            var container = this.get('container');
            var context = this;
            container.load("/templates/frontpage.html", null, function (tx, xhr) {
                if (xhr.status == 200) {
                    context.loadPageElements(container);
                    console.log("TBD: load table");
                } else {
                    alertMessage("Unable to load data: " + xhr.responseText);

                }
            });
            if (!container.inDoc()) {
                Y.one('#container').append(container);
            }

            return this;
        },
        loadPageElements: function (container) {
            new Y.Pagination(
                    {
                        boundingBox: container.one('#jssmall')
                    }
            ).render();
        }


    });

},
        '0.0.1',
        {
            requires: [
                'view', 'node-load', 'datatable-base', 'model-list', 'io', 'escape', 'node-event-delegate',
                'aui-pagination'
            ]
        }
);

