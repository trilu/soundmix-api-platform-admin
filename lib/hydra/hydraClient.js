"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.transformJsonLdDocumentToReactAdminDocument = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _reactAdmin = require("react-admin");

var _lodash = _interopRequireDefault(require("lodash.isplainobject"));

var _fetchHydra = _interopRequireDefault(require("./fetchHydra"));

var ReactAdminDocument =
/*#__PURE__*/
function () {
  function ReactAdminDocument(obj) {
    (0, _classCallCheck2.default)(this, ReactAdminDocument);
    Object.assign(this, obj, {
      originId: obj.id,
      id: obj['@id']
    });
  }
  /**
   * @return {string}
   */


  (0, _createClass2.default)(ReactAdminDocument, [{
    key: "toString",
    value: function toString() {
      return "[object ".concat(this.id, "]");
    }
  }]);
  return ReactAdminDocument;
}();
/**
 * Local cache containing embedded documents.
 * It will be used to prevent useless extra HTTP query if the relation is displayed.
 *
 * @type {Map}
 */


var reactAdminDocumentsCache = new Map();
/**
 * Transforms a JSON-LD document to a react-admin compatible document.
 *
 * @param {Object} document
 * @param {bool} clone
 *
 * @return {ReactAdminDocument}
 */

var transformJsonLdDocumentToReactAdminDocument = function transformJsonLdDocumentToReactAdminDocument(document) {
  var clone = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var addToCache = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  if (clone) {
    // deep clone documents
    document = JSON.parse(JSON.stringify(document));
  } // The main document is a JSON-LD document, convert it and store it in the cache


  if (document['@id']) {
    document = new ReactAdminDocument(document);
  } // Replace embedded objects by their IRIs, and store the object itself in the cache to reuse without issuing new HTTP requests.


  Object.keys(document).forEach(function (key) {
    // to-one
    if ((0, _lodash.default)(document[key]) && document[key]['@id']) {
      if (addToCache) {
        reactAdminDocumentsCache[document[key]['@id']] = transformJsonLdDocumentToReactAdminDocument(document[key], false, false);
      }

      document[key] = document[key]['@id'];
      return;
    } // to-many


    if (Array.isArray(document[key]) && document[key].length && (0, _lodash.default)(document[key][0]) && document[key][0]['@id']) {
      document[key] = document[key].map(function (obj) {
        if (addToCache) {
          reactAdminDocumentsCache[obj['@id']] = transformJsonLdDocumentToReactAdminDocument(obj, false, false);
        }

        return obj['@id'];
      });
    }
  });
  return document;
};
/**
 * Maps react-admin queries to a Hydra powered REST API
 *
 * @see http://www.hydra-cg.com/
 *
 * @example
 * CREATE   => POST http://my.api.url/posts/123
 * DELETE   => DELETE http://my.api.url/posts/123
 * GET_LIST => GET http://my.api.url/posts
 * GET_MANY => GET http://my.api.url/posts/123, GET http://my.api.url/posts/456, GET http://my.api.url/posts/789
 * GET_ONE  => GET http://my.api.url/posts/123
 * UPDATE   => PUT http://my.api.url/posts/123
 */


exports.transformJsonLdDocumentToReactAdminDocument = transformJsonLdDocumentToReactAdminDocument;

