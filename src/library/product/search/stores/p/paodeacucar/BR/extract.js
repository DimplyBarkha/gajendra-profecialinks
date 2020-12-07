
const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'paodeacucar',
    transform,
    domain: 'paodeacucar.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 7000));
    await context.evaluate(async function () {
      const lastProductPosition = localStorage.getItem('prodCount') ? Number(localStorage.getItem('prodCount')) : 1;
      const products = document.querySelectorAll('div[class^="product-cardstyles__Container"]');
      for (let i = 0; i < products.length; i++) {
        const productUrlElem = products[i].querySelector('text[class^="product-cardstyles__Text"] a');
        const productUrl = productUrlElem ? productUrlElem.getAttribute('href') : null;
        if (productUrl) {
          const productLink = productUrl.includes('https://www.paodeacucar.com/') ? productUrl : 'https://www.paodeacucar.com' + productUrl;
          products[i].setAttribute('product_link', productLink);
        } else {
          products[i].setAttribute('product_link', '');
        }
        products[i].setAttribute('rank', `${lastProductPosition + i}`);
      }
      localStorage.setItem('prodCount', `${lastProductPosition + products.length}`);
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    return await context.extract(productDetails, { transform });
  },
};
