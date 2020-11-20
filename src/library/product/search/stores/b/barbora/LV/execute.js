
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'LV',
    store: 'barbora',
    domain: 'barbora.lv',
    url: 'https://www.barbora.lv/meklet?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="b-warning"]',
    zipcode: '',
  },
};
