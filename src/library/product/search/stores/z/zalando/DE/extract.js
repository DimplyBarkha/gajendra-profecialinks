
const { transform } = require('./shared');

// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve) => setTimeout(resolve, 1500));
  await context.evaluate(async () => {
    const cookies = document.querySelector('button[id="uc-btn-accept-banner"]')
      ? document.querySelector('button[id="uc-btn-accept-banner"]') : null;
    if (cookies !== null) {
      // @ts-ignore
      cookies.click();
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  });
  await context.evaluate(() => {
    const sponsoredProducts = document.querySelectorAll('div[class*="weHhRC"]');
    // @ts-ignore
    if (sponsoredProducts.length !== 0) {
      sponsoredProducts.forEach(e => {
        // @ts-ignore
        e.parentNode.classList.add('sponsored');
        // @ts-ignore
        e.parentNode.setAttribute('sponsored', 'yes');
      });
    }

    const productUrl = document.querySelectorAll('article > a');
    productUrl.forEach((element) => {
      element.setAttribute('href', 'https://zalando.de'.concat(element.getAttribute('href')));
    });
  });

  var dataRef = await context.extract(productDetails, { transform });

  dataRef.forEach(e => {
    e.group.forEach((row) => {
      if (row.id) {
        row.id.forEach(item => {
          item.text = item.text ? item.text.toUpperCase() : '';
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text ? item.text.split('ab').pop().trim() : '';
        });
      }
    });
  });

  return dataRef;
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'zalando',
    transform: transform,
    domain: 'zalando.de',
    zipcode: '',
  },
  implementation,
};
