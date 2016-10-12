var stepApp = angular.module('stepApp', []);
stepApp.controller('stepCtrl', function ($scope, $http) {
  $scope.firstName = "John";
  $scope.lastName = "Doe";
});

stepApp.controller('gridCtrl', function ($scope, $http, $domUtilityService, $tokenConfig) {
  $scope.myData = [];
  $scope.myCol = [];

  $scope.members = [
    {name: "Moroni", age: 50},
    {name: "Tiancum", age: 43},
    {name: "Jacob", age: 27},
    {name: "Nephi", age: 29},
    {name: "Enos", age: 34}
  ];

  $scope.mem = [
    {name2: "Moroni", age2: 50},
    {name2: "Enos", age2: 34}
  ];

  $scope.gridOptions = {
    data      : 'myData',
    columnDefs: 'myCol'
  };

  $scope.show = function () {
    $scope.resultGrid.style.display = "block";
    $scope.myData = $scope.members;
  };

  $scope.show2 = function () {
    $scope.resultGrid.style.display = "block";
    $scope.myData = $scope.mem;
  };

  $scope.ss = "sds";

  $scope.change = function () {
    $scope.ss = "ddd";
  };

  $scope.queryState = false;

  $scope.resultGrid = document.getElementById("result-grid");

  $scope.refreshUi = function () {
    $scope.gridOptions.$gridServices.DomUtilityService.RebuildGrid(
      $scope.gridOptions.$gridScope,
      $scope.gridOptions.ngGrid);
  };

  $scope.submitQuery = function () {
    $scope.resultGrid.style.display = "none";
    $scope.queryState = true;

    var queryString = document.getElementById("queryarea").value;
    var _data = {
      "acceptPartial": "true",
      "limit"        : "50000",
      "offset"       : "0",
      "project"      : "airline",
      "sql"          : queryString
    };

    var req = {
      method : 'POST',
      url    : 'http://10.9.145.178:7070/kylin/api/query',
      data   : JSON.stringify(_data),
      headers: {
        'Authorization': $tokenConfig.auth,
        'Content-Type' : 'application/json;charset=utf-8'
      }
    };

    $http(req).success(
      function (response) {
        $scope.restime = response.duration;

        var data = [];
        angular.forEach(response.results, function (row, index) {
          var oneRow = {};
          angular.forEach(response.columnMetas, function (meta, metaIndex) {
            oneRow[meta.name] = row[metaIndex];
          });
          data.push(oneRow);
        });

        var columnDefs = [];
        angular.forEach(response.columnMetas, function (meta, metaIndex) {
          columnDefs.push({field: meta.name, width: 120});
        });

        $scope.myData = data;
        $scope.myCol = columnDefs;
        $scope.queryState = false;
        $scope.resultGrid.style.display = "block";
      }).error(function (data, status) {
      alert(data.exception);
    });
  }
});