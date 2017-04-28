/**
 * Created by itzik on 03/04/2017.
 */
(function () {
  'use strict';

  angular
    .module('radio-color-picker', [])
    .directive('radioColorPicker', radioColorPicker)
    .controller('radioColorpickerController', radioColorpickerController);

  function radioColorPicker() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        settings: '=settings',//content
        model: '=ngModel'
      },
      require: ['radioColorPicker', 'ngModel','md-color-picker'],
      controller: 'radioColorpickerController as RadioCPicker',
      templateUrl: 'app/core/directives/radio-color-picker/radio-color-picker.html',
      bindToController: {
        model: '=ngModel'
      },
      compile: function (tElement) {
        tElement.addClass('bon-stepper');
        return function postLink(scope, iElement, iAttrs, ctrls) {

          // var thumbnailsRadioController = ctrls[0];
          var RCP_Controller = ctrls[0];
          RCP_Controller.initModel(scope);

        }
      }

    };
  }

  function radioColorpickerController($timeout) {
    var vm = this;
    vm.scope;

    vm.settings = {
      colors: ['#123fe2', '#4455AA', '#e44864', '#e4FF64', '#000000', '#e44834', '#e40064', '#0FF000', '#000011', '#e42234']
      , layout: 'row',
      maxColors: 15,
      size: 's-64'
    };

    vm.iconSelectColor = '#FFFFFF';
    vm.md_color_picker = '#123fe2';
    vm.initModel = initModel;
    vm.openMdDialogColors = openMdDialogColors;
    vm.selectColors = selectColors;

    function initModel(scope) {
      vm.scope = scope;

      if (vm.scope.settings.layout)
        vm.settings.layout = vm.scope.settings.layout;
      if (vm.scope.settings.colors) {
        vm.settings.colors = vm.scope.settings.colors;

        angular.forEach(vm.settings.colors, function (val, index) {
          vm.settings.colors [index] = val.toUpperCase();

        })
      }
      if (vm.scope.settings.title)
        vm.settings.title = vm.scope.settings.title;
      if (vm.scope.settings.size)
        vm.settings.size = 's-' + vm.scope.settings.size;
      if (vm.scope.settings.maxColors)
        vm.settings.maxColors = vm.scope.settings.maxColors;
      while (vm.settings.colors.length > vm.settings.maxColors) {
        vm.settings.colors.shift();
      }
      vm.md_color_picker = vm.scope.model;
      addColor(vm.scope.model);

      vm.scope.$watch('RadioCPicker.md_color_picker', function (newValue, oldValue) {
        addColor(newValue);
      })

    }

    function addColor(color) {
      color = color.toUpperCase();

      if (vm.settings.colors.indexOf(color) == -1) {
        vm.settings.colors.push(color);
        if (vm.settings.colors.length > vm.settings.maxColors) {
          vm.settings.colors.shift();
        }

        // vm.scope.$apply();
      }
      selectColors(color);
    }

    function selectedIconColor() {
      var color = vm.scope.model;
      var color1 = color.substring(1);
      var num = parseInt(color1, 16),
        amt = Math.round(2.55 * -20),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
      var darkerColor = (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
      var fontColor = tinycolor.mostReadable(darkerColor, ['#ffffff', '#000000', '#808080'], null).toHexString();
      vm.iconSelectColor = fontColor;

    }

    function selectColors(color) {
      vm.scope.model = color;
      selectedIconColor();
    }

    function openMdDialogColors() {
      $timeout(function () {
        angular.element($('#RadioCPicker_md-color-picker .md-color-picker-result')).trigger('click');
      })

    }
  }

})();
