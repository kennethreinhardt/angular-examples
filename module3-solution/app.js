(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsListDirective);

function FoundItemsListDirective() {
  var ddo = {
    templateUrl: 'menuList.html',
    scope: {
      items: '<',
      myTitle: '@title',
      onRemove: '&'
    },
    controller: MenuListDirectiveController,
    controllerAs: '$list',
    bindToController: true
  };

  return ddo;
}


function MenuListDirectiveController() {
  var $list = this;
  
  $list.isListEmpty = function () {
    if (!($list.items === undefined)) {
      return ($list.items.length == 0);
    }
    return false
  };

  $list.remove = function (myIndex) {
    $list.onRemove({ index: myIndex });
    $list.items.splice(myIndex, 1)
  };

}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) { // NEW

  var menu = this;
  var found = MenuSearchService.getMatchedMenuItems();
  found.then(function (response) {
    menu.categories = response;
  })
  .catch(function (error) {
    console.log("Something went terribly wrong.");
  });

  menu.logMenuItems = function (searchName) {
    found = MenuSearchService.getMatchedMenuItems(searchName);
    found.then(function (response) {
      menu.categories = response
    })
    .catch(function (error) {
      console.log(error);
    })
  };

}


MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
	var service = this;

	service.getMatchedMenuItems = function(searchName) {
		return $http({
			method: "GET",
			url: (ApiBasePath + "/menu_items.json")
		}).then( function (result) {
			service.found = result.data;
			if (searchName != undefined) {
    		    for (var i = 0; i < service.found.menu_items.length; i++) {
    		      var item = service.found.menu_items[i];
    		      if (item.description === undefined || item.description === "" || 
    		          item.description.indexOf(searchName) == -1) {
    		        service.found.menu_items.splice(i, 1);
    		        i--;
    		      } 
    		    }
    		    if (searchName == "") {
    		      service.found.menu_items = []; 
    		    }
			}
			return service.found; 
		});
	};
}


})();
