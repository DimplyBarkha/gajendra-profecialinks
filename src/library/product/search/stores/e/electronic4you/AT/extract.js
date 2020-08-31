const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    function addElementToDocument (elem, id, value) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = value;
      newDiv.style.display = 'none';
      elem.appendChild(newDiv);
    }
    const productsOnPage = document.querySelectorAll('div.category-products>ul>li');
    const numberOfProductsOnPage = productsOnPage ? productsOnPage.length : 0;
    for (let i = 0; i < numberOfProductsOnPage; i++) {
      const item = document.querySelectorAll('div.category-products>ul>li')
        ? document.querySelectorAll('div.category-products>ul>li')[i] : [];
      // @ts-ignore
      const stockStatus = item && item.querySelector('a[title="Informationen zum Versand"]>span')
        // @ts-ignore
        ? item.querySelector('a[title="Informationen zum Versand"]>span').innerText : '';
      // @ts-ignore
      const shippingPrice = item && item.querySelector('span.shipping-price>a')
        // @ts-ignore
        ? item.querySelector('span.shipping-price>a').innerText.replace(/[+]/g, '') : '';
      const shippingInfo = stockStatus + ',' + shippingPrice;
      addElementToDocument(item, 'shippingInfo', shippingInfo);
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AT',
    store: 'electronic4you',
    transform: transform,
    domain: 'electronic4you.at',
    zipcode: '',
  },
  implementation,
};
