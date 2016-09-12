
YUI({// set 'combine' to false during client-side development
    combine: true,
    // set the same URL on which you installed express-yuicombo in your routes
    comboBase: '/yui-combo?',
}).use(
        'node', 'datatable-base', 'model-list', 'io', 'datasource-io',
        'datasource-jsonschema','datatable-datasource','datasource-get',
        function (Y) {
            
        
// Create a JSONP DataSource to query YQL
            var myDataSource = new Y.DataSource.Get({
                source: 'http://query.yahooapis.com/v1/public/yql?format=json&' +
                        'env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&q='
            });

            myDataSource.plug(Y.Plugin.DataSourceJSONSchema, {
                schema: {
                    resultListLocator: 'query.results.Result',
                    resultFields: [
                        'Title',
                        'Phone',
                        {
                            // Important that record fields NOT include ".", so
                            // extract nested data with locators
                            key: 'Rating',
                            locator: "Rating.AverageRating"
                        }
                    ]
                }
            })
                    .plug(Y.Plugin.DataSourceCache, {
                        max: 3
                    });

// No data is provided at construction because it will load via the
// DataTableDataSource plugin
            var table = new Y.DataTable({
                columns: ['Title', 'Phone', 'Rating'],
                summary: 'Pizza places near 98089'
            });

            table.plug(Y.Plugin.DataTableDataSource, {
                datasource: myDataSource,
                initialRequest: "zip=94089"
            });

// Initially render an empty table and show a loading message
            table.render('#pizza');
                  

// Load the data into the table
            table.datasource.load({
                request: encodeURIComponent(
                        'select *' +
                        ' from   local.search' +
                        ' where  zip="94089"' +
                        ' and    query="pizza"')
            });
        });
