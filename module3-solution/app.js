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
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}


function MenuListDirectiveController() {
  var list = this;

  list.cookiesInList = function () {
    if (!(list.items == undefined || list.items.menu_items === undefined)) {
      console.log("LIST: ", list);
      console.log("My debug: ", list.items.menu_items.length);
      for (var i = 0; i < list.items.menu_items.length; i++) {
        var name = list.items.menu_items[i].name;
        if (name.toLowerCase().indexOf("cookie") !== -1) {
          return true;
        }
      }
    }
 
    return false;
  };
}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) { // NEW

  var menu = this;
  console.log("aaa");
  var found = MenuSearchService.getMatchedMenuItems();
  console.log("yyy");
  found.then(function (response) {
    menu.categories = response.data;
  })
  .catch(function (error) {
    console.log("Something went terribly wrong.");
  });

  menu.logMenuItems = function (shortName) {
    var found = MenuSearchService.getMatchedMenuItems(searchName);
    console.log("shortName: ", shortName);
    found.then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    })
  };

}


MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
	var service = this;
	console.log("zzz");
	service.getMatchedMenuItems = function (searchName) {
		return $http({
			method: "GET",
			url: (ApiBasePath + "/menu_items.json")
		}).then( function (result) {
		
			service.foundItems = result;
			console.log("I getMatchedMenuItems", service.foundItems);
			
		    for (var i = 0; i < service.foundItems.data.menu_items.length; i++) {
		      var name = service.foundItems.data.menu_items[i].name;
		      console.log("Name: ", name);
		    }
			
			return service.foundItems; 
			
		});
		
	};
}


})();
