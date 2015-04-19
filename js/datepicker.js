var booking = angular.module('booking', []);

booking.controller('bookingController', function ($scope, book) {
    $scope.difference = 0;
    $scope.rooms = false;

    $scope.book = book;

});

booking.factory('book', function ($window) {

    return {
        from: moment(),
        to: moment(),
        rooms: [{
            adults: 1,
            childsNum: 0,
            childs: []
        }],
        addRoom: function () {
            this.rooms.push({
                adults: 1,
                childsNum: 0,
                childs: []
            });
        },
        generateChildren: function (room) {
            room.childs = [];
            for (var i = 0; i < room.childsNum; i++) {
                room.childs.push({
                    age: 1
                });
            }
        },
        removeRoom: function (index) {
            if (this.rooms.length == 1) {
                return;
            }
            this.rooms.splice(index, 1);
        },
        verify: function (caId, hoId) {
            var staticAddress = 'https://secure.hermeshotels.com/bol/dispo.do?';
            var caId = caId;
            var hoId = hoId;
            var offerta = 0;
            var lang = 2;

            staticAddress += 'caId=' + caId + '&hoId=' + hoId + '&lang=2';
            staticAddress += '&dataDa=' + this.from.format("L") + '&dataA=' + this.to.format("L");
            staticAddress += '&num_cam=' + this.rooms.length;
            this.rooms.forEach(function (room, roomIndex) {
                staticAddress += '&num_ad=' + room.adults;
                if (room.childsNum > 0) {
                    staticAddress += '&num_chd=' + room.childsNum;
                    room.childs.forEach(function (child, index) {
                        staticAddress += '&eta_chd' + (roomIndex + 1) + '=' + child.age;
                    });
                } else {
                    staticAddress += '&num_chd=0';
                }
            });

            staticAddress += '&idOfferta=' + offerta;

            console.log(staticAddress);
            $window.open(staticAddress);

        }
    }

});

booking.directive('bookingRoomDirective', function () {

    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            elem.on('click', function () {
                elem.find('.room-detail').show();
            });
        }
    }

});

booking.directive('bookingCalendarDirective', function () {

    return {
        restrict: 'A',
        scope: {
            'checkIn': '=',
            'checkOut': '=',
            'difference': '='
        },
        link: function (scope, elem, attrs) {
            var dates = $(elem).datepicker({
                numberOfMonths: 2,
                onSelect: function (selectedDate) {
                    //reset dates
                    if (scope.checkIn && scope.checkOut) {
                        scope.checkIn = null;
                        scope.checkOut = null;
                    }

                    if (scope.checkIn == null) {
                        scope.checkIn = moment(selectedDate);
                        $(elem).datepicker("option", "minDate", selectedDate);
                        scope.$apply();
                    } else {
                        scope.checkOut = moment(selectedDate);
                        $(elem).datepicker("option", "maxDate", selectedDate);
                        scope.difference = scope.checkOut.diff(scope.checkIn, 'days');
                        $(elem).val('').datepicker('option', {
                            minDate: null,
                            maxDate: null
                        });
                        scope.$apply();
                    }
                },
                beforeShowDay: function (date) {
                    if (date >= scope.checkIn && date <= scope.checkOut) {
                        return [true, 'ui-state-selected', 'ui-state-selected'];
                    }
                    return [true, '', ''];
                }
            });
        }
    };

});