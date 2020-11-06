
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: 'bipa',
    domain: 'bipa.at',
    url: 'https://www.bipa.at/suche?q={searchTerms}',
  },
};
