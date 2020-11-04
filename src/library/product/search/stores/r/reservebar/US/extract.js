const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'reservebar',
    transform,
    domain: 'reservebar.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, dependencies) => {
    await context.evaluate(async () => {
      const keyword = localStorage.getItem('keywords');
      const productNode = document.getElementsByTagName('script');
      const url = window.location.href;
      var collection = '';
      var fetchUrl;
      if (productNode.length) {
        for (var k = 0; k < productNode.length; k++) {
          collection = productNode[k].getAttribute('background-filters.collection_id');
          if (collection) {
            break;
          }
        }
      }
      var encodeUrl = encodeURIComponent(url);
      if (collection) {
        fetchUrl = `https://az4m1n.a.searchspring.io/api/search/search.json?ajaxCatalog=v3&resultsFormat=native&siteId=az4m1n&domain=${encodeUrl}&bgfilter.visible_in_search=1&bgfilter.collection_id=${collection}`;
      } else {
        var encodeKeyword = encodeURIComponent(keyword);
        fetchUrl = `https://az4m1n.a.searchspring.io/api/search/search.json?ajaxCatalog=v3&resultsFormat=native&siteId=az4m1n&domain=${encodeUrl}&bgfilter.visible_in_search=1&q=${encodeKeyword}`;
      }
      const data = await getData(fetchUrl);
      // const productList = document.querySelectorAll('div.col__products ul li');
      const pdList = document.querySelectorAll('ul#products li');
      if (data && data.results && data.results.length) {
        var count = 0;
        pdList.forEach((item1) => {
          const doc = item1;
          if (count <= data.results.length && data.results[count].uid) {
            addElementToDocument(doc, 'fetch-product-id', data.results[count].uid);
            addElementToDocument(doc, 'added-search-url', url);
          }
          count++;
        });
      }
      function addElementToDocument (doc, key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        doc.appendChild(catElement);
      }
      async function getData (url = '') {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        return response.json();
      };
    });
    return await context.extract(dependencies.productDetails, { transform: transformParam });
  },
};
