module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'brack.ch',
    prefix: null,
    url: 'https://www.brack.ch/search?query={id}',
    country: 'CH',
    store: 'brack',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { id } = inputs;
    const { domain, prefix, suffix } = parameters;

    if (parameters.url) {
      const url = parameters.url.replace('{id}', id);
      return url;
    }
    let gotoUrl = `https://${domain}`;
    if (prefix) {
      gotoUrl += `/${prefix}`;
    }
    gotoUrl += `/${id}`;
    if (suffix) {
      gotoUrl += `/${suffix}`;
    }
    return gotoUrl;
  },
};
