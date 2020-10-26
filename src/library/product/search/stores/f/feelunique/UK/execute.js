
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'feelunique',
    domain: 'feelunique.com',
    url: "https://www.feelunique.com/skin/skin-concerns/blemish-prone-problem-skin?q=ACNE&q_typ=f",
    // loadedSelector: '#wrapper',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
