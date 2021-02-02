
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'allbeauty',
    domain: 'allbeauty.com',
    url: 'https://www.allbeauty.com/gb/en/search/?q={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="global-message bdr-b__grey2 flex flex-jc gutters"]/span/b/text()',
    zipcode: '',
  },
};
