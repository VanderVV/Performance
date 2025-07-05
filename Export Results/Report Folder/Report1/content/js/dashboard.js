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

    var data = {"OkPercent": 92.3076923076923, "KoPercent": 7.6923076923076925};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8134057971014492, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Select Pet-79"], "isController": false}, {"data": [1.0, 500, 1500, "Add pet to cart-83"], "isController": false}, {"data": [1.0, 500, 1500, "Payment Address-85"], "isController": false}, {"data": [1.0, 500, 1500, "Select Pet type-80"], "isController": false}, {"data": [1.0, 500, 1500, "Select sub type"], "isController": true}, {"data": [1.0, 500, 1500, "Proceed to checkout"], "isController": true}, {"data": [1.0, 500, 1500, "Select sub type-81"], "isController": false}, {"data": [0.0, 500, 1500, "Payment Confirmation"], "isController": true}, {"data": [1.0, 500, 1500, "Sign Out-88"], "isController": false}, {"data": [0.875, 500, 1500, "Sign Out-87"], "isController": false}, {"data": [1.0, 500, 1500, "Proceed to checkout-84"], "isController": false}, {"data": [1.0, 500, 1500, "Sign Out-87-0"], "isController": false}, {"data": [0.0, 500, 1500, "Payment Confirmation-86"], "isController": false}, {"data": [1.0, 500, 1500, "Sign Out-87-1"], "isController": false}, {"data": [1.0, 500, 1500, "Payment Address"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "Sign In"], "isController": true}, {"data": [1.0, 500, 1500, "Select Pet type"], "isController": true}, {"data": [0.0, 500, 1500, "Transaction Controller"], "isController": true}, {"data": [0.5, 500, 1500, "Sign Out"], "isController": true}, {"data": [1.0, 500, 1500, "Add pet to cart"], "isController": true}, {"data": [0.75, 500, 1500, "Sign In-76"], "isController": false}, {"data": [1.0, 500, 1500, "Select Pet"], "isController": true}, {"data": [1.0, 500, 1500, "Sign In-77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 156, 12, 7.6923076923076925, 297.8397435897436, 210, 1446, 234.5, 455.0, 548.9500000000002, 1188.930000000003, 9.606502863476816, 46.711187188250506, 7.097713259745058], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Select Pet-79", 12, 0, 0.0, 233.91666666666669, 211, 319, 225.0, 301.6000000000001, 319.0, 319.0, 1.0325245224574084, 3.960699535363965, 0.6352445792462571], "isController": false}, {"data": ["Add pet to cart-83", 12, 0, 0.0, 248.33333333333331, 215, 316, 237.0, 307.3, 316.0, 316.0, 1.026694045174538, 4.676270533880904, 0.6567232417864476], "isController": false}, {"data": ["Payment Address-85", 12, 0, 0.0, 240.08333333333331, 217, 295, 237.5, 281.50000000000006, 295.0, 295.0, 1.0245026893195595, 4.506211047554, 1.2876317980022198], "isController": false}, {"data": ["Select Pet type-80", 12, 0, 0.0, 231.08333333333334, 216, 265, 230.5, 258.1, 265.0, 265.0, 1.033947957952783, 4.1458889798380145, 0.6684311993796312], "isController": false}, {"data": ["Select sub type", 12, 0, 0.0, 240.83333333333334, 219, 343, 234.5, 312.4000000000001, 343.0, 343.0, 1.0335027129446215, 3.842328933769701, 0.6610783954870381], "isController": true}, {"data": ["Proceed to checkout", 12, 0, 0.0, 238.66666666666669, 213, 319, 230.0, 300.4000000000001, 319.0, 319.0, 1.0274852298998203, 4.236704234095384, 0.6461918828666838], "isController": true}, {"data": ["Select sub type-81", 12, 0, 0.0, 240.83333333333334, 219, 343, 234.5, 312.4000000000001, 343.0, 343.0, 1.034928848641656, 3.847630983182406, 0.6619906209573091], "isController": false}, {"data": ["Payment Confirmation", 12, 12, 100.0, 384.5833333333333, 225, 458, 444.5, 457.7, 458.0, 458.0, 1.026167265264238, 15.451633850692662, 0.6223143278604412], "isController": true}, {"data": ["Sign Out-88", 12, 0, 0.0, 241.08333333333331, 221, 376, 225.5, 337.60000000000014, 376.0, 376.0, 1.0313708637730983, 5.00879619681994, 0.6274844220025785], "isController": false}, {"data": ["Sign Out-87", 12, 0, 0.0, 470.0, 431, 577, 455.0, 567.1, 577.0, 577.0, 1.0133423408208073, 5.223067260597872, 1.2419381227833135], "isController": false}, {"data": ["Proceed to checkout-84", 12, 0, 0.0, 238.66666666666669, 213, 319, 230.0, 300.4000000000001, 319.0, 319.0, 1.0296010296010296, 4.245428464178464, 0.6475225225225225], "isController": false}, {"data": ["Sign Out-87-0", 12, 0, 0.0, 244.58333333333331, 210, 337, 227.5, 328.90000000000003, 337.0, 337.0, 1.0337698139214335, 0.23219439179875948, 0.6380298070296347], "isController": false}, {"data": ["Payment Confirmation-86", 12, 12, 100.0, 384.5833333333333, 225, 458, 444.5, 457.7, 458.0, 458.0, 1.0273093057101275, 15.46883025853951, 0.6230069129355363], "isController": false}, {"data": ["Sign Out-87-1", 12, 0, 0.0, 224.83333333333334, 212, 239, 225.0, 237.5, 239.0, 239.0, 1.0318142734307825, 5.08652192605331, 0.6277541917454857], "isController": false}, {"data": ["Payment Address", 12, 0, 0.0, 240.08333333333331, 217, 295, 237.5, 281.50000000000006, 295.0, 295.0, 1.0295126973232671, 4.528247254632807, 1.293928556108442], "isController": true}, {"data": ["Sign In", 12, 0, 0.0, 873.9166666666666, 441, 1695, 824.0, 1558.2000000000005, 1695.0, 1695.0, 0.9076469253460404, 7.578201819075713, 1.372550062400726], "isController": true}, {"data": ["Select Pet type", 12, 0, 0.0, 231.08333333333334, 216, 265, 230.5, 258.1, 265.0, 265.0, 1.0362694300518134, 4.1551975388601035, 0.6699319948186528], "isController": true}, {"data": ["Transaction Controller", 12, 12, 100.0, 3402.5, 2831, 4247, 3464.0, 4124.6, 4247.0, 4247.0, 0.7678034423187664, 44.57683832938768, 6.433727965640796], "isController": true}, {"data": ["Sign Out", 12, 0, 0.0, 711.0833333333335, 657, 811, 688.5, 808.3, 811.0, 811.0, 1.001001001001001, 10.02076295045045, 1.8358201951951953], "isController": true}, {"data": ["Add pet to cart", 12, 0, 0.0, 248.33333333333331, 215, 316, 237.0, 307.3, 316.0, 316.0, 1.0307507301151004, 4.694747466071122, 0.6593180939701082], "isController": true}, {"data": ["Sign In-76", 12, 0, 0.0, 627.3333333333333, 218, 1446, 588.5, 1310.7000000000005, 1446.0, 1446.0, 0.9279307145066501, 3.963792578487473, 0.530569759124652], "isController": false}, {"data": ["Select Pet", 12, 0, 0.0, 233.91666666666669, 211, 319, 225.0, 301.6000000000001, 319.0, 319.0, 1.0273093057101275, 3.9406942898724426, 0.6320359986302543], "isController": true}, {"data": ["Sign In-77", 12, 0, 0.0, 246.58333333333334, 219, 318, 236.5, 312.90000000000003, 318.0, 318.0, 1.0245901639344264, 4.177906474129099, 0.9635550076844263], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 12, 100.0, 7.6923076923076925], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 156, 12, "500", 12, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Payment Confirmation-86", 12, 12, "500", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
