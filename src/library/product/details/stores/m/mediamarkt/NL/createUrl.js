
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'mediamarkt.nl',
    prefix: null,
    url: null,
    country: 'NL',
    store: 'mediamarkt',
    zipcode: '',
  },
  implementation: (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { id } = inputs;
    const { domain, prefix, suffix } = parameters;

    const gotoUrl = `https://${domain}/nl/search.html?query=${id}&searchProfile=onlineshop&channel=mmnlnl`;
    return gotoUrl;
  },
};
