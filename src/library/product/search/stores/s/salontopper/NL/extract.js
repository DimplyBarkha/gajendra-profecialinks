const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    // @ts-ignore
    if (window !== undefined) {
      return window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  });

  await new Promise((resolve, reject) => setTimeout(resolve, 2000));

  await context.evaluate(() => {
    function addElementToDocument (id, value) {
      const catElement = document.createElement('div');
      catElement.id = id;
      catElement.innerText = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };
    const searchUrl = window.location.href;
    addElementToDocument('searchurl', searchUrl);

    const prefix = 'https://www.salontopper.nl';
    const productUrl = document.querySelectorAll('div[class*="product-gallery"] a[href*="/product"]');
    productUrl.forEach(e => e.setAttribute('producturl', prefix.concat(e.getAttribute('href'))));

    const imageUrl = document.querySelectorAll('div.image img');
    imageUrl.forEach(e => e.setAttribute('image', prefix.concat(e.getAttribute('src'))));

    function addProp (selector, iterator, propName, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    }
    const allProducts = document.querySelectorAll('div[class*="product-gallery"] div.cell');
    for (let i = 0; i < allProducts.length; i++) {
      addProp('div[class*="product-gallery"] div.cell', i, 'rankorganic', `${i + 1}`);
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'salontopper',
    transform: transform,
    domain: 'salontopper.nl',
    zipcode: '',
  },
  implementation,
};
