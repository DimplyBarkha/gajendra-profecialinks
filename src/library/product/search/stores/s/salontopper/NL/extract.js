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
    const prefix = 'https://www.salontopper.nl';
    const productUrl = document.querySelectorAll('div[class*="product-gallery"] a[href*="/product"]');
    productUrl.forEach(e => e.setAttribute('productUrl', prefix.concat(e.getAttribute('href'))));

    const imageUrl = document.querySelectorAll('div.image img');
    imageUrl.forEach(e => e.setAttribute('image', prefix.concat(e.getAttribute('src'))));

    const titles = document.querySelectorAll('div.title')
      ? document.querySelectorAll('div.title') : [];
    // @ts-ignore
    [...titles].map(e => {
      const text = e.innerText.split(' ')[0];
      e.setAttribute('brand', text);
    });
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
