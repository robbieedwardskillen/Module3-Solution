(function(){

'use strict';
angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com");

function FoundItemsDirective(){
	var ddo = {
		templateUrl: 'itemsloaderindicator.template.html',
		scope: { 
			empty: '<',
			found: '<',
			onRemove: '&'
		},
		controller: FoundItemsDirectiveController,
		controllerAs: 'list',
		bindToController: true,
		link: FoundItemsDirectiveLink
	};
	return ddo;
}
function FoundItemsDirectiveLink(scope, element, attrs, controller){
	scope.$watch('list.empty', function(newValue, oldValue){
		if(newValue === true){
			displayEmptyWarning();
		}
		else{
			removeEmptyWarning();
		}
		function displayEmptyWarning(){
			var warningElem = element.find("div.error");
			warningElem.slideDown(900);
		}
		function removeEmptyWarning(){
			var warningElem = element.find("div.error");
			warningElem.slideUp(900);
		}
	})
}
function FoundItemsDirectiveController(){
	var list = this;
}
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService){
	
	var viewList = this;

	viewList.itemName = "";
	viewList.foundItems = [];
	viewList.empty = false;

	viewList.update = function(){
		MenuSearchService.removeAll();
		if (viewList.itemName === ""){
			viewList.empty = true;
		}
		else{
			viewList.empty = false;
			var promise = MenuSearchService.getMatchedMenuItems(viewList.itemName)
			.then(function(result){
				viewList.foundItems = result;
				
			}).catch(function(error){
				return error;
			});
		}
	};
	viewList.removeItem = function(itemIndex){
		MenuSearchService.removeItem(itemIndex);
	};
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath){
	var service = this;
	var foundItems = [];
	service.getMatchedMenuItems = function(searchTerm){
		return $http({
			method: "GET",
			url: (ApiBasePath + "/categories.json"),
			params: {
				category: searchTerm
			}
		}).then(function(result){
			var allItems = result.data;
			
			for (var i = 0; i < allItems.length; i++){
				if (allItems[i].name.toLowerCase().indexOf(searchTerm.toLowerCase()) === -1){
				}
				else{
					foundItems.push(allItems[i]);
				}
			}
			return foundItems;
		}).catch(function(error){
			return error;
		});
	};
	service.removeItem = function(itemIndex){
		foundItems.splice(itemIndex, 1);
	};
	service.removeAll = function(){
		foundItems.splice(0, foundItems.length);
	};
}

})();