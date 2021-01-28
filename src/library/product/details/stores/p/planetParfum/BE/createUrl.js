
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'planetparfum.com',
    prefix: null,
    url: null,
    country: 'BE',
    store: 'planetParfum',
    zipcode: '',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const providedInput = inputs.id.match(/[\d_]+/) ? inputs.id.match(/[\d_]+/)[0] : inputs.id;
    const productUrl = `https://www.planetparfum.com/fr/searchresults?q=${providedInput}`;
    return productUrl;
  },
};
