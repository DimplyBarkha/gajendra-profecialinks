const { transform } = require('../../../../shared');


async function implementation(inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {

    if (document.querySelector('div[role="alertdialog"]') === null) {
      const price = document.querySelector('div[id="productDetailsPanel"] div[class="product-price-panel__price-alt-vat"]')
        ? document.querySelector('div[id="productDetailsPanel"] div[class="product-price-panel__price-alt-vat"]').textContent : '';
      const regex = /(\d+,\d+)/;
      // @ts-ignore
      document.querySelector('body').setAttribute('price', price.match(regex)[1]);


      const products = document.querySelectorAll('span[class="product__brand-name"]')
      const prefix = 'https://www.vikingdirect.nl';
      products.forEach((product, index) => {
        // set product url
        const brandLink = product.querySelector('a').getAttribute('href');
        product.setAttribute('brandLink', prefix + brandLink);
      });
      //if product is not available set availabilityText to Out of Stock
    } else if (document.querySelector('div[role="alertdialog"]').innerText === 'Helaas is dit product niet langer beschikbaar') {
      document.querySelector('body').setAttribute('availabilityText', 'Out of Stock');
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'vikingdirect',
    transform: transform,
    domain: 'vikingdirect.nl',
    zipcode: '',
  },
  implementation,
};