
const { transform } = require('../../../../shared');

// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async () => {
    const lang = document.querySelector('div[class*="langNav"] a[href="#"]');
    if (lang !== null) {
      // @ts-ignore
      lang.click();
      await new Promise((resolve) => setTimeout(resolve, 2000));
    };

    const langOpt = document.querySelector('label[for="de-m"]');
    if (langOpt !== null) {
      // @ts-ignore
      langOpt.click();
      await new Promise((resolve) => setTimeout(resolve, 2000));
    };

    const langSave = document.querySelector('div[class*="modal"] button[class*="_buttonPrimary"]');
    if (langSave !== null) {
      // @ts-ignore
      langSave.click();
      await new Promise((resolve) => setTimeout(resolve, 2000));
    };
  });
  await new Promise((resolve) => setTimeout(resolve, 1500));

  await context.evaluate(() => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    const searchUrl = window.location.href;
    addElementToDocument('searchurl', searchUrl);
    const names = document.querySelectorAll('header div[class*="hPW"]')
      ? document.querySelectorAll('header div[class*="hPW"]') : [];
    names.forEach(e => e.setAttribute('name', e.innerText.replace('- -', '')));

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
