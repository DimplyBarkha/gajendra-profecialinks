
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'GR',
    store: 'hondoscenter',
    domain: 'hondoscenter.com',
    url: 'https://www.hondoscenter.com/CachedServices/api/Product/GetScrolledProductList?search-for={searchTerms}&lang=en&templateCode=search_products&configCode=&itemId=88338&itemPath=1755772414&pageNumber=1&pageSize=150&sortKey=default&fullPath=%2C1%2C126315%2C2%2C88276%2C88338%2C#[!opt!]{"type":"json"}[/!opt!]',
    loadedSelector: 'td.Items.depth_1 > table > tbody > tr > td.LISTITEM_9872649.depth_2 > table > tbody > tr',
    noResultsXPath: 'div.alert.alert-danger',
    zipcode: '',
  },
};
