const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    // scroll
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    let scrollTop = 0;
    const scrollLimit = 5000;
    while (scrollTop <= scrollLimit) {
      await stall(1000);
      scrollTop += 500;
      window.scroll(0, scrollTop);
    }
  });

  await context.evaluate(async () => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    // add search url
    const searchUrl = window.location.href;
    addElementToDocument('searchUrl', searchUrl);

    const products = document.querySelectorAll(
      'li[class="search-results__result"]');
    const prefix = 'https://www.vikingdirect.nl';
    const shortPrefix = 'https:';
    const regex = /(\d+,\d+)/;
    products.forEach((product, index) => {
      // set product url
      const productUrl = product.querySelector('a').getAttribute('href');
      product.setAttribute('product_url', prefix + productUrl);
      // set img url
      const imageUrl = product.querySelector('img').getAttribute('src');
      product.setAttribute('image_url', shortPrefix + imageUrl);
      // set rank
      product.setAttribute('rank', (index + 1).toString());
      // set price
      const price = product.querySelector('div.product-price-panel__price-alt-vat');
      product.setAttribute('price', price.textContent.match(regex)[1]);
    });

    // if there is only one product
    const onlyOneProduct = document.querySelector('div#productPage') ? document.querySelector('div#productPage') : null;
    if (onlyOneProduct !== null) {
      // set product url
      const url = document.querySelector("link[rel='canonical']").getAttribute('href');
      onlyOneProduct.setAttribute('product_url', url);
      // set price
      const price = document.querySelector('div[id="productDetailsPanel"] div[class="product-price-panel__price-alt-vat"]')
        ? document.querySelector('div[id="productDetailsPanel"] div[class="product-price-panel__price-alt-vat"]').textContent : null;
      onlyOneProduct.setAttribute('price', price.match(regex)[1]);
      // set img url
      const imageUrl = document.querySelector('#productPage div.image-viewer__pre-load-image > picture > img') ? document.querySelector('#productPage div.image-viewer__pre-load-image > picture > img').getAttribute('src') : null;
      if (imageUrl !== null) {
        onlyOneProduct.setAttribute('image_url', shortPrefix + imageUrl);
      }
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'vikingdirect',
    transform: transform,
    domain: 'vikingdirect.nl',
    zipcode: '',
  },
  implementation,
};
