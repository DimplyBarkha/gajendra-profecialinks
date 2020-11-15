
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'citilink.ru',
    prefix: null,
    url: null,
    country: 'RU',
    store: 'citilink',
    zipcode: '',
  },
  implementation: (inputs, parameters, context, dependencies) => {
    const { id } = inputs;
    const { domain, prefix, suffix } = parameters;

    if (parameters.url) {
      const url = parameters.url.replace('{id}', encodeURIComponent(id));
      return url;
    }
    let gotoUrl = `https://${domain}`;
    if (prefix) {
      gotoUrl += `/${prefix}`;
    }
    gotoUrl += `/catalog/${id}`;
    if (suffix) {
      gotoUrl += `/${suffix}`;
    }
    return gotoUrl;
  }
};
