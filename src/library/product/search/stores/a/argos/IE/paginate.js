
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'argos',
    nextLinkSelector: 'div.paginglinks > a:last-child',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'img.searchProductImgList',
    noResultsXPath: '//div[@class="error"] | /html/body[not(//div[@id="searchcontent"])]',
    openSearchDefinition: null,
    domain: 'argos.ie',
    zipcode: '',
  },
};
