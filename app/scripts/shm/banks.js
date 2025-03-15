angular
  .module('shm_banks', [
  ])
  .service('shm_banks', ['$modal', 'shm', 'shm_request', function($modal, shm, shm_request) {
    this.edit = function(row, title) {
        return $modal.open({
            templateUrl: 'views/bank_edit.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title || 'Редактирование банка';
                $scope.data = angular.copy(row);
                $scope.data.deleted = 0;
                var url = 'v1/admin/user/bank';

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    shm_request( $scope.data.bank_id ? 'POST_JSON' : 'PUT_JSON', url, $scope.data ).then(function(response) {
                        $modalInstance.close( response.data.data );
                    });
                };

                $scope.delete = function () {
                    shm_request('DELETE', url, { bank_id: row.bank_id } ).then(function() {
                        $modalInstance.dismiss('delete');
                    })
                };

            },
            size: 'lg',
        });
    };
  }])
  .controller('ShmBanksController', ['$scope', 'shm_banks', function($scope, shm_banks) {
    'use strict';

    var url = 'v1/admin/user/bank';
    $scope.url = url;
    $scope.parent_key_id = 'bank_id';

    $scope.columnDefs = [
        { field: 'bank_id', width: 100 },
        { field: 'bank_name_base', displayName: 'Банк', width: 120 },
        { field: 'bank_city', displayName: 'Город', width: 120 },
        { field: 'bic_base', displayName: 'БИК', width: 120 },
        { field: 'correspondent_account_base', displayName: 'Корреспондентский счёт', width: 120 },
    ];

    $scope.add = function() {
        var row = {};

        shm_banks.edit(row, 'Создание профиля банка').result.then(function(data){
            data.$$treeLevel = 0;
            $scope.gridOptions.data.push( data );
        }, function(cancel) {
        });
    };

    $scope.row_dbl_click = function(row) {
        shm_banks.edit(row).result.then(function(data){
            delete row.$$treeLevel;
            angular.extend( row, data );
        }, function(resp) {
            if ( resp === 'delete' ) {
                $scope.gridOptions.data.splice( $scope.gridOptions.data.indexOf( row ), 1 );
            }
        });
    }

  }]);
