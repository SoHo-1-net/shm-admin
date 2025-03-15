angular.module('shm_banks_select', [])
.value('bank_list_shared', {
    'add_item': null,
})
.directive('banksList', ['bank_list_shared', 'shm_request', function (bank_list_shared, shm_request) {
    return {
        restrict: 'E',
        scope: {
            data: '=?data',
            id: '=?id',     
        },
        link: function ($scope, $element, $attrs) {
            $scope.readonly = 'readonly' in $attrs;

            var request = 'v1/admin/user/bank';
            var args = { limit: 0 };
            var key_field = 'bank_id';

            if ($scope.readonly && $scope.id) {
                args[key_field] = $scope.id;
            }

            shm_request('GET', request, args).then(function (response) {
                var data = response.data.data;
                if (!data) return;

                $scope.items = data;

                if ($scope.id) {
                    var found = data.find(function (item) {
                        return item[key_field] == $scope.id;
                    });
                    if (found) $scope.data = found;
                }
            });

            $scope.$watch('id', function (newValue) {
                if (!$scope.items) return;
                var found = $scope.items.find(function (item) {
                    return item[key_field] == newValue;
                });
                if (found) $scope.data = found;
            });

            $scope.$watch('data', function (newValue) {
                if (newValue) {
                    $scope.id = newValue[key_field];
                }
            });

            bank_list_shared.add_item = function (newBank) {
                $scope.items.push(newBank);
                $scope.id = newBank[key_field];
            };
        },
        templateUrl: "views/shm/modules/banks-list/select.html"
    };
}])
.directive('banksListAdd', ['bank_list_shared', 'shm_banks', function (bank_list_shared, shm_banks) {
    return {
        restrict: "E",
        scope: {},
        controller: function ($scope) {
            $scope.add = function () {
                shm_banks.add().then(function (newBank) {
                    bank_list_shared.add_item(newBank);
                }, function () {
                });
            };
        },
        template: '<a ng-click="add()" class="btn btn-default" title="Добавить банк"><i class="ti ti-plus"></i></a>'
    };
}]);


