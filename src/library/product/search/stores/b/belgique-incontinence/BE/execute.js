
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'belgique-incontinence',
    domain: 'belgique-incontinence.be',
    url: "https://www.belgique-incontinence.be/mag/fr/search_list.php?ctx_search={searchTerms}",
    loadedSelector: 'div#list_contener',
    noResultsXPath: "//p[@class='error']/font",
    zipcode: '',
  },
};