var _default = function _default(_ref) {
  var entrypoint = _ref.entrypoint,
      _ref$resources = _ref.resources,
      resources = _ref$resources === void 0 ? [] : _ref$resources;
  var httpClient = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _fetchHydra.default;

  /**
   * @param {Object} resource
   * @param {Object} data
   *
   * @returns {Promise}
   */
  var convertReactAdminDataToHydraData = function convertReactAdminDataToHydraData(resource) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var fieldData = [];
    resource.fields.forEach(function (_ref2) {
      var name = _ref2.name,
          normalizeData = _ref2.normalizeData;

      if (!(name in data) || undefined === normalizeData) {
        return;
      }

      fieldData[name] = normalizeData(data[name]);
    });
    var fieldDataKeys = Object.keys(fieldData);
    var fieldDataValues = Object.values(fieldData);
    return Promise.all(fieldDataValues).then(function (fieldData) {
      var object = {};

      for (var i = 0; i < fieldDataKeys.length; i++) {
        object[fieldDataKeys[i]] = fieldData[i];
      }

      return (0, _objectSpread2.default)({}, data, object);
    });
  };
  /**
   * @param {Object} resource
   * @param {Object} data
   *
   * @returns {Promise}
   */


  var transformReactAdminDataToRequestBody = function transformReactAdminDataToRequestBody(resource) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    resource = resources.find(function (_ref3) {
      var name = _ref3.name;
      return resource === name;
    });

    if (undefined === resource) {
      return Promise.resolve(data);
    }

    return convertReactAdminDataToHydraData(resource, data).then(function (data) {
      return undefined === resource.encodeData ? JSON.stringify(data) : resource.encodeData(data);
    });
  };
  /**
   * @param {string} type
   * @param {string} resource
   * @param {Object} params
   *
   * @returns {Object}
   */


  var convertReactAdminRequestToHydraRequest = function convertReactAdminRequestToHydraRequest(type, resource, params) {
    var entrypointUrl = new URL(entrypoint, window.location.href);
    var collectionUrl = new URL("".concat(entrypoint, "/").concat(resource), entrypointUrl);
    var itemUrl = new URL(params.id, entrypointUrl);

    switch (type) {
      case _reactAdmin.CREATE:
        return transformReactAdminDataToRequestBody(resource, params.data).then(function (body) {
          return {
            options: {
              body: body,
              method: 'POST'
            },
            url: collectionUrl
          };
        });

      case _reactAdmin.DELETE:
        return Promise.resolve({
          options: {
            method: 'DELETE'
          },
          url: itemUrl
        });

      case _reactAdmin.GET_LIST:
      case _reactAdmin.GET_MANY_REFERENCE:
        {
          var _params$pagination = params.pagination,
              page = _params$pagination.page,
              perPage = _params$pagination.perPage,
              _params$sort = params.sort,
              field = _params$sort.field,
              order = _params$sort.order;
          if (order) collectionUrl.searchParams.set("order[".concat(field, "]"), order);
          if (page) collectionUrl.searchParams.set('page', page);
          if (perPage) collectionUrl.searchParams.set('perPage', perPage);

          if (params.filter) {
            Object.keys(params.filter).forEach(function (key) {
              var filterValue = params.filter[key];

              if (!(0, _lodash.default)(filterValue)) {
                collectionUrl.searchParams.set(key, params.filter[key]);
                return;
              }

              Object.keys(filterValue).forEach(function (subKey) {
                collectionUrl.searchParams.set("".concat(key, "[").concat(subKey, "]"), filterValue[subKey]);
              });
            });
          }

          if (type === _reactAdmin.GET_MANY_REFERENCE && params.target) {
            collectionUrl.searchParams.set(params.target, params.id);
          }

          return Promise.resolve({
            options: {},
            url: collectionUrl
          });
        }

      case _reactAdmin.GET_ONE:
        return Promise.resolve({
          options: {},
          url: itemUrl
        });

      case _reactAdmin.UPDATE:
        return transformReactAdminDataToRequestBody(resource, params.data).then(function (body) {
          return {
            options: {
              body: body,
              method: 'PUT'
            },
            url: itemUrl
          };
        });

      default:
        throw new Error("Unsupported fetch action type ".concat(type));
    }
  };
  /**
   * @param {string} resource
   * @param {Object} data
   *
   * @returns {Promise}
   */


  var convertHydraDataToReactAdminData = function convertHydraDataToReactAdminData(resource) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    resource = resources.find(function (_ref4) {
      var name = _ref4.name;
      return resource === name;
    });

    if (undefined === resource) {
      return Promise.resolve(data);
    }

    var fieldData = {};
    resource.fields.forEach(function (_ref5) {
      var name = _ref5.name,
          denormalizeData = _ref5.denormalizeData;

      if (!(name in data) || undefined === denormalizeData) {
        return;
      }

      fieldData[name] = denormalizeData(data[name]);
    });
    var fieldDataKeys = Object.keys(fieldData);
    var fieldDataValues = Object.values(fieldData);
    return Promise.all(fieldDataValues).then(function (fieldData) {
      var object = {};

      for (var i = 0; i < fieldDataKeys.length; i++) {
        object[fieldDataKeys[i]] = fieldData[i];
      }

      return (0, _objectSpread2.default)({}, data, object);
    });
  };
  /**
   * @param {Object} response
   * @param {string} resource
   * @param {string} type
   *
   * @returns {Promise}
   */


  var convertHydraResponseToReactAdminResponse = function convertHydraResponseToReactAdminResponse(type, resource, response) {
    switch (type) {
      case _reactAdmin.GET_LIST:
      case _reactAdmin.GET_MANY_REFERENCE:
        // TODO: support other prefixes than "hydra:"
        return Promise.resolve(response.json['hydra:member'].map(transformJsonLdDocumentToReactAdminDocument)).then(function (data) {
          return Promise.all(data.map(function (data) {
            return convertHydraDataToReactAdminData(resource, data);
          }));
        }).then(function (data) {
          return {
            data: data,
            total: response.json['hydra:totalItems']
          };
        });

      case _reactAdmin.DELETE:
        return Promise.resolve({
          data: {
            id: null
          }
        });

      default:
        return Promise.resolve(transformJsonLdDocumentToReactAdminDocument(response.json)).then(function (data) {
          return convertHydraDataToReactAdminData(resource, data);
        }).then(function (data) {
          return {
            data: data
          };
        });
    }
  };
  /**
   * @param {string} type
   * @param {string} resource
   * @param {Object} params
   *
   * @returns {Promise}
   */


  var fetchApi = function fetchApi(type, resource, params) {
    // Hydra doesn't handle MANY requests, so we fallback to calling the ONE request n times instead
    switch (type) {
      case _reactAdmin.GET_MANY:
        return Promise.all(params.ids.map(function (id) {
          return reactAdminDocumentsCache[id] ? Promise.resolve({
            data: reactAdminDocumentsCache[id]
          }) : fetchApi(_reactAdmin.GET_ONE, resource, {
            id: id
          });
        })).then(function (responses) {
          return {
            data: responses.map(function (_ref6) {
              var data = _ref6.data;
              return data;
            })
          };
        });

      case _reactAdmin.DELETE_MANY:
        return Promise.all(params.ids.map(function (id) {
          return fetchApi(_reactAdmin.DELETE, resource, {
            id: id
          });
        })).then(function (responses) {
          return {
            data: []
          };
        });

      default:
        return convertReactAdminRequestToHydraRequest(type, resource, params).then(function (_ref7) {
          var url = _ref7.url,
              options = _ref7.options;
          return httpClient(url, options);
        }).then(function (response) {
          return convertHydraResponseToReactAdminResponse(type, resource, response);
        });
    }
  };

  return fetchApi;
};

exports.default = _default;