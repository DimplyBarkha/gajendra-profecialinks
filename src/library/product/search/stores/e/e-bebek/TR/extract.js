// @ts-nocheck
const { transform } = require('../../../../shared');
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function addElementToDocument (id, value) {
      const catElement = document.createElement('div');
      catElement.id = id;
      catElement.innerText = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };
    const searchUrl = window.location.href;
    addElementToDocument('searchurl', searchUrl);
    const products = document.querySelectorAll('section[class="product-list"] div[class*="product gtmProductClick w-100"]');

    products.forEach((product, index) => {
      product.setAttribute('rank', `${index + 1}`);
      const prefix = 'https://www.e-bebek.com';
      const productUrl = product.querySelector('a.product-btn');
      if (productUrl !== undefined) product.setAttribute('producturl', prefix.concat(productUrl.getAttribute('href')));
    });
    [...products].filter(e => e.innerText.includes('Promosyonlu')).forEach(e => e.setAttribute('sponsored', 'true'));
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 1500));
  await context.evaluate(async () => {
    const notSponsoredProducts = document.querySelectorAll('section[class="product-list"] div[class*="product gtmProductClick w-100"]:not([sponsored])');
    if (notSponsoredProducts.length !== 0 && notSponsoredProducts !== null) {
      notSponsoredProducts.forEach((product, index) => {
        product.setAttribute('rankorganic', `${index + 1}`);
      });
    }
  });
  var dataRef = await context.extract(productDetails, { transform });

  dataRef[0].group.forEach((row) => {
    if (row.id) {
      row.id.forEach(item => {
        item.text = item.text ? item.text.toLowerCase() : '';
      });
    }
  });
  return dataRef;
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'e-bebek',
    transform: transform,
    domain: 'e-bebek.com',
    zipcode: '',
  },
  implementation,
};
