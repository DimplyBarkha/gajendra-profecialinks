module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'romeos',
    domain: 'martinplace.romeosonline.com.au',
    loadedSelector: 'div.search_results',
    noResultsXPath: '//h1/span[@class="weak" and text()="Whoops!"] | //div[@class="MoreInfo"]//strong[text()="No longer available"]',
    zipcode: '',
  },
};
