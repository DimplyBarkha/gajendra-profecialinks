
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'johnbeerens',
    domain: 'johnbeerens.com',
    url: 'https://www.johnbeerens.com/catalogsearch/result/index/?p=2&q={searchTerms}',
    loadedSelector: 'ol.product-list li.product-list__item',
    noResultsXPath: '//div[contains(text(),"Je zoekopdracht heeft geen resultaten opgeleverd.")]',
    zipcode: "''",
  },
};
