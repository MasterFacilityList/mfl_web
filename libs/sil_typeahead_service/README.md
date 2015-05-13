SIL Plugguble Search Service
==============================

The sil-typeahead-service is a twitter typeahead powered search utility for slade360 UIs.
It will be used to power both snomed search and api search.

## Disclamer

To use this lib, you need:

1. To have some basic understanding of snomed if you want to pull off  snomed search.
2. To have some basic understanding of twitter typeahead config

## Installation
* Download it from bower `bower install sil_typeadahead_service` 
* Add it to your build.config `vendor/src/sil_typeahead_service.js` 
* Add it as a dependancy as needed `angular.module('someModule',['sil-typeahead'])`

## Dependancies
Your project will require `underscore.js` , `twitter typeahead` , `bloodhound.js` all of which 
are shipped with `typeahead.js`

## Usage (For Non-Snomed search e.g Doctors, allergies)

You will need to do the following in your angular service:

### Make an Init function to initialize the typeahead

The initTT function is what initializes the bloodhound suggestion engine

The parameters are as follows:

* @name : the value of the input `name` attr in the `<input name="doctors" type="text">`
* @tokenize_field : the field in the payload that will be tokenized.
* @search_url: the origin of the data as a url.
* @limit: the limit of the search results shown to the user's dropdown


``` javascript

.service('searchService', ['requests', 'sil-typeahead',function (requests,typeahead) {
	var initDoctors = function () {
	    return typeahead.initTT('doctors', 'Name', makeUrl(uri_list.doctors),15);
	};
})

```

### The typeahead function that will be invokable from your controller

This is the invokable function that will initialize your typeahead for a particular input field

The params for this function:

* @fieldclass : the value of the class attr of the `<input type="text" class="doctors">`

``` javascript

this.typeaheadDoctors = function (fieldclass) {
    var f = initDoctors();  //call the init function you created above
    var name = fieldclass || 'doctors'; //just incase its not sepecified
    typeahead.typeaheadUI(name, {  //call the typeadUI function
        displayKey: 'Name',       //the name of the field in your results to be displayed
        source: f.ttAdapter()    //standard to access the source from the adapter object
    });
}

```


You will need to do the following in your controller & your template

### Create a scope function to be accessed from the UI

``` javascript

$scope.typeaheadDocs = function () {
    _.debounce(function () {	//delay call to the service until user stops typing
        searchService.typeaheadDoctors('doctors');
    }, 500);
};

```

### In your template, call the scope function 

`<input placeholder="Enter doctor.." name="docs" ng-model="doc.Name" 
ng-click="typeaheadDocs()" class="form-control doctors col-md-12" type="text" required />`



