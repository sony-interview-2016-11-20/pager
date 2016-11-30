/**/
"use strict";

window.demoLib = window.demoLib || {};
demoLib.serviceContainer = function () {
  const services = {
  };
  let factories = {};

  const configure = (options) => {
    if (options.factories) {
      factories = options.factories;
    }
  };

  // Normalize name
  const normalizeName = (name) => {
    return ("" + name);
  };

  /**
   * Return the given named item
   */
  const get = function(name) {
    name = normalizeName(name);

    if (services[name] !== undefined) {
      return services[name];
    }
    if (factories[name] !== undefined) {
      const result = factories[name](self);
      services[name] = result;
      return result;
    }
    throw "serviceName.unknown name=" + name;
  };

  /**
   *
   * @param name
   * @param value
   */
  const set = (name, value) => {
    name = normalizeName(name);
    services[name] = value;
  };

  /**
   * Has a named item
   * @param name
   * @returns {*}
   */
  const has = (name) => {
    name = normalizeName(name);
    return (services[name] || factories[name]);
  };

  const self = {
    'get': (name) => {
      return get(name);
    },
    'set': (name, value) => {
      set(name, value);
    },
    'has': (name) => {
      return has(name);
    },
    'configure': (factoryConfig) => {
      configure(factoryConfig);
    },
    get factories() { return factories; },
    // set selfRef(value) { setSelfReference(value);}
  };
  return self;
};
