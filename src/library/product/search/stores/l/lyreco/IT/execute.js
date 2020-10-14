
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'lyreco',
    domain: 'lyreco.com',
    url: 'https://www.lyreco.com/webshop/ITIT/search/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//b[contains(.,"Risultati per")]/following-sibling::b[contains(.,"0")][contains(.,"prodotto")]',
    zipcode: '',
  },
};
