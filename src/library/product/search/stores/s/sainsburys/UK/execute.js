
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'sainsburys',
    domain: 'sainsburys.co.uk',
    url: 'https://www.sainsburys.co.uk/webapp/wcs/stores/servlet/SearchDisplayView?&storeId=10151&langId=44&searchTerm={searchTerms}',
    loadedSelector: 'div#productsContainer ul.productLister li',
    noResultsXPath: '//div[@id="content"]//h1[contains(text(),"There are no products on this shelf at the moment")] | //div[@id="content"]//p[contains(text(),"Sorry, we couldn\'t find any results")] | //div[@id="content"]//*[contains(text(),"We didn\'t find anything for")]',
  },
};
