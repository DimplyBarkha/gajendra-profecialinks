
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'worlddutyfree',
    nextLinkSelector: '//li[@class="item pages-item-next"]/a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[@class="message notice"]/div',
    openSearchDefinition: null,
    domain: 'worlddutyfree.com',
    zipcode: '',
  },
};
