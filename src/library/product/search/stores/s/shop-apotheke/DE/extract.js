async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addElementToDocument (item, key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      item.appendChild(catElement);
    }
    const data = window.__PRELOADED_STATE__[0].publicRuntimeConfig.pageProperties.resultsState.rawResults[0].hits;
    if (data) {
      const productList = document.querySelectorAll('div[data-qa-id="result-list-entry"]');
      const paginationDiv = document.querySelector('p[data-qa-id="search-result-result-counter"]');
      let pageStartIndex = paginationDiv ? paginationDiv.innerText.match(/\d+/) : 0;
      pageStartIndex = pageStartIndex ? +pageStartIndex[0] : 1;
      productList && productList.forEach((item, index) => {
        const productData = data[index];
        addElementToDocument(item, 'pd_id', productData.pzn);
        addElementToDocument(item, 'pd_price', productData.priceFormatted);
        addElementToDocument(item, 'pd_manufacturer', productData.manufacturer);
        if (productData.ratingCount) {
          addElementToDocument(item, 'pd_aggregateRating', productData.averageRating);
          addElementToDocument(item, 'pd_reviewCount', productData.ratingCount);
        }
        addElementToDocument(item, 'pd_rank', pageStartIndex);
        pageStartIndex++;
      });
    }
  });
  return await context.extract(productDetails);
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'shop-apotheke',
    transform: null,
    domain: 'shop-apotheke.com',
  },
  implementation,
};
