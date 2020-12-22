const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    while (document.querySelector('button[class*="b048d-less"]') !== null) {
      // @ts-ignore
      document.querySelector('button[class*="b048d-less"]').click();
      await new Promise((resolve, reject) => setTimeout(resolve, 1500));
    };
  });

  await context.evaluate(async () => {
    // @ts-ignore
    if (window !== undefined) {
      return window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  });
  await context.evaluate(async () => {
    // @ts-ignore
    if (window !== undefined) {
      return window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 1500));

  await context.evaluate(async () => {
    const productUrl = document.querySelectorAll('div[class*="ab4-less"] div[data-bx="ple-wrap"] > a');
    const prefix = 'https://www.boxed.com';

    if (productUrl.length !== 0 && productUrl !== null) {
      productUrl.forEach((element) => {
        element.setAttribute('href', prefix.concat(element.getAttribute('href')));
      });
    }
    const prodContainer = document.querySelectorAll('div[class*="ab4-less"] li[data-bx="ple"]');
    if (prodContainer.length !== 0 && prodContainer !== null) {
      prodContainer.forEach((element, index) => {
        element.setAttribute('rank', `${index + 1}`);
      });
    }
    const sponsoredProducts = document.querySelectorAll('div[class*="ab4-less"] li[data-bx*="ple"] div[class*="cc3-less"]');
    // @ts-ignore
    if (sponsoredProducts.length !== 0 && sponsoredProducts !== null) {
      sponsoredProducts.forEach(e => {
        // @ts-ignore
        e.parentNode.parentNode.classList.add('sponsored');
        // @ts-ignore
        e.parentNode.parentNode.setAttribute('sponsored', 'yes');
      });
    }
  });
  await new Promise((resolve, reject) => setTimeout(resolve, 1500));
  await context.evaluate(async () => {
    const notSponsoredProducts = document.querySelectorAll('div[class*="ab4-less"] li[data-bx="ple"]:not([class*="sponsored"])');
    if (notSponsoredProducts.length !== 0 && notSponsoredProducts !== null) {
      notSponsoredProducts.forEach((product, index) => {
        product.setAttribute('rankorganic', `${index + 1}`);
      });
    }
  });

  var dataRef = await context.extract(productDetails, { transform });

  if (dataRef[0].group.length > 150) {
    dataRef[0].group = dataRef[0].group.slice(0, 150);
  }

  return dataRef;
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'boxed',
    transform: transform,
    domain: 'boxed.com',
    zipcode: '',
  },
  implementation,
};
