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
    console.log("Cookies in list", $list);
    if (!($list.items === undefined)) {
        console.log("lists is not undefined");
        if ($list.items.length == 0) {
          console.log("True");
          return true;
          
        } else {
          console.log("False")
          return false;
        }
    }
 
    return false;
  };

  $list.remove = function (myIndex) {
    $list.onRemove({ index: myIndex });
    console.log("Remove index of list", myIndex);
    console.log($list);
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

	service.getMatchedMenuItems = function(searchName) {
		return $http({
			method: "GET",
			url: (ApiBasePath + "/menu_items.json")
		}).then( function (result) {
			service.foundItems = result.data;
			if (searchName != undefined) {
    		    for (var i = 0; i < service.foundItems.menu_items.length; i++) {
    		      var item = service.foundItems.menu_items[i];
    		      if (item.description === undefined || item.description === "" || 
    		          item.description.indexOf(searchName) == -1) {
    		        service.foundItems.menu_items.splice(i, 1);
    		        i--;
    		      } 
    		    }
    		    if (searchName == "") {
    		      service.foundItems.menu_items = []; 
    		    }
			}
			return service.foundItems; 
		});
	};
}


})();
