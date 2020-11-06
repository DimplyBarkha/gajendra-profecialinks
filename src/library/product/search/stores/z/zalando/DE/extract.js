
const { transform } = require('../../../../shared');

// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await context.evaluate(async () => {
    const lang = document.querySelector('div[class*="langNav"] a[href="#"]');
    if (lang !== null) {
      // @ts-ignore
      lang.click();
    };
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const langOpt = document.querySelector('label[for="de-m"]');
    if (langOpt !== null) {
      // @ts-ignore
      langOpt.click();
    };

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const langSave = document.querySelector('button[class*="_buttonPrimary"]');
    if (langOpt !== null) {
      // @ts-ignore
      langSave.click();
    };
  });
  await context.waitForNavigation();

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
  await new Promise((resolve) => setTimeout(resolve, 2000));

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
