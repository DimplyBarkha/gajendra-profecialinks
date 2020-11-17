const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }

    await new Promise((resolve, reject) => setTimeout(resolve, 1500));

    // add search url
    const searchUrl = window.location.href;
    addElementToDocument('searchUrl', searchUrl);

    const products = document.querySelectorAll(
      'div[class="productCarouselItemContainer"]');
    const prefix = 'https://www.pnp.co.za';
    const priceReg = /R?\d+/gm;
    products.forEach((product, index) => {
      // set product url
      const productUrl = product.querySelector('a').getAttribute('href');
      product.setAttribute('product_url', prefix + productUrl);
      // set rank
      product.setAttribute('rank', (index + 1).toString());
      // set rating
      const ratingJson = product
        .querySelector('div[class="rating js-ratingCalc "]')
        .getAttribute('data-rating');
      const ratingObject = JSON.parse(ratingJson);
      if (ratingObject) {
        product.setAttribute('rating', ratingObject.rating);
      }
      // set price
      const priceElem = product.querySelector('div[class="item-price"] div');
      const priceOne = priceElem.childNodes[0].textContent.match(priceReg);
      const priceTwo = priceElem.childNodes[1].textContent.match(priceReg);

      let price = '';
      if (priceTwo !== null) {
        price = priceOne + ',' + priceTwo;
      } else {
        price = priceOne.toString();
      }
      product.setAttribute('price', price);
    });

    await new Promise((resolve, reject) => setTimeout(resolve, 1500));
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ZA',
    store: 'picknpay',
    transform: transform,
    domain: 'pnp.co.za',
    zipcode: '',
  },
  implementation,
};
