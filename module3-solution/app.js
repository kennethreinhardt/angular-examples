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
    menu.categories = response;
  })
  .catch(function (error) {
    console.log("Something went terribly wrong.");
  });

  menu.logMenuItems = function (searchName) {
    found = MenuSearchService.getMatchedMenuItems(searchName);
    console.log("searchName: ", searchName);
    found.then(function (response) {
      console.log(response);
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
	
	console.log("zzz");
	service.getMatchedMenuItems = function(searchName) {
		return $http({
			method: "GET",
			url: (ApiBasePath + "/menu_items.json")
		}).then( function (result) {
		
			service.foundItems = result.data;
			console.log("I getMatchedMenuItems - before: ", service.foundItems);
			
		    for (var i = 0; i < service.foundItems.menu_items.length; i++) {
		      var name = service.foundItems.menu_items[i].description;
		      if (name.indexOf(searchName) > -1) {
		        service.foundItems.menu_items.splice(i, 1);
		      }
		    }
            console.log("I getMatchedMenuItems - after: ", service.foundItems);
			 
			return service.foundItems; 
			
		});
	};
}


})();
