/**
 * @license
 * Open Multi Select for MDBootstrap
 * Version: 1.0.0
 *
 *
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 44):
 * Author: Thimo Braker <thibmorozier@gmail.com>
 * File: openMultiSelect.js
 *
 * As long as you retain this notice anywhere in the file and/or the file's
 * directory you can do whatever you want with this stuff. If we meet someday,
 * and you think this stuff is worth it, you can buy me a beer in return.
 * ----------------------------------------------------------------------------
 *
 *
 * Documentation: https://github.com/thibmo/openMultiSelect
 *
 * Support: https://github.com/thibmo/openMultiSelect
 *
 * Contact: contact@kp-wiki.org
 *
 * Atribution: MDBootstrap, Bootstrap 4, jQuery
 *
 */
// eslint-disable-next-line no-extra-semi
;(function($, window, document, undefined) {
  /**
   * The semi-colon before function invocation is a safety net against
   * concatenated scripts and/or other plugins which may not be closed
   * properly.
   *
   * undefined is used here as the undefined global variable in ECMAScript 3
   * is mutable (ie. it can be changed by someone else). undefined isn't
   * really being passed in so we can ensure the value of it is truly
   * undefined. In ES5, undefined can no longer be modified.
   */

  "use strict";

  // #region Constants
  /**
   * The namespace of this plugin
   *
   * @constant {string} PLUGIN_NAMESPACE
   *
   * @author  Thimo Braker <thibmorozier@gmail.com>
   * @version 1.0.0
   */
  const PLUGIN_NAMESPACE = "openMultiSelect";

  /**
   * The DOM element data key based on the namespace of this plugin
   *
   * @constant {string} PLUGIN_NAMESPACE_DATA
   *
   * @author  Thimo Braker <thibmorozier@gmail.com>
   * @version 1.0.0
   */
  const PLUGIN_NAMESPACE_DATA = "plugin_" + PLUGIN_NAMESPACE;

  /**
   * The default value for the items
   *
   * @constant {Object} ITEMS_DEFAULTS
   *
   * @author  Thimo Braker <thibmorozier@gmail.com>
   * @version 1.0.0
   */
  const ITEMS_DEFAULTS = {
    /**
     * The initial selection
     *
     * @property initial
     * @type {array}
     * @default []
     */
    initial: [],
    /**
     * The available items
     *
     * @property available
     * @type {array}
     * @default []
     */
    available: [],
    /**
     * The selected items
     *
     * @property selected
     * @type {array}
     * @default []
     */
    selected: [],
  };

  /**
   * The default value for the ajax settings
   *
   * @constant {Object} AJAX_DEFAULTS
   *
   * @author  Thimo Braker <thibmorozier@gmail.com>
   * @version 1.0.0
   */
  const AJAX_DEFAULTS = {
    /**
     * The API endpoint to use when for retrieving the available options
     *
     * @property availableUrl
     * @type {string}
     * @default ""
     */
    availableUrl: "",
    /**
     * The API endpoint to use when for retrieving the selected options
     *
     * @property selectedUrl
     * @type {string}
     * @default ""
     */
    selectedUrl: "",
    /**
     * The method to use when retrieving data from either API
     *
     * @property method
     * @type {string}
     * @default "GET"
     */
    method: "GET",
  };
  // #endregion Constants

  /**
   * The openMultiSelect class.
   *
   * @class
   *
   * @param {HTMLElement} aElement The element that this instance is bound to
   * @param {Object} aOptions The options to use for this instance
   *
   * @author  Thimo Braker <thibmorozier@gmail.com>
   * @version 1.0.0
   */
  function Plugin(aElement, aOptions) {
    // #region Fields
    /**
     * Holds the name of the plugin
     *
     * @var {string} _name
     */
    this._name = PLUGIN_NAMESPACE;
    /**
     * Holds the settings for this plugin instance
     *
     * @var {Object} settings
     */
    this.settings = $.extend(
        true,
        {},
        $.fn.openMultiSelect.defaults,
        aOptions
    );
    /**
     * Holds the DOM element for this plugin instance
     *
     * @var {HTMLElement} element
     */
    this.element = aElement;
    /**
     * Holds the name for this plugin instance
     *
     * @var {Object} element
     */
    this.$element = $(this.element);
    /**
     * Holds the name for this plugin instance
     *
     * @var {Object} valueElement
     */
    this.valueElement = null;
    /**
     * Holds the name for this plugin instance
     *
     * @var {Object} availableElement
     */
    this.availableElement = null;
    /**
     * Holds the name for this plugin instance
     *
     * @var {Object} selectedElement
     */
    this.selectedElement = null;
    /**
     * Holds the name for this plugin instance
     *
     * @var {Object} buttonElement
     */
    this.buttonElement = null;
    /**
     * Holds the name for this plugin instance
     *
     * @var {Object} items
     */
    this.items = ITEMS_DEFAULTS;
    // #endregion Fields

    this.init();
  }

  $.extend(Plugin.prototype, {
    // #region Utility methods
    /**
     * Remove an item from the array
     *
     * @method removeFromArray
     *
     * @param {array} aArray The array
     * @param {any} aValue The value to remove
     * @return {array}
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    arrayRemove: function(aArray, aValue) {
      return aArray.filter(function(item) {
        return item !== aValue;
      });
    },

    /**
     * Determine if an item exists within an array
     *
     * @method arrayContains
     *
     * @param {array} aNeedle The value to find
     * @param {any} aHaystack The array
     * @return {boolean}
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    arrayContains: function(aNeedle, aHaystack) {
      for (let i in aHaystack) { // eslint-disable-line prefer-const
        if (aHaystack[i] === aNeedle) return true;
      }

      return false;
    },
    // #endregion Utility methods

    // #region Callbacks
    /**
     * Select event callback
     *
     * @method cbSelectItem
     *
     * @param {Event} aEvent The callback event object
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    cbSelectItem: function(aEvent) {
      aEvent.preventDefault();
      aEvent.stopImmediatePropagation();

      const $caller = $(aEvent.target).removeClass(
          "oms-item-" + aEvent.data.settings.availableItemColor
      ).addClass(
          "oms-item-" + aEvent.data.settings.selectedItemColor
      ).off("click").click(aEvent.data, aEvent.data.cbUnselectItem);

      aEvent.data.items.selected.push($caller.val());
      aEvent.data.valueElement.val(JSON.stringify(aEvent.data.items.selected));
      $caller.appendTo(aEvent.data.selectedElement.find(".oms-list-body"));
    },

    /**
     * Unselect event callback
     *
     * @method cbUnselectItem
     *
     * @param {Event} aEvent The callback event object
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    cbUnselectItem: function(aEvent) {
      aEvent.preventDefault();
      aEvent.stopImmediatePropagation();

      const $caller = $(aEvent.target).removeClass(
          "oms-item-" + aEvent.data.settings.selectedItemColor
      ).addClass(
          "oms-item-" + aEvent.data.settings.availableItemColor
      ).off("click").click(aEvent.data, aEvent.data.cbSelectItem);

      aEvent.data.items.selected = aEvent.data.arrayRemove(
          aEvent.data.items.selected,
          $caller.val()
      );
      aEvent.data.valueElement.val(JSON.stringify(aEvent.data.items.selected));
      $caller.appendTo(aEvent.data.availableElement.find(".oms-list-body"));
    },

    /**
     * Reset selection event callback
     *
     * @method cbResetSelection
     *
     * @param {Event} aEvent The callback event object
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    cbResetSelection: function(aEvent) {
      aEvent.preventDefault();
      aEvent.stopImmediatePropagation();
      aEvent.data.resetSelection();
    },

    /**
     * Select all event callback
     *
     * @method cbSelectAll
     *
     * @param {Event} aEvent The callback event object
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    cbSelectAll: function(aEvent) {
      aEvent.preventDefault();
      aEvent.stopImmediatePropagation();

      const items = aEvent.data.availableElement.find(".oms-list-body")
          .find(".oms-item");

      $.each(items, function(index, value) {
        const $value = $(value);
        aEvent.data.items.selected.push($value.val());
        $value.removeClass(
            "oms-item-" + aEvent.data.settings.availableItemColor
        ).addClass("oms-item-" + aEvent.data.settings.selectedItemColor)
            .off("click").click(aEvent.data, aEvent.data.cbUnselectItem)
            .appendTo(aEvent.data.selectedElement.find(".oms-list-body"));
      });

      aEvent.data.valueElement.val(JSON.stringify(aEvent.data.items.selected));
    },

    /**
     * Unselect all event callback
     *
     * @method cbUnselectAll
     *
     * @param {Event} aEvent The callback event object
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    cbUnselectAll: function(aEvent) {
      aEvent.preventDefault();
      aEvent.stopImmediatePropagation();

      const items = aEvent.data.selectedElement.find(".oms-list-body")
          .find(".oms-item");

      $.each(items, function(index, value) {
        const $value = $(value);
        aEvent.data.items.selected = aEvent.data.arrayRemove(
            aEvent.data.items.selected,
            $value.val()
        );
        $value.removeClass(
            "oms-item-" + aEvent.data.settings.selectedItemColor
        ).addClass("oms-item-" + aEvent.data.settings.availableItemColor)
            .off("click").click(aEvent.data, aEvent.data.cbSelectItem)
            .appendTo(aEvent.data.availableElement.find(".oms-list-body"));
      });

      aEvent.data.valueElement.val(JSON.stringify(aEvent.data.items.selected));
    },
    // #endregion Callbacks

    // #region Private methods
    /**
     * Redraw the UI element
     *
     * @method render
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    render: function() {
      const aeBody = this.availableElement.find(".oms-list-body").empty();
      const seBody = this.selectedElement.find(".oms-list-body").empty();
      this.valueElement.val(JSON.stringify(this.items.selected));

      $.each(this.items.available, (function(index, value) {
        const listItem = $("<span />").attr({class: "oms-item"})
            .text(value.text).val(value.value);

        if (this.arrayContains(value.value, this.items.selected)) {
          seBody.append(listItem.addClass(
              "oms-item-" + this.settings.selectedItemColor
          ).click(this, this.cbUnselectItem));
        } else {
          aeBody.append(listItem.addClass(
              "oms-item-" + this.settings.availableItemColor
          ).click(this, this.cbSelectItem));
        }
      }).bind(this));
    },
    // #endregion Private methods

    // #region Public methods
    /**
     * Reload the available items
     *
     * @method reloadAvailableItems
     *
     * @param {string} aUrl Sets the new URL to use when reloading the
     * available items. Pass `null` to keep the original url. Default: `null`
     * @param {boolean} aIndRedraw Indicates that the element should be redrawn
     * on success. Default: `true`
     *
     * @return {boolean}
     *
     * @example
     * $("#oms-div").openMultiSelect("reloadAvailableItems");
     * @example
     * $("#oms-div").openMultiSelect(
     *   "reloadAvailableItems",
     *   "https://exampe.com/api/v1/groups/available"
     * );
     * @example
     * $("#oms-div").openMultiSelect(
     *   "reloadAvailableItems",
     *   "https://exampe.com/api/v1/groups/available",
     *   true
     * );
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    reloadAvailableItems: function(aUrl, aIndRedraw) {
      aUrl = (typeof aUrl !== "undefined") ? aUrl : null;
      aIndRedraw = (typeof aIndRedraw !== "undefined") ? aIndRedraw : true;

      if (aUrl !== null) {
        if (this.settings.ajax === null) {
          this.settings.ajax = $.extend(
              true,
              {},
              AJAX_DEFAULTS,
              {availableUrl: aUrl}
          );
        } else {
          this.settings.ajax.availableUrl = aUrl;
        }
      }

      const ajaxSettings = $.extend(
          true,
          {},
          AJAX_DEFAULTS,
          this.settings.ajax
      );
      this.items = ITEMS_DEFAULTS;
      if (ajaxSettings.availableUrl === null) return true;
      // Reload using AJAX
      $.ajax({
        url: ajaxSettings.availableUrl,
        async: true,
        accepts: "application/json",
        cache: false,
        type: this.settings.ajax.method,
      }).done((function(data) {
        this.items.available = $.extend(true, {}, data);
        if (aIndRedraw === true) this.render();
        return true;
      }).bind(this)).fail(function(jqXHR) {
        alert(
            "Unable to handle the request due to an AJAX fault!\nResponse : " +
            jqXHR.responseText
        );
        return false;
      });
    },

    /**
     * Reload the selected items
     *
     * @method reloadSelectedItems
     *
     * @param {string} aUrl Sets the new URL to use when reloading the selected
     * items. Pass `null` to keep the original url. Default: `null`
     * @param {boolean} aIndRedraw Indicates that the element should be redrawn
     * on success. Default: `true`
     *
     * @return {boolean}
     *
     * @example
     * $("#oms-div").openMultiSelect("reloadSelectedItems");
     * @example
     * $("#oms-div").openMultiSelect(
     *   "reloadSelectedItems",
     *   "https://exampe.com/api/v1/user/1/groupids"
     * );
     * @example
     * $("#oms-div").openMultiSelect(
     *   "reloadSelectedItems",
     *   "https://exampe.com/api/v1/user/1/groupids",
     *   true
     * );
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    reloadSelectedItems: function(aUrl, aIndRedraw) {
      aUrl = (typeof aUrl !== "undefined") ? aUrl : null;
      aIndRedraw = (typeof aIndRedraw !== "undefined") ? aIndRedraw : true;

      if (aUrl !== null) {
        if (this.settings.ajax === null) {
          this.settings.ajax = $.extend(
              true,
              {},
              AJAX_DEFAULTS,
              {selectedUrl: aUrl}
          );
        } else {
          this.settings.ajax.selectedUrl = aUrl;
        }
      }

      const ajaxSettings = $.extend(
          true,
          {},
          AJAX_DEFAULTS,
          this.settings.ajax
      );
      this.items = ITEMS_DEFAULTS;
      if (ajaxSettings.selectedUrl === null) return true;
      // Reload using AJAX
      $.ajax({
        url: ajaxSettings.selectedUrl,
        async: true,
        accepts: "application/json",
        cache: false,
        type: this.settings.ajax.method,
      }).done((function(data) {
        this.items.initial = Array.from(data);
        this.items.selected = Array.from(data);
        if (aIndRedraw === true) this.render();
        return true;
      }).bind(this)).fail(function(jqXHR) {
        alert(
            "Unable to handle the request due to an AJAX fault!\nResponse : " +
            jqXHR.responseText
        );
        return false;
      });
    },

    /**
     * Reload both the available and selected items
     *
     * @method reloadItems
     *
     * @param {string} aAvailableUrl Sets the new URL to use when reloading the
     * available items. Pass `null` to keep the original url. Default: `null`
     * @param {string} aSelectedUrl Sets the new URL to use when reloading the
     * selected items. Pass `null` to keep the original url. Default: `null`
     * @param {boolean} aIndRedraw Indicates that the element should be redrawn
     * on success. Default: `true`
     *
     * @example
     * $("#oms-div").openMultiSelect("reloadItems");
     * @example
     * $("#oms-div").openMultiSelect(
     *   "reloadItems",
     *   "https://exampe.com/api/v1/groups/available"
     * );
     * @example
     * $("#oms-div").openMultiSelect(
     *   "reloadItems",
     *   null,
     *   "https://exampe.com/api/v1/user/1/groupids",
     *   true
     * );
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    reloadItems: function(aAvailableUrl, aSelectedUrl, aIndRedraw) {
      aAvailableUrl = (typeof aAvailableUrl !== "undefined")
          ? aAvailableUrl
          : null;
      aSelectedUrl = (typeof aSelectedUrl !== "undefined")
          ? aSelectedUrl
          : null;
      aIndRedraw = (typeof aIndRedraw !== "undefined") ? aIndRedraw : true;
      this.reloadAvailableItems(aAvailableUrl, aIndRedraw);
      this.reloadSelectedItems(aSelectedUrl, aIndRedraw);
    },

    /**
     * Reset the list of selected items to it's initial value
     *
     * @method resetSelection
     *
     * @example
     * $("#oms-div").openMultiSelect("resetSelection");
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    resetSelection: function() {
      this.items.selected = Array.from(this.items.initial);
      this.render();
    },

    /**
     * Clear the lists and reset the value input element
     *
     * @method clearItems
     *
     * @example
     * $("#oms-div").openMultiSelect("clearItems");
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    clearItems: function() {
      this.items = ITEMS_DEFAULTS;
      this.render();
    },

    /**
     * Set the available items
     *
     * @method setAvailableItems
     *
     * @param {array} aItems An array of all the available items
     * @param {boolean} aIndRedraw Indicates that the element should be redrawn
     *
     * @example
     * $("#oms-div").openMultiSelect(
     *   "setAvailableItems",
     *   [
     *     { text: "test1", value: "t1" },
     *     { text: "test2", value: "t2" },
     *     { text: "test3", value: "t3" },
     *     { text: "test4", value: "t4" },
     *     { text: "test5", value: "t5" },
     *   ]
     * );
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    setAvailableItems: function(aItems, aIndRedraw) {
      aIndRedraw = (typeof aIndRedraw !== "undefined") ? aIndRedraw : true;
      this.items.available = $.extend(true, {}, aItems);
      if (aIndRedraw === true) this.render();
    },

    /**
     * Set the selected and initial items
     *
     * @method setSelectedItems
     *
     * @param {array} aItems An array of the selected (bound) items
     * @param {boolean} aIndRedraw Indicates that the element should be redrawn
     *
     * @example
     * $("#oms-div").openMultiSelect(
     *   "setSelectedItems",
     *   [ "t2", "t5", ]
     * );
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    setSelectedItems: function(aItems, aIndRedraw) {
      aIndRedraw = (typeof aIndRedraw !== "undefined") ? aIndRedraw : true;
      this.items.initial = Array.from(aItems);
      this.items.selected = Array.from(aItems);
      if (aIndRedraw === true) this.render();
    },

    /**
     * Reload both the available and selected items
     *
     * @method setItems
     *
     * @param {array} aAvailableItems An array of all the available items
     * @param {array} aSelectedItems An array of the selected (bound) items
     * @param {boolean} aIndRedraw Indicates that the element should be redrawn
     *
     * @example
     * $("#oms-div").openMultiSelect(
     *   "setItems",
     *   [
     *     { text: "test1", value: "t1" },
     *     { text: "test2", value: "t2" },
     *     { text: "test3", value: "t3" },
     *     { text: "test4", value: "t4" },
     *     { text: "test5", value: "t5" },
     *   ],
     *   [ "t2", "t5", ]
     * );
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    setItems: function(aAvailableItems, aSelectedItems, aIndRedraw) {
      aIndRedraw = (typeof aIndRedraw !== "undefined") ? aIndRedraw : true;
      this.setAvailableItems(aAvailableItems, false);
      this.setSelectedItems(aSelectedItems, false);
      if (aIndRedraw === true) this.render();
    },

    /**
     * Retrieve the active configuration for this instance
     *
     * @method getConfig
     *
     * @return {Object}
     *
     * @example
     * const config = $("#oms-div").openMultiSelect("getConfig");
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    getConfig: function() {
      return $.extend(true, {}, this.settings);
    },

    /**
     * Modify this instance's configuration
     *
     * @method setConfig
     *
     * @param {Object} aOptions The options to set/change
     * @param {boolean} aIndReload Indicates that the items shopuld be reloaded
     * @param {boolean} aIndRedraw Indicates that the element should be redrawn
     *
     * @example
     * $("#oms-div").openMultiSelect(
     *   "setConfig",
     *   {
     *     name: "oms-value-input",
     *     ajax: {
     *       availableUrl: "https://exampe.com/api/v1/groups/available",
     *       selectedUrl: "https://exampe.com/api/v1/user/1/groupids",
     *       method: "GET",
     *     },
     *     availableItemColor: "red",
     *     selectedItemColor: "green",
     *     buttonColor: "primary",
     *     headerColor: "mdb-color",
     *   },
     *   true,
     *   true
     * );
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    setConfig: function(aOptions, aIndReload, aIndRedraw) {
      aIndReload = (typeof aIndReload !== "undefined") ? aIndReload : true;
      aIndRedraw = (typeof aIndRedraw !== "undefined") ? aIndRedraw : true;
      this.settings = $.extend(true, {}, this.settings, aOptions);
      if (aIndReload === true) this.reloadItems(null, null, false);
      if (aIndRedraw === true) this.render();
    },
    // #endregion Public methods

    // #region Construct and destroy
    /**
     * The plugin initializer
     *
     * @method init
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    init: function() {
      this.valueElement = $("<input />").attr({
        name: this.settings.name,
        type: "hidden",
      });
      this.availableElement = $("<div />").attr({class: "oms-available-list"})
          .append(
              $("<div />").attr({
                class: "oms-list-header oms-list-header-" +
                this.settings.headerColor,
              }).text("Available Items"),
              $("<div />").attr({class: "oms-list-body"})
          );
      this.selectedElement = $("<div />").attr({class: "oms-selected-list"})
          .append(
              $("<div />").attr({
                class: "oms-list-header oms-list-header-" +
                this.settings.headerColor,
              }).text("Selected Items"),
              $("<div />").attr({class: "oms-list-body"})
          );
      this.buttonElement = $("<div />").attr({class: "oms-controls"}).append(
          $("<button />").attr({
            class: "btn btn-block btn-" + this.settings.buttonColor + " mb-1",
          }).text("Reset Selection").click(this, this.cbResetSelection),
          $("<button />").attr({
            class: "btn btn-block btn-" + this.settings.buttonColor + " mt-3",
          }).text("Select All").click(this, this.cbSelectAll),
          $("<button />").attr({
            class: "btn btn-block btn-" + this.settings.buttonColor + " mt-3",
          }).text("Unselect All").click(this, this.cbUnselectAll)
      );
      this.$element.append($("<div />").attr({class: "row mt-5 mb-4 clearfix"})
          .append(
              this.valueElement,
              this.availableElement,
              this.buttonElement,
              this.selectedElement
          ));
      const ua = navigator.userAgent.toLowerCase();

      if (
        ua.indexOf("msie") > -1 ||
        ua.indexOf("trident/") > -1 ||
        ua.indexOf("edge/") > -1 ||
        ua.indexOf("opera") > -1 ||
        ua.indexOf("opr/") > -1
      ) {
        const overflowFix = {
          "padding-right": "20px",
          "overflow-x": "hidden",
        };
        this.availableElement.find(".oms-list-body").css(overflowFix);
        this.selectedElement.find(".oms-list-body").css(overflowFix);
      }

      if (this.settings.ajax !== null) this.reloadItems();
    },

    /**
     * Restore the DOM element to it's original state by unloading the
     * plugin.
     *
     * @method destroy
     *
     * @example
     * $("#oms-div").openMultiSelect("destroy");
     *
     * @author  Thimo Braker <thibmorozier@gmail.com>
     * @version 1.0.0
     */
    destroy: function() {
      this.clearItems();
      this.$element.empty();
      this.$element.removeData(PLUGIN_NAMESPACE_DATA);
    },
    // #endregion Construct and destroy
  });

  /**
   * Initialize openMultiSelect or call one of it's public methods
   *
   * @function $.fn.openMultiSelect
   *
   * @param {Object} aOptions The initialization options or method name, in
   * case of a method call.
   * @return {Object}
   *
   * @example
   * const $element = $("#oms-div").openMultiSelect({
   *   name: "oms-value-input",
   *   ajax: {
   *     availableUrl: "https://exampe.com/api/v1/groups/available",
   *     selectedUrl: "https://exampe.com/api/v1/user/1/groupids",
   *     method: "GET",
   *   },
   *   availableItemColor: "red",
   *   selectedItemColor: "green",
   *   buttonColor: "primary",
   *   headerColor: "mdb-color",
   * });
   *
   * @author  Thimo Braker <thibmorozier@gmail.com>
   * @version 1.0.0
   */
  $.fn.openMultiSelect = function(aOptions) {
    // eslint-disable-next-line prefer-rest-params
    const args = Array.prototype.slice.call(arguments, 1);

    if (aOptions === undefined || typeof aOptions === "object") {
      return this.each(function(index, value) {
        if (!$.data(value, PLUGIN_NAMESPACE_DATA)) {
          $.data(value, PLUGIN_NAMESPACE_DATA, new Plugin(value, aOptions));
        }
      });
    }

    if (
      typeof aOptions === "string" &&
      aOptions[0] !== "_" && aOptions !== "init"
    ) {
      // Cache the method call to make it possible to return a value
      let returns;

      this.each(function(index, value) {
        const instance = $.data(value, PLUGIN_NAMESPACE_DATA);

        if (
          instance instanceof Plugin &&
          typeof instance[aOptions] === "function"
        ) {
          // eslint-disable-next-line prefer-spread
          returns = instance[aOptions].apply(instance, args);
        }
      });

      return returns !== undefined ? returns : this;
    }

    return this;
  };

  /**
   * The default settings for openMultiSelect.
   *
   * @property $.fn.openMultiSelect.defaults
   *
   * @example
   * $.fn.openMultiSelect.defaults = {
   *   name: "oms-value-input",
   *   ajax: {
   *     availableUrl: "https://exampe.com/api/v1/groups/available",
   *     selectedUrl: "https://exampe.com/api/v1/user/1/groupids",
   *     method: "GET",
   *   },
   *   availableItemColor: "red",
   *   selectedItemColor: "green",
   *   buttonColor: "primary",
   *   headerColor: "mdb-color",
   * };
   *
   * @author  Thimo Braker <thibmorozier@gmail.com>
   * @version 1.0.0
   */
  $.fn.openMultiSelect.defaults = {
    /**
     * The ajax settings to use when using a JSON API to load data.
     *
     * @property name
     * @type {string}
     * @default "oms-value-input"
     */
    name: "oms-value-input",
    /**
     * The ajax settings to use when using a JSON API to load data.
     *
     * @property ajax
     * @type {Object}
     * @default null
     */
    ajax: null,
    /**
     * The color scheme to use for the available list item elements.
     *
     * @property availableItemColor
     * @type {string}
     * @default "red"
     */
    availableItemColor: "red",
    /**
     * The color scheme to use for the selected list item elements.
     *
     * @property selectedItemColor
     * @type {string}
     * @default "green"
     */
    selectedItemColor: "green",
    /**
     * The color scheme to use for the button elements.
     *
     * @property buttonColor
     * @type {string}
     * @default "primary"
     */
    buttonColor: "primary",
    /**
     * The color scheme to use for the list header elements.
     *
     * @property headerColor
     * @type {string}
     * @default "mdb-color"
     */
    headerColor: "mdb-color",
  };
})(jQuery, window, document);
