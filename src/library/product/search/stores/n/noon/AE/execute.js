
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AE',
    store: 'noon',
    domain: 'noon.com',
    url: 'https://ar-ae.namshi.com/?q={searchTerms}',
    loadedSelector: 'div#catalog_content',
    noResultsXPath: '//p[contains(text(),"ان الصفحة التي تبحث عنها غير موجودة.")]',
    zipcode: "''",
  },
};
