/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7885245901639344, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "HTTP Request-3"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "HTTP Request-2"], "isController": false}, {"data": [0.875, 500, 1500, "01"], "isController": false}, {"data": [0.5, 500, 1500, "HTTP Request-4"], "isController": false}, {"data": [1.0, 500, 1500, "03"], "isController": false}, {"data": [1.0, 500, 1500, "02_click on Fish"], "isController": true}, {"data": [1.0, 500, 1500, "04"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-1"], "isController": false}, {"data": [1.0, 500, 1500, "HTTP Request-0"], "isController": false}, {"data": [0.875, 500, 1500, "01_open web page"], "isController": true}, {"data": [1.0, 500, 1500, "03_Click on product Id"], "isController": true}, {"data": [1.0, 500, 1500, "04_Click on Item Id"], "isController": true}, {"data": [1.0, 500, 1500, "02-2"], "isController": false}, {"data": [0.75, 500, 1500, "HTTP Request 1"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 273, 0, 0.0, 515.5897435897441, 19, 2418, 431.0, 640.2, 1138.4000000000005, 2320.5, 3.0132571559849156E-4, 0.012485869596848434, 6.67654538328689E-5], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HTTP Request-3", 7, 0, 0.0, 187.85714285714286, 182, 194, 188.0, 194.0, 194.0, 194.0, 6.951340615690168, 14.185855263157896, 2.374006951340616], "isController": false}, {"data": ["HTTP Request-2", 7, 0, 0.0, 533.5714285714287, 499, 592, 533.0, 592.0, 592.0, 592.0, 5.128205128205129, 8.276814331501832, 1.312099358974359], "isController": false}, {"data": ["01", 8, 0, 0.0, 459.125, 187, 1413, 199.0, 1413.0, 1413.0, 1413.0, 0.1131829885968139, 0.568761097238335, 0.06264302615941823], "isController": false}, {"data": ["HTTP Request-4", 7, 0, 0.0, 1204.857142857143, 1124, 1275, 1213.0, 1275.0, 1275.0, 1275.0, 3.5122930255895635, 2751.910495327396, 1.5875878073256398], "isController": false}, {"data": ["03", 8, 0, 0.0, 195.375, 189, 201, 196.0, 201.0, 201.0, 201.0, 0.11471343150891179, 0.4560531051491991, 0.07931358350420854], "isController": false}, {"data": ["02_click on Fish", 8, 0, 0.0, 194.625, 188, 208, 193.5, 208.0, 208.0, 208.0, 0.11460332922671404, 0.4396112082055984, 0.07565610405982294], "isController": true}, {"data": ["04", 8, 0, 0.0, 198.125, 189, 227, 195.0, 227.0, 227.0, 227.0, 0.11464603038119804, 0.42603203819145885, 0.07358506198051018], "isController": false}, {"data": ["HTTP Request-1", 7, 0, 0.0, 376.7142857142857, 357, 426, 362.0, 426.0, 426.0, 426.0, 5.737704918032787, 4.252849641393443, 0.711609887295082], "isController": false}, {"data": ["HTTP Request-0", 7, 0, 0.0, 25.42857142857143, 19, 35, 22.0, 35.0, 35.0, 35.0, 8.443908323281061, 5.005324562726177, 0.9235524728588661], "isController": false}, {"data": ["01_open web page", 8, 0, 0.0, 459.125, 187, 1413, 199.0, 1413.0, 1413.0, 1413.0, 0.1120777819806946, 0.5632072720968352, 0.06203133099370963], "isController": true}, {"data": ["03_Click on product Id", 8, 0, 0.0, 195.375, 189, 201, 196.0, 201.0, 201.0, 201.0, 0.11467725519989679, 0.45590928312380846, 0.07928857097805364], "isController": true}, {"data": ["04_Click on Item Id", 8, 0, 0.0, 198.125, 189, 227, 195.0, 227.0, 227.0, 227.0, 0.1147002738469038, 0.42623361040618235, 0.07361987791589603], "isController": true}, {"data": ["02-2", 8, 0, 0.0, 194.625, 188, 208, 193.5, 208.0, 208.0, 208.0, 0.11469040758103594, 0.43994523533038005, 0.07571358937966825], "isController": false}, {"data": ["HTTP Request 1", 200, 0, 0.0, 510.86999999999966, 356, 725, 514.0, 629.8, 643.0, 691.8300000000002, 18.231540565177756, 84.69547629899726, 2.1365086599817684], "isController": false}, {"data": ["HTTP Request", 6, 0, 0.0, 2317.5, 2233, 2418, 2310.5, 2418.0, 2418.0, 2418.0, 1.925545571245186, 1518.3384397063542, 2.47023928915276], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 273, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
