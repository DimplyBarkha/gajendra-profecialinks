
const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise(resolve => setTimeout(resolve, 2000));

  await context.evaluate(() => {
    function addProp (selector, iterator, propName, value) {
      document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
    }
    // const allProducts = document.querySelectorAll('div[class*="DvypSJ"]');
    // for (let i = 0; i < allProducts.length; i++) {
    //   addProp('div[class*="DvypSJ"]', i, 'rank', `${i + 1}`);
    // }
    const sponsoredProducts = document.querySelectorAll('div[class*="weHhRC"]');
    // @ts-ignore
    if (sponsoredProducts) sponsoredProducts.forEach(e => e.parentNode.classList.add('sponsored'));
    const notSponsoredProducts = document.querySelectorAll('div[class="qMZa55 SQGpu8 iOzucJ JT3_zV DvypSJ"]');
    for (let i = 0; i < notSponsoredProducts.length; i++) {
      addProp('div[class="qMZa55 SQGpu8 iOzucJ JT3_zV DvypSJ"]', i, 'rankorganic', `${i + 1}`);
    }
    const productUrl = document.querySelectorAll('article a');
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
