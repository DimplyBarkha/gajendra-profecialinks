const { transform } = require('../format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    // if(price-format__main-price)
    document.querySelectorAll('div[class="product-result__wrapped-results"] div.product-pod').forEach(node => {
      let priceBlock = node.querySelector('div.price-format__main-price');
      if (priceBlock) {
        // @ts-ignore
        priceBlock = priceBlock.children;
        const currency = (priceBlock[0] && priceBlock[0].innerText) || '';
        let price = (priceBlock[1] && priceBlock[1].innerText) || '';
        const decimalPrice = (priceBlock[2] && priceBlock[2].innerText) || '';
        price = decimalPrice ? `${currency}${price}.${decimalPrice}` : `${currency}${price}`;
        const newDiv = document.createElement('span');
        newDiv.className = 'price_main';
        newDiv.textContent = price.toString();
        newDiv.style.display = 'none';
        node.appendChild(newDiv);
      }
    });
  });
  return await context.extract(productDetails, { transform: parameters.transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'homedepot',
    transform,
    domain: 'homedepot.com',
  },
  implementation,
};
