const { transform } = require('../../../../shared');

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
    function addHiddenDiv (i, productCards) {
      const newDiv = document.createElement('div');
      newDiv.id = i;
      newDiv.className = 'extra-info';
      newDiv.style.display = 'none';
      const skuId = productCards[i].querySelector('a').getAttribute('id').split('_sku')[1];
      newDiv.dataset.id = skuId !== undefined ? skuId : productCards[i].querySelector('a').getAttribute('id').split('compare_')[1];
      newDiv.dataset.url = 'https://www.walgreens.com' + productCards[i].querySelector('a').getAttribute('href');
      newDiv.dataset.thumbnail = 'https://' + productCards[i].querySelector('img').getAttribute('src').slice(2);
      const priceDiv = productCards[i].querySelector('div.wag-prod-price-info span.sr-only');
      const re = /\$(\d+) and (\d+) cents/;
      if (priceDiv) {
        const priceText = priceDiv.textContent;
        if (priceText.includes('Sale price')) {
          const price = priceText.split('And')[0];
          newDiv.dataset.price = price.replace(re, '$1.$2');
        } else if (priceText.includes('1 for')) {
          newDiv.dataset.price = (priceText.split('1 for')[1]).replace(/\$*(\d+) dollars and (\d+) cents/, '$1.$2');
        } else {
          const price = priceText;
          newDiv.dataset.price = price.replace(re, '$1.$2');
        }
      }
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
    transform: transform,
    domain: 'walgreens.com',
  },
  implementation,
};
