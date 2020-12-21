const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  // await context.evaluate(async function () {
  //   const isPopupPresent = document.querySelector('p[id*="dialog"] + button');
  //   // @ts-ignore
  //   if (isPopupPresent) isPopupPresent.click();
  // });

  await context.evaluate(async function () {
    // @ts-ignore
    while ([...document.querySelectorAll('button[class*="b05-less _"]')].filter(e => e.innerText.includes('LOAD'))[0] !== undefined) {
      // @ts-ignore
      [...document.querySelectorAll('button[class*="b05-less _"]')].filter(e => e.innerText.includes('LOAD'))[0].click();
      await stall(2000);
    };

    function stall (ms) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
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
      for (let i = 0; i < prodContainer.length; i++) {
        prodContainer[i].setAttribute('rank', `${i + 1}`);
        if (i > 149) break;
      }
    }
    const sponsoredProducts = document.querySelectorAll('div[class*="ab4-less"] li[data-bx*="ple"][rank] div[class*="cc3-less"]');
    // @ts-ignore
    if (sponsoredProducts.length !== 0 && sponsoredProducts !== null) {
      sponsoredProducts.forEach(e => {
        // @ts-ignore
        e.parentNode.parentNode.classList.add('sponsored');
        // @ts-ignore
        e.parentNode.parentNode.setAttribute('sponsored', 'yes');
      });
    }

    const notSponsoredProducts = document.querySelectorAll('div[class*="ab4-less"] li[data-bx="ple"]:not([class*="sponsored"])');
    if (notSponsoredProducts.length !== 0 && notSponsoredProducts !== null) {
      for (let j = 0; j < notSponsoredProducts.length; j++) {
        notSponsoredProducts[j].setAttribute('rankorganic', `${j + 1}`);
        if (j > 149) break;
      }
    }
  });

  return await context.extract(productDetails, { transform });
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
