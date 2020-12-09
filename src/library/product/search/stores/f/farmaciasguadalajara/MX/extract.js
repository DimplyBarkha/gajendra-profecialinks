const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addAttribute (productListSelector, iterator, attrName, value) {
      const list = document.querySelectorAll(productListSelector);
      list[iterator].setAttribute(attrName, value);
    }

    const listOfProducts = document.querySelector('div.product_listing_container ul li .product') ? document.querySelectorAll('div.product_listing_container ul li .product') : [];
    if (listOfProducts) {
      listOfProducts.forEach((element, index) => {
        const productUrl = element.querySelector('div.product_info div.product_name a').getAttribute('href');
        addAttribute('div.product_listing_container ul li .product', index, 'data-product-url', productUrl);
        const regex = /\d*$/g;
        const result = productUrl.match(regex);
        const price = element.querySelector('.product_price > span.price') ? element.querySelector('.product_price > span.price').innerText.replace('.', ',') : '';
        addAttribute('div.product_listing_container ul li .product', index, 'data-product-id', result[0]);
        addAttribute('div.product_listing_container ul li .product', index, 'data-product-rank', index + 1);
        addAttribute('div.product_listing_container ul li .product', index, 'data-product-price', price);
      });
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'farmaciasguadalajara',
    transform,
    domain: 'farmaciasguadalajara.com',
    zipcode: '',
  },
  implementation,
};
