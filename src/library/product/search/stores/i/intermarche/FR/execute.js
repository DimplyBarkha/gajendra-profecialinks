
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'intermarche',
    domain: 'intermarche.com',
    url: 'https://www.intermarche.com/rechercheproduits/02111/recherche/{searchTerms}',
    loadedSelector: 'div[class*="styled__ProductGridWrapper"]',
    noResultsXPath: '//div[contains(@class,"NoResultSearch")]',
    zipcode: '',
  },
};
