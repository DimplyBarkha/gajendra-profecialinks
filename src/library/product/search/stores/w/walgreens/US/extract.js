async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(() => {
    function addHiddenDiv (i, productCards, productInfo) {
      // @ts-ignore
      pageNum = document.getElementById('pag-counter') !== null ? parseInt(document.getElementById('pag-counter').value) : 1;
      const newDiv = document.createElement('div');
      newDiv.id = i;
      newDiv.className = 'extra-info';
      newDiv.textContent = pageNum === 1 ? i + 1 : ((pageNum - 1) * numberOfProductsPerPage) + 1;
      newDiv.style.display = 'none';
      console.log(productInfo);
      newDiv.dataset.url = 'https://www.walgreens.com' + productInfo[i].productInfo.productURL;
      newDiv.dataset.gtin = productInfo[i].productInfo.upc;
      newDiv.dataset.wic = productInfo[i].productInfo.wic;
      productCards.item(i).appendChild(newDiv);
    }

    const productCards = document.getElementsByClassName('wag-product-card-details');
    // @ts-ignore
    let pageNum = document.getElementById('pag-counter') !== null ? parseInt(document.getElementById('pag-counter').value) : 1;
    // @ts-ignore
    const numberOfProductsPerPage = parseInt(document.getElementById('pagenav-items-per-page').value);

    // @ts-ignore
    const productInfo = window.__APP_INITIAL_STATE__.searchResult.searchData.products;

    let i = 0;
    while (i < productCards.length) {
      if (productCards.item(i).querySelectorAll('.extra-info').length > 0) {
        // @ts-ignore
        document.getElementById(i).remove();
      }
      addHiddenDiv(i, productCards, productInfo);
      i++;
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'walgreens',
    transform: null,
    domain: 'walgreens.com',
  },
  implementation,
};
