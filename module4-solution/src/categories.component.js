(function () {
'use strict';

angular.module('Components')
.component('components', {
  templateUrl: 'src/shoppinglist/templates/shoppinglist.template.html',
  bindings: {
    items: '<'
  }
});

})();
