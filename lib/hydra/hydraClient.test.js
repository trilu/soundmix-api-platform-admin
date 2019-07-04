"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _reactAdmin = require("react-admin");

var _hydraClient = _interopRequireWildcard(require("./hydraClient"));

describe('map a json-ld document to an admin on rest compatible document', function () {
  var jsonLdDocument = {
    '@id': '/reviews/327',
    id: 327,
    '@type': 'http://schema.org/Review',
    reviewBody: 'Accusantium quia ipsam omnis praesentium. Neque quidem omnis perspiciatis sed. Officiis quo dolor esse nisi molestias.',
    rating: 3,
    itemReviewed: {
      '@id': '/books/2',
      id: 2,
      '@type': 'http://schema.org/Book',
      isbn: '9792828761393',
      name: '000',
      description: 'string',
      author: 'string',
      dateCreated: '2017-04-25T00:00:00+00:00'
    },
    comment: [{
      '@id': '/comments/1',
      '@type': 'http://schema.org/Comment',
      text: 'Lorem ipsum dolor sit amet.',
      dateCreated: '2017-04-26T00:00:00+00:00'
    }, {
      '@id': '/comments/2',
      '@type': 'http://schema.org/Comment',
      text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      dateCreated: '2017-04-27T00:00:00+00:00'
    }],
    aNestedObject: {
      foo: 'bar'
    }
  };
  describe('transform the JSON-LD document in React Admin document', function () {
    var reactAdminDocument = (0, _hydraClient.transformJsonLdDocumentToReactAdminDocument)(jsonLdDocument);
    test('deep clone the original object', function () {
      expect(reactAdminDocument).not.toBe(jsonLdDocument);
      expect(reactAdminDocument.aNestedObject).not.toBe(jsonLdDocument.aNestedObject);
    });
    test('add an id property equal to the original @id property', function () {
      expect(reactAdminDocument.id).toBe(jsonLdDocument['@id']);
    });
    test('preserve the previous id property value in a new originId property', function () {
      expect(reactAdminDocument.originId).toBe(jsonLdDocument.id);
    });
    test('an React Admin has a custom toString method', function () {
      expect(reactAdminDocument.toString()).toBe('[object /reviews/327]');
    });
    test('transform embedded documents to their IRIs', function () {
      expect(reactAdminDocument.itemReviewed).toBe('/books/2');
    });
    test('transform arrays of embedded documents to their IRIs', function () {
      expect(reactAdminDocument.comment[0]).toBe('/comments/1');
    });
  });
});
describe('fetch data from an hydra api', function () {
  test('fetch a get_list resource',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var mockHttpClient;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mockHttpClient = jest.fn();
            mockHttpClient.mockReturnValue(Promise.resolve({
              json: {
                'hydra:member': [{
                  '@id': 'books/5'
                }]
              }
            }));
            _context.next = 4;
            return (0, _hydraClient.default)({
              entrypoint: 'http://www.example.com'
            }, mockHttpClient)(_reactAdmin.GET_LIST, 'books', {
              pagination: {
                page: 2
              },
              sort: {
                field: 'id',
                order: 'ASC'
              }
            }).then(function () {
              expect(mockHttpClient.mock.calls[0][0].href).toBe('http://www.example.com/books?order%5Bid%5D=ASC&page=2');
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  })));
  test('fetch a get_list resource with relative api url',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    var mockHttpClient;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            mockHttpClient = jest.fn();
            mockHttpClient.mockReturnValue(Promise.resolve({
              json: {
                'hydra:member': [{
                  '@id': 'books/5'
                }]
              }
            }));
            _context2.next = 4;
            return (0, _hydraClient.default)({
              entrypoint: '/api'
            }, mockHttpClient)(_reactAdmin.GET_LIST, 'books', {
              pagination: {
                page: 2
              },
              sort: {
                field: 'id',
                order: 'ASC'
              }
            }).then(function () {
              expect(mockHttpClient.mock.calls[0][0].href).toBe("".concat(window.location.origin, "/api/books?order%5Bid%5D=ASC&page=2"));
            });

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  })));
  test('fetch a get_many resource',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3() {
    var mockHttpClient;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            mockHttpClient = jest.fn();
            mockHttpClient.mockReturnValueOnce(Promise.resolve({
              json: {
                '@id': '/books/3'
              }
            })).mockReturnValue(Promise.resolve({
              json: {
                '@id': '/books/5'
              }
            }));
            _context3.next = 4;
            return (0, _hydraClient.default)({
              entrypoint: 'http://www.example.com'
            }, mockHttpClient)(_reactAdmin.GET_MANY, 'books', {
              ids: [3, 5]
            }).then(function (response) {
              expect(response.data[0].id).toEqual('/books/3');
              expect(response.data[1].id).toEqual('/books/5');
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  })));
  test('fetch a get_many_reference resource',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4() {
    var mockHttpClient;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            mockHttpClient = jest.fn();
            mockHttpClient.mockReturnValue(Promise.resolve({
              json: {
                'hydra:member': [{
                  '@id': 'books/5'
                }]
              }
            }));
            _context4.next = 4;
            return (0, _hydraClient.default)({
              entrypoint: '/api'
            }, mockHttpClient)(_reactAdmin.GET_MANY_REFERENCE, 'books', {
              target: 'author',
              id: 'string',
              pagination: {
                page: 2
              },
              sort: {
                field: 'id',
                order: 'ASC'
              },
              filter: {
                is_published: 1
              }
            }).then(function (response) {
              expect(mockHttpClient.mock.calls[0][0].href).toBe("".concat(window.location.origin, "/api/books?order%5Bid%5D=ASC&page=2&is_published=1&author=string"));
            });

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  })));
  test('delete resource',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee5() {
    var mockHttpClient;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            mockHttpClient = jest.fn();
            mockHttpClient.mockReturnValueOnce(Promise.resolve(''));
            _context5.next = 4;
            return (0, _hydraClient.default)({
              entrypoint: 'http://www.example.com'
            }, mockHttpClient)(_reactAdmin.DELETE, 'books', {
              id: '/books/1'
            }).then(function () {
              expect(mockHttpClient.mock.calls[0][0].href).toBe('http://www.example.com/books/1');
              expect(mockHttpClient.mock.calls[0][1].method).toBe('DELETE');
            });

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  })));
  test('delete many resources',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee6() {
    var mockHttpClient;
    return _regenerator.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            mockHttpClient = jest.fn();
            mockHttpClient.mockReturnValueOnce(Promise.resolve(''));
            _context6.next = 4;
            return (0, _hydraClient.default)({
              entrypoint: 'http://www.example.com'
            }, mockHttpClient)(_reactAdmin.DELETE_MANY, 'books', {
              ids: ['/books/1', '/books/2']
            }).then(function () {
              expect(mockHttpClient.mock.calls[0][0].href).toBe('http://www.example.com/books/1');
              expect(mockHttpClient.mock.calls[0][1].method).toBe('DELETE');
              expect(mockHttpClient.mock.calls[1][0].href).toBe('http://www.example.com/books/2');
              expect(mockHttpClient.mock.calls[1][1].method).toBe('DELETE');
            });

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this);
  })));
});