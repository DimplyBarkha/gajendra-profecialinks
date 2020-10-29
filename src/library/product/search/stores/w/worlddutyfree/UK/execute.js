
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'worlddutyfree',
    domain: 'worlddutyfree.com',
    url: "https://worlddutyfree.com/en/catalogsearch/result/?q={searchTerms}",
    loadedSelector: null,
    noResultsXPath: '//div[@class="message notice"]/div',
    zipcode: '',
  },
};
