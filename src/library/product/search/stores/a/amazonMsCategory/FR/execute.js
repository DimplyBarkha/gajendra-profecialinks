
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'amazonMsCategory',
    domain: 'amazon.fr',
    url: 'https://www.amazon.fr/gp/bestsellers/*/{searchTerms}',
    zipcode: '',
  },
};
