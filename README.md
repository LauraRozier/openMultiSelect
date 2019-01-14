**openMultiSelect** provides a multi-select that is compatible with MDBootstrap for Bootstrap v4.

## Navigation

- [Disclaimer](#disclaimer)
- [License](#license)
- [Special Thanks](#special-thanks)
- [Data Format](#data-format)
- [Configuration](#configuration)
- [Public Methods](#public-methods)
  - [Available Methods](#available-methods)
- [Preview](#preview)

## Disclaimer

This plugin is a one-man job and is developed separately from any other projects. The only help I had was by testing and feedback. I used the MDBootstrap and Bootstrap v4 SCSS variables and mixins to try and stick as closely as possible to their styles for future compatibility. If there are any issues and/or suggestions, feel free to contact me via an issue on this project or email. (Can be found in the file headers.)

## License

`"THE BEER-WARE LICENSE" (Revision 44)` See the file headers for more information. It's pretty much PD.

## Special Thanks

- [MDBootstrap](https://mdbootstrap.com/) For improving Bootstrap 4 and providing their own UI elements/styling.
- [Bootstrap](https://getbootstrap.com/) For being an awesome UI framework.
- [jQuery](https://jquery.com/) For being an awesome JS framework.
- [jQuery Boilerplate](https://jqueryboilerplate.com/) For being an awesome boilerplate.
- [Smoking Rifles](https://smoking-rifles.co.uk/) For being awesome and a great test audience during development.

## Data Format

openMultiSelect requires the data to be provided in a specific manner. Below you will find the data format for both the `AvailableItems` and `SelectedItems` methods.

AvailableItems data format:
```js
[
  { "text": "item 1", "value": "i1" },
  { "text": "item 1", "value": "i2" },
  // etc..
]
```

SelectedItems data format:
```js
[
  "i1", "i2", // etc..
]
```

## Configuration

The configuration can be modified via either setting `$.fn.openMultiSelect.defaults` before initializing openMultiSelect, by passing the configuration when initializing openMultiSelect or by calling the `setConfig` method.

The configuration object:
```js
{
  "name": "name-for-form-data",
  "ajax": {
    "availableUrl": "https://exampe.com/api/v1/groups/available",
    "selectedUrl": "https://exampe.com/api/v1/user/1/groups",
    "method": "GET",
  },
  "availableItemColor": "red",
  "selectedItemColor": "green",
  "buttonColor": "primary",
  "headerColor": "mdb-color",
}
```

$.fn.openMultiSelect.defaults:
```js
{
  "name": "oms-value-input",
  "ajax": null,
  "availableItemColor": "red",
  "selectedItemColor": "green",
  "buttonColor": "primary",
  "headerColor": "mdb-color",
}
```

## Public Methods

After initializing openMultiSelect you are able to call it's public methods. Public methods are called as shown below:
```js
$("#oms-div").openMultiSelect(
  "someMethod",
  "String Arg",
  [
    "Array Arg",
  ],
  {
    "Object": "Arg"
  },
  // etc..
);
```

### Available Methods

#### reloadAvailableItems

Reload the available items

Parameters:
- `aUrl: string` Sets the new URL to use when reloading the available items. Pass `null` to keep the original url. Default: `null`
- `aIndRedraw: boolean` Indicates that the element should be redrawn on success. Default: `true`

Examples:
```js
$("#oms-div").openMultiSelect("reloadAvailableItems");

$("#oms-div").openMultiSelect(
  "reloadAvailableItems",
  "https://exampe.com/api/v1/groups/available"
);

$("#oms-div").openMultiSelect(
  "reloadAvailableItems",
  "https://exampe.com/api/v1/groups/available",
  true
);
```

#### reloadSelectedItems

Reload the selected items

Parameters:
- `aUrl: string` Sets the new URL to use when reloading the selected items. Pass `null` to keep the original url. Default: `null`
- `aIndRedraw: boolean` aIndRedraw Indicates that the element should be redrawn on success. Default: `true`

Examples:
```js
$("#oms-div").openMultiSelect("reloadSelectedItems");

$("#oms-div").openMultiSelect(
  "reloadSelectedItems",
  "https://exampe.com/api/v1/user/1/groupids"
);

$("#oms-div").openMultiSelect(
  "reloadSelectedItems",
  "https://exampe.com/api/v1/user/1/groupids",
  true
);
```

#### reloadItems

Reload both the available and selected items

Parameters:
- `aAvailableUrl: string` Sets the new URL to use when reloading the available items. Pass `null` to keep the original url. Default: `null`
- `aSelectedUrl: string` Sets the new URL to use when reloading the selected items. Pass `null` to keep the original url. Default: `null`
- `aIndRedraw: boolean` Indicates that the element should be redrawn on success. Default: `true`

Examples:
```js
$("#oms-div").openMultiSelect("reloadItems");

$("#oms-div").openMultiSelect(
  "reloadItems",
  "https://exampe.com/api/v1/groups/available"
);

$("#oms-div").openMultiSelect(
  "reloadItems",
  null,
  "https://exampe.com/api/v1/user/1/groupids",
  true
);
```

#### resetSelection

Reset the list of selected items to it's initial value

Parameters:
- None

Examples:
```js
$("#oms-div").openMultiSelect("resetSelection");
```

#### clearItems

Clear the lists and reset the value input element

Parameters:
- None

Examples:
```js
$("#oms-div").openMultiSelect("clearItems");
```

#### setAvailableItems

Set the available items

Parameters:
- `aItems: array` An array of all the available items
- `aIndRedraw: boolean` Indicates that the element should be redrawn

Examples:
```js
$("#oms-div").openMultiSelect(
  "setAvailableItems",
  [
    { text: "test1", value: "t1" },
    { text: "test2", value: "t2" },
    { text: "test3", value: "t3" },
    { text: "test4", value: "t4" },
    { text: "test5", value: "t5" },
  ]
);
```

#### setSelectedItems

Set the selected and initial items

Parameters:
- `aItems: array` An array of the selected (bound) items
- `aIndRedraw: boolean` Indicates that the element should be redrawn

Examples:
```js
$("#oms-div").openMultiSelect(
  "setSelectedItems",
  [ "t2", "t5", ]
);
```

#### setItems

Reload both the available and selected items

Parameters:
- `aAvailableItems: array` An array of all the available items
- `aSelectedItems: array` An array of the selected (bound) items
- `aIndRedraw: boolean` Indicates that the element should be redrawn

Examples:
```js
$("#oms-div").openMultiSelect(
  "setItems",
  [
    { text: "test1", value: "t1" },
    { text: "test2", value: "t2" },
    { text: "test3", value: "t3" },
    { text: "test4", value: "t4" },
    { text: "test5", value: "t5" },
  ],
  [ "t2", "t5", ]
);
```

#### getConfig

Retrieve the active configuration for this instance

Parameters:
- None

Returns:
- `Object`

Examples:
```js
const config = $("#oms-div").openMultiSelect("getConfig");
```

#### setConfig

Modify this instance's configuration

Parameters:
- `aOptions: Object` The options to set/change
- `aIndReload: boolean` Indicates that the items shopuld be reloaded
- `aIndRedraw: boolean` Indicates that the element should be redrawn

Examples:
```js
$("#oms-div").openMultiSelect(
  "setConfig",
  { name: "newInputName" },
  false,
  true
);

$("#oms-div").openMultiSelect(
  "setConfig",
  {
    name: "oms-value-input",
    ajax: {
      availableUrl: "https://exampe.com/api/v1/groups/available",
      selectedUrl: "https://exampe.com/api/v1/user/1/groupids",
      method: "GET",
    },
    availableItemColor: "red",
    selectedItemColor: "green",
    buttonColor: "primary",
    headerColor: "mdb-color",
  },
  true,
  true
);
```

#### destroy

Restore the DOM element to it's original state by unloading the plugin.

Parameters:
- None

Examples:
```js
$("#oms-div").openMultiSelect("destroy");
```

## Preview

There is a full exampel available, which loads 1000 items via a public method: [Example](../blob/master/examples/testMultiSelect.php)

##### Default config:

![Default config](https://github.com/thibmo/openMultiSelect/blob/master/examples/default_config.png?raw=true "Default config")

##### Output data:

![Output data](https://github.com/thibmo/openMultiSelect/blob/master/examples/output_data.png?raw=true "Output data")
