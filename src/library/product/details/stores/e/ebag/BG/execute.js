
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BG',
    store: 'ebag',
    domain: 'ebag.bg',
    loadedSelector: 'div[id=detailed-view]',
    noResultsXPath: '//h3[contains(text(),"Страницата не е намерена")]',
    zipcode: '',
  },
};
