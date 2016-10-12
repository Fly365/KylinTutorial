function submitQuery() {
  $.ajaxSetup({
    headers: {
      'Authorization': "",
      'Content-Type': 'application/json;charset=utf-8'
    }
  });

  var _data = {
    "acceptPartial": "true",
    "limit"        : "50000",
    "offset"       : "0",
    "project"      : "ssb",
    "sql"          : "select minute_start, sum(vict) as vicount from seo_sessions_fact_nous group by minute_start order by minute_start desc"
  };

  var request = $.ajax({
    // url: "http://kylin-stream.corp.ebay.com/kylin/api/query",
    url: "http://demokap1.chinacloudapp.cn:7070/kylin/api/query",
    type: "POST",
    data: JSON.stringify(_data)
  });

  request.done(function (msg) {
    var tablediv = document.getElementById("result-table-div");
    //alert(tablediv.class);
    var table = document.getElementById("result-table");
    table.style.display = "block";
    table.style.height = "400px";
    var rownum = msg.results[0].length;
    for (var i = 0; i < msg.results.length; i++) {
      var tr = table.insertRow(0);//添加一行
      for (var j = 0; j < rownum; j++) {
        var td = tr.insertCell(0);//添加一列
        td.innerHTML = msg.results[i][j];//为单元格写入文本内容
      }
    }
  });

  request.fail(function (jqXHR, textStatus) {
    alert("Request failed: " + textStatus);
  });
}