
angular.module("imgurapp", []).controller("imgurController", function($scope, $http, $httpParamSerializer) {

    $scope.mydata = {
        response: {},
        client: {},
        images: [],
        disabled: false,
        exportdata: {
            flag: false,
            data: {}
        }
    };

    $http.get('json/client.json').success(function(data) {

        $scope.mydata.client = angular.fromJson(data);
        $scope.$$phase || $scope.$apply();
    });

    $scope.mydata.setImage = function(file) {

        if (file) {

            var reader = new FileReader();
            reader.readAsBinaryString(file, "UTF-8");
            reader.onload = function(evt) {

                $scope.mydata.image = btoa(evt.target.result);
            }
            reader.onerror = function(evt) {

                $scope.mydata.response = {
                    status: "error",
                    error: true,
                    text: "error reading file"
                };
            }
        }

        $scope.$$phase || $scope.$apply();
    };

    $scope.mydata.exportinfo = function() {

        $scope.mydata.exportdata.data = angular.toJson($scope.mydata.images);
        $scope.mydata.exportdata.flag = true;
        $scope.$$phase || $scope.$apply();
    };
    
    /* function inside function oh js kkk */
    $scope.mydata.exportinfo.close = function() {

        $scope.mydata.exportdata.flag = false;
        $scope.$$phase || $scope.$apply();
    };

    $scope.mydata.doClick = function(item, event) {

        $scope.mydata.disabled = true;
        var params = {
            method: 'post',
            url: "https://api.imgur.com/3/upload",
            data: $httpParamSerializer({
                "image": $scope.mydata.image
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Client-ID ' + $scope.mydata.client.id
            }
        };

        var responsePromise = $http(params);

        responsePromise.success(function(response) {

            var response = angular.fromJson(response);
            $scope.mydata.response = {
                status: "success",
                error: false,
                text: "Success!!"
            };
            $scope.mydata.images.push(response.data);
            $scope.$$phase || $scope.$apply();
            $scope.mydata.disabled = false;
        });

        responsePromise.error(function(data, status, headers, config) {

            $scope.mydata.response = {
                status: "error",
                error: true,
                text: data.data.error
            };
            $scope.mydata.disabled = false;
        });
    }

});

