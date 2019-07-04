"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _Api = _interopRequireDefault(require("@api-platform/api-doc-parser/lib/Api"));

var _Field = _interopRequireDefault(require("@api-platform/api-doc-parser/lib/Field"));

var _Resource = _interopRequireDefault(require("@api-platform/api-doc-parser/lib/Resource"));

var _reactAdmin = require("react-admin");

var _enzyme = require("enzyme");

var _react = _interopRequireDefault(require("react"));

var _Edit = _interopRequireDefault(require("./Edit"));

var _inputFactory = _interopRequireDefault(require("./inputFactory"));

var entrypoint = 'http://entrypoint';
var apiData = {
  entrypoint: entrypoint
};
var resourceData = {
  name: 'user',
  url: "".concat(entrypoint, "/users"),
  writableFields: [new _Field.default('fieldA', {
    id: 'http://schema.org/fieldA',
    range: 'http://www.w3.org/2001/XMLSchema#string',
    reference: null,
    required: true
  }), new _Field.default('fieldB', {
    id: 'http://schema.org/fieldB',
    range: 'http://www.w3.org/2001/XMLSchema#string',
    reference: null,
    required: true
  }), new _Field.default('deprecatedField', {
    id: 'http://localhost/deprecatedField',
    range: 'http://www.w3.org/2001/XMLSchema#string',
    reference: null,
    required: true,
    deprecated: true
  }), new _Field.default('fieldD', {
    id: 'http://schema.org/fieldD',
    range: 'http://www.w3.org/2001/XMLSchema#array',
    reference: null,
    required: true
  })]
};
describe('<Edit />', function () {
  test('without overrides', function () {
    var defaultInputFactory = jest.fn(_inputFactory.default);
    var resource = new _Resource.default(resourceData.name, resourceData.url, resourceData);
    var api = new _Api.default(apiData.entrypoint, (0, _objectSpread2.default)({}, apiData, {
      resources: [resource]
    }));
    var render = (0, _enzyme.shallow)(_react.default.createElement(_Edit.default, {
      options: {
        api: api,
        inputFactory: defaultInputFactory,
        resource: resource
      },
      location: {},
      match: {},
      resource: ""
    }));
    expect(defaultInputFactory).toHaveBeenCalledTimes(3);
    expect(render.find(_reactAdmin.ArrayInput).length).toEqual(1);
    expect(render.find(_reactAdmin.DisabledInput).length).toEqual(1);
    expect(render.find(_reactAdmin.DisabledInput).get(0).props.source).toEqual('id');
    expect(render.find(_reactAdmin.SimpleFormIterator).length).toEqual(1);
    expect(render.find(_reactAdmin.TextInput).length).toEqual(3);
    expect(render.find(_reactAdmin.ArrayInput).get(0).props.source).toEqual('fieldD');
    expect(render.find(_reactAdmin.TextInput).get(0).props.source).toEqual('fieldA');
    expect(render.find(_reactAdmin.TextInput).get(1).props.source).toEqual('fieldB');
  });
  test('without default identifier input', function () {
    var defaultInputFactory = jest.fn(_inputFactory.default);
    var resource = new _Resource.default(resourceData.name, resourceData.url, (0, _objectSpread2.default)({}, resourceData, {
      editProps: {
        addIdInput: false
      }
    }));
    var api = new _Api.default(apiData.entrypoint, (0, _objectSpread2.default)({}, apiData, {
      resources: [resource]
    }));
    var render = (0, _enzyme.shallow)(_react.default.createElement(_Edit.default, {
      options: {
        api: api,
        inputFactory: defaultInputFactory,
        resource: resource
      },
      location: {},
      match: {},
      resource: ""
    }));
    expect(defaultInputFactory).toHaveBeenCalledTimes(3);
    expect(render.find(_reactAdmin.ArrayInput).length).toEqual(1);
    expect(render.find(_reactAdmin.DisabledInput).length).toEqual(0);
    expect(render.find(_reactAdmin.TextInput).length).toEqual(3);
    expect(render.find(_reactAdmin.ArrayInput).get(0).props.source).toEqual('fieldD');
    expect(render.find(_reactAdmin.TextInput).get(0).props.source).toEqual('fieldA');
    expect(render.find(_reactAdmin.TextInput).get(1).props.source).toEqual('fieldB');
  });
  test('with custom inputFactory', function () {
    var customInputFactory = jest.fn(_inputFactory.default);
    var defaultInputFactory = jest.fn(_inputFactory.default);
    var resource = new _Resource.default(resourceData.name, resourceData.url, (0, _objectSpread2.default)({}, resourceData, {
      editProps: {
        options: {
          inputFactory: customInputFactory
        }
      }
    }));
    var api = new _Api.default(apiData.entrypoint, (0, _objectSpread2.default)({}, apiData, {
      resources: [resource]
    }));
    var render = (0, _enzyme.shallow)(_react.default.createElement(_Edit.default, {
      options: {
        api: api,
        inputFactory: defaultInputFactory,
        resource: resource
      },
      location: {},
      match: {},
      resource: ""
    }));
    expect(customInputFactory).toHaveBeenCalledTimes(3);
    expect(defaultInputFactory).toHaveBeenCalledTimes(0);
    expect(render.find(_reactAdmin.ArrayInput).length).toEqual(1);
    expect(render.find(_reactAdmin.DisabledInput).length).toEqual(1);
    expect(render.find(_reactAdmin.DisabledInput).get(0).props.source).toEqual('id');
    expect(render.find(_reactAdmin.SimpleFormIterator).length).toEqual(1);
    expect(render.find(_reactAdmin.TextInput).length).toEqual(3);
    expect(render.find(_reactAdmin.ArrayInput).get(0).props.source).toEqual('fieldD');
    expect(render.find(_reactAdmin.TextInput).get(0).props.source).toEqual('fieldA');
    expect(render.find(_reactAdmin.TextInput).get(1).props.source).toEqual('fieldB');
  });
  test('with custom fields', function () {
    var defaultInputFactory = jest.fn(_inputFactory.default);
    var resource = new _Resource.default(resourceData.name, resourceData.url, (0, _objectSpread2.default)({}, resourceData, {
      editFields: [new _Field.default('fieldC', {
        id: 'http://schema.org/fieldC',
        range: 'http://www.w3.org/2001/XMLSchema#string',
        reference: null,
        required: true
      }), new _Field.default('fieldE', {
        id: 'http://schema.org/fieldE',
        range: 'http://www.w3.org/2001/XMLSchema#array',
        reference: null,
        required: true
      })]
    }));
    var api = new _Api.default(apiData.entrypoint, (0, _objectSpread2.default)({}, apiData, {
      resources: [resource]
    }));
    var render = (0, _enzyme.shallow)(_react.default.createElement(_Edit.default, {
      options: {
        api: api,
        inputFactory: defaultInputFactory,
        resource: resource
      },
      location: {},
      match: {},
      resource: ""
    }));
    expect(defaultInputFactory).toHaveBeenCalledTimes(2);
    expect(render.find(_reactAdmin.ArrayInput).length).toEqual(1);
    expect(render.find(_reactAdmin.DisabledInput).length).toEqual(1);
    expect(render.find(_reactAdmin.DisabledInput).get(0).props.source).toEqual('id');
    expect(render.find(_reactAdmin.SimpleFormIterator).length).toEqual(1);
    expect(render.find(_reactAdmin.TextInput).length).toEqual(2);
    expect(render.find(_reactAdmin.ArrayInput).get(0).props.source).toEqual('fieldE');
    expect(render.find(_reactAdmin.TextInput).get(0).props.source).toEqual('fieldC');
  });
  test('with writable identifier', function () {
    var defaultInputFactory = jest.fn(_inputFactory.default);
    var resource = new _Resource.default(resourceData.name, resourceData.url, (0, _objectSpread2.default)({}, resourceData, {
      editProps: {
        addIdInput: false
      },
      writableFields: [].concat((0, _toConsumableArray2.default)(resourceData.writableFields), [new _Field.default('id', {
        id: 'http://schema.org/identifier',
        range: 'http://www.w3.org/2001/XMLSchema#string',
        reference: null,
        required: true
      })])
    }));
    var api = new _Api.default(apiData.entrypoint, (0, _objectSpread2.default)({}, apiData, {
      resources: [resource]
    }));
    var render = (0, _enzyme.shallow)(_react.default.createElement(_Edit.default, {
      options: {
        api: api,
        inputFactory: defaultInputFactory,
        resource: resource
      },
      location: {},
      match: {},
      resource: ""
    }));
    expect(defaultInputFactory).toHaveBeenCalledTimes(4);
    expect(render.find(_reactAdmin.ArrayInput).length).toEqual(1);
    expect(render.find(_reactAdmin.DisabledInput).length).toEqual(0);
    expect(render.find(_reactAdmin.TextInput).length).toEqual(4);
    expect(render.find(_reactAdmin.ArrayInput).get(0).props.source).toEqual('fieldD');
    expect(render.find(_reactAdmin.TextInput).get(0).props.source).toEqual('fieldA');
    expect(render.find(_reactAdmin.TextInput).get(1).props.source).toEqual('fieldB');
    expect(render.find(_reactAdmin.TextInput).get(2).props.source).toEqual(undefined);
    expect(render.find(_reactAdmin.TextInput).get(3).props.source).toEqual('id');
  });
});