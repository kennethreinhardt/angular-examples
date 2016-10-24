(function () {
'use strict';

angular.module('ShoppingListCheckOff', [])
.controller('ToBuyController', ToBuyController)
.controller('AlreadyBoughtController', AlreadyBoughtController)
.service('ShoppingListCheckOffService', ShoppingListCheckOffService)
.factory('ShoppingListFactory', ShoppingListFactory)
.provider('ShoppingListService', ShoppingListServiceProvider)
.config(Config);

// Config inject
Config.$inject = ['ShoppingListServiceProvider'];
function Config(ShoppingListServiceProvider) {
  ShoppingListServiceProvider.defaults.maxItems = 2;
  ShoppingListServiceProvider.defaults.shoppingList = [
  {
    name: "Milk",
    quantity: "2"
  },
  {
    name: "Donuts",
    quantity: "20"
  },
  {
    name: "Cookies",
    quantity: "30"
  },
  {
    name: "Chocolate",
    quantity: "5"
  },
  {
    name: "Ice creme",
    quantity: "1"
  }
	];
}


// LIST #1 - controller
ToBuyController.$inject = ['ShoppingListCheckOffService'];
function ToBuyController(ShoppingListCheckOffService) {
  var list1 = this;

  // Use factory to create new shopping list service
  var shoppingList = ShoppingListCheckOffService;

  list1.items = shoppingList.getItems();

  list1.itemName = "";
  list1.itemQuantity = "";

  list1.addItem = function () {
    shoppingList.addItem(list1.itemName, list1.itemQuantity);
  };

  list1.removeItem = function (itemIndex) {
    shoppingList.removeItem(itemIndex);
  };

  list1.moveItem = function (itemIndex) {
    shoppingList.moveItem(itemIndex);
  };

  list1.isEmpty = function () {
    return (list1.items.length == 0);
  };
}


// LIST #2 - controller
AlreadyBoughtController.$inject = ['ShoppingListCheckOffService'];
function AlreadyBoughtController(ShoppingListCheckOffService) {
  var list2 = this;

  // Use factory to create new shopping list service
  var shoppingList = ShoppingListCheckOffService;

  list2.items = shoppingList.getAlreadyBoughtItems();

  list2.itemName = "";
  list2.itemQuantity = "";

  list2.addItem = function () {
    try {
      shoppingList.addItem(list2.itemName, list2.itemQuantity);
    } catch (error) {
      list2.errorMessage = error.message;
    }
  }

  list2.removeItem = function (itemIndex) {
    shoppingList.removeItem(itemIndex);
  };

  list2.isEmpty = function () {
      return (list2.items.length == 0);
  };
}


function ShoppingListProvider() {
  var provider = this;

  provider.defaults = {
    maxItems: 100,
    shoppingList: []
  };

  provider.$get = function () {
    var shoppingList = new ShoppingListService(provider.defaults.maxItems, provider.defaults.shoppingList);

    return shoppingList;
  };

}


function ShoppingListCheckOffService() {
  var service = this;

  // List of shopping items
  var items = [
    {
    name: "Milk",
    quantity: "2"
    },
    { name: "Donuts",
        quantity: "20"
      },
    {
     name: "Cookies",
     quantity: "30"
    },
    {
      name: "Ice creme",
      quantity: "1"
    },
    {
      name: "Chocolate",
      quantity: "5"
    }
  ];

  var alreadyBoughtItems = [];

  service.addItem = function (itemName, quantity) {
    var item = {
      name: itemName,
      quantity: quantity
    };
    items.push(item);
  };

  service.removeItem = function (itemIdex) {
    items.splice(itemIdex, 1);
  };

  service.getItems = function () {
    return items;
  };

  service.moveItem = function (itemIdex) {
    alreadyBoughtItems.push(items[itemIdex]);
    service.removeItem(itemIdex)
  }

  service.getAlreadyBoughtItems = function () {
    return alreadyBoughtItems;
  }
}

// If not specified, maxItems assumed unlimited
function ShoppingListService(maxItems) {
  var service = this;

  // List of shopping items
  var items = [];

  service.addItem = function (itemName, quantity) {
    if ((maxItems === undefined) ||
        (maxItems !== undefined) && (items.length < maxItems)) {
      var item = {
        name: itemName,
        quantity: quantity
      };
      items.push(item);
    }
    else {
      throw new Error("Max items (" + maxItems + ") reached.");
    }
  };

  service.removeItem = function (itemIndex) {
    items.splice(itemIndex, 1);
  };

  service.getItems = function () {
    return items;
  };
}


function ShoppingListFactory() {
  var factory = function (maxItems) {
    return new ShoppingListService(maxItems);
  };

  return factory;
}

function ShoppingListServiceProvider() {
  var provider = this;

  provider.defaults = {
    maxItems: 10
  };

  provider.$get = function () {
    var shoppingList = new ShoppingListService(provider.defaults.maxItems);

    return shoppingList;
  };
}

})();
