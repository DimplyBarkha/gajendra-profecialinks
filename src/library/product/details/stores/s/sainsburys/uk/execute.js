
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'Sainsburys',
    domain: 'sainsburys.co.uk',
    loadedSelector: 'h2[class="pt__info__description"] a',
    noResultsXPath: null,
    zipcode: '',
  },
};
