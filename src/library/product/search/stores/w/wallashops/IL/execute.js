
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IL',
    store: 'wallashops',
    domain: 'wallashops.co.il',
    url: 'https://www.wallashops.co.il/search/?q={searchTerms}&key=53E19ADA6C79E5D31F177B131615E2D0',
    loadedSelector: 'ul[class*="items_strip_bk"]',
    noResultsXPath: '//h2[contains(text(), "לא נמצאו")]',
    zipcode: '',
  },
};
