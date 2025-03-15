angular
  .module('shm_profiles', [
    'shm_banks_select' 
  ])
  .service('shm_profiles', ['$modal', 'shm', 'shm_request', function($modal, shm, shm_request) {
    this.edit = function(row, title) {
        return $modal.open({
            templateUrl: 'views/profile_edit.html',
            controller: function ($scope, $modalInstance, $modal) {
                $scope.title = title || 'Редактирование';
                $scope.data = angular.copy(row);
                $scope.data.deleted = 0;
                $scope.data.settings = $scope.data.settings || {};
                $scope.data.passport = $scope.data.passport || '0000 000000, выдан МВД РФ, дата выдачи 01.01.2000, код подразделения 000-000';
 
                var url = 'v1/admin/user/profile';

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.save = function () {
                    //console.log('Отправляемые данные:', $scope.data);
                    shm_request( $scope.data.id ? 'POST_JSON' : 'PUT_JSON', url, $scope.data ).then(function(response) {
                        $modalInstance.close( response.data.data );
                    });
                };

                $scope.delete = function () {
                    shm_request('DELETE', url, { id: row.id } ).then(function() {
                        $modalInstance.dismiss('delete');
                    })
                };

            },
            size: 'lg',
        });
    };
  }])
  .controller('ShmProfilesController', ['$scope', 'shm_profiles', function($scope, shm_profiles) {
    'use strict';

    var url = 'v1/admin/user/profile';
    $scope.url = url;
    $scope.parent_key_id = 'id';

    $scope.columnDefs = [
        { field: 'id', width: 100 },
        { field: 'user_id', displayName: 'UID', width: 100 },
        { field: 'passport', displayName: 'Паспорт', width: 150 },
        { field: 'address_actual', displayName: 'Фактический адрес', width: 200 },
        { field: 'phone', displayName: 'Телефон', width: 150 },
        { field: 'email', displayName: 'Email', width: 200 },
        { field: 'contract_number', displayName: 'Контактный номер телефона', width: 150 },
        { field: 'address_registration', displayName: 'Адрес регистрации', width: 200 },
        { field: 'inn', displayName: 'ИНН', width: 120 },
        { field: 'kpp', displayName: 'КПП', width: 120 },
        { field: 'ogrn', displayName: 'ОГРН', width: 150 },
        { field: 'actual_address', displayName: 'Актуальный адрес', width: 200 },
        { field: 'legal_address', displayName: 'Юридический адрес', width: 200 },
        { field: 'mail_address', displayName: 'Почтовый адрес', width: 200 },
        { field: 'contact_phone', displayName: 'Контактный телефон', width: 150 },
        { field: 'email_invoice', displayName: 'Email для счёта', width: 200 },
        { field: 'director_name', displayName: 'Генеральный директор', width: 200 },
        { field: 'chief_accountant', displayName: 'Главный бухгалтер', width: 200 },
        { field: 'bank_account', displayName: 'Рассчётный счёт', width: 150 },
        { field: 'bank_id', displayName: 'Банк', width: 150 },
        { field: 'data' },
    ];
    $scope.add = function() {
        var row = {
            bank_id: null,
            data: {
                individual: {
                    email: "",
                    phone: "",
                    passport: {
                        number: "",
                        series: "",
                        issued_by: "",
                        issue_date: "",
                        division_code: ""
                    },
                    full_name: "",
                    is_active: true,
                    citizenship: "Российская Федерация",
                    date_of_birth: "",
                    address_actual: "",
                    contract_number: "",
                    address_registration: ""
                },
                legal_entity: {
                    INN: "",
                    KPP: "",
                    OGRN: "",
                    email: "",
                    is_active: false,
                    bank_details: {
                        BIC: "",
                        bank: "",
                        account: "",
                        correspondent_account: ""
                    },
                    company_name: "",
                    contact_phone: "",
                    director_name: "",
                    legal_address: "",
                    actual_address: "",
                    contract_number: "",
                    chief_accountant: ""
                }
            }
        };
    
        shm_profiles.edit(row, 'Создание профиля').result.then(function(data){
            data.$$treeLevel = 0;
            $scope.gridOptions.data.push( data );
        }, function(cancel) {
        });
    };

    $scope.row_dbl_click = function(row) {
        shm_profiles.edit(row).result.then(function(data){
            delete row.$$treeLevel;
            angular.extend( row, data );
        }, function(resp) {
            if ( resp === 'delete' ) {
                $scope.gridOptions.data.splice( $scope.gridOptions.data.indexOf( row ), 1 );
            }
        });
    }

  }]);
