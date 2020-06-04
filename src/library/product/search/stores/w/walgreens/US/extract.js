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
    // @ts-ignore
    const numberOfProductsPerPage = parseInt(document.getElementById('pagenav-items-per-page').value);

    function addHiddenDiv (i, productCards) {
      // @ts-ignore
      const pageNum = document.getElementById('pag-counter') !== null ? parseInt(document.getElementById('pag-counter').value) : 1;
      const newDiv = document.createElement('div');
      newDiv.id = i;
      newDiv.className = 'extra-info';
      newDiv.textContent = pageNum === 1 ? i + 1 : ((pageNum - 1) * numberOfProductsPerPage) + 1 + i;
      newDiv.style.display = 'none';
      newDiv.dataset.id = productCards[i].querySelector('a').getAttribute('id').split('_sku')[1];
      newDiv.dataset.url = 'https://www.walgreens.com' + productCards[i].querySelector('a').getAttribute('href');
      productCards.item(i).appendChild(newDiv);
    }

    const productCards = document.getElementsByClassName('wag-product-card-details');
    let i = 0;
    while (i < productCards.length) {
      if (productCards.item(i).querySelectorAll('.extra-info').length > 0) {
        // @ts-ignore
        document.getElementById(i).remove();
      }
      addHiddenDiv(i, productCards);
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
