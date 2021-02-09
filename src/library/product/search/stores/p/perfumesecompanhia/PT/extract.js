
const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const checkIfLoadMoreButtonIsPresent = async () => {
    return await context.evaluate(async () => {
      const button = document.querySelector('button#btnVerMais');
      if (!button) {
        return false;
      } else if (button.getAttribute('style') && button.getAttribute('style').includes('none')) {
        return false;
      } else {
        return true;
      }
    });
  };
  const countProducts = async () => {
    return await context.evaluate(async () => {
      return document.querySelectorAll('div#containerResultsFilter div.active[id]').length;
    });
  };

  let isLoadMoreButtonPresent = await checkIfLoadMoreButtonIsPresent();
  let productsAmount = await countProducts();
  let clicksAmount = 0;

  while (isLoadMoreButtonPresent && productsAmount < 150 && clicksAmount < 20) {
    await context.click('button#btnVerMais');
    // await context.waitForXPath(`(//div[@id="containerResultsFilter"]//div[contains(@class, " active") and @id])[${productsAmount + 1}]`);
    isLoadMoreButtonPresent = await checkIfLoadMoreButtonIsPresent();
    productsAmount = await countProducts();
    clicksAmount++;
  }

  await context.evaluate(async () => {
    const searcUrl = window.location.href;
    const products = document.querySelectorAll('div#containerResultsFilter div.active[id]');
    products.forEach(product => {
      // full name
      const collectData = (selector) => {
        return product.querySelector(selector) ? product.querySelector(selector).textContent : '';
      };
      const brand = collectData('h3');
      const name = collectData('h2');
      const info = collectData('div.tipo');
      const variant = collectData('li > div.mini-tab.active');
      const fullName = `${brand} ${name} ${info} ${variant}`.trim();
      product.setAttribute('fullname', fullName);
      // search url
      product.setAttribute('searchurl', searcUrl);
      // rating
      const rating = product.querySelector('div.star-ratings-css-top');
      if (rating && rating.getAttribute('style')) {
        const ratingPercentage = rating.getAttribute('style').match(/width: ([\d.]+)%/) ? Number(rating.getAttribute('style').match(/width: ([\d.]+)%/)[1]) : 0;
        if (ratingPercentage) {
          const ratingValue = (ratingPercentage / 20).toFixed(1).replace('.', ',');
          product.setAttribute('rating', ratingValue);
        }
      }
    });
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PT',
    store: 'perfumesecompanhia',
    transform: transform,
    domain: 'perfumesecompanhia.pt',
    zipcode: '',
  },
  implementation,
};
