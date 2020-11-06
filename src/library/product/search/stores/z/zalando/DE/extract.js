
const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(() => {
    const allProducts = document.querySelectorAll('div[class*="DvypSJ"]');
    allProducts.forEach((product, index) => {
      product.setAttribute('rank', `${index + 1}`);
    });
    const sponsoredProducts = document.querySelectorAll('div[class*="weHhRC"]');
    // @ts-ignore
    if (sponsoredProducts) {
      sponsoredProducts.forEach(e => {
        // @ts-ignore
        e.parentNode.classList.add('sponsored');
        // @ts-ignore
        e.parentNode.setAttribute('sponsored', 'yes');
      });
    }

    const notSponsoredProducts = document.querySelectorAll('div[class="qMZa55 SQGpu8 iOzucJ JT3_zV DvypSJ"]');
    notSponsoredProducts.forEach((product, index) => {
      product.setAttribute('rankorganic', `${index + 1}`);
    });

    const productUrl = document.querySelectorAll('article > a');
    const prefix = 'https://zalando.de';

    productUrl.forEach((element) => {
      element.setAttribute('href', prefix.concat(element.getAttribute('href')));
    });
  });
  return await context.extract(productDetails, { transform });
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
