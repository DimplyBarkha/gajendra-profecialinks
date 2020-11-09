
const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // Function for scrolling and clikcing more results button
  const applyScrollAndClick = async function (context) {
    await context.evaluate(async function () {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      let moreResultsButton = document.querySelector('button[aria-label="Load more"]');
      if (moreResultsButton) {
        do {
          moreResultsButton.scrollIntoView();
          await stall(1000);
          // @ts-ignore
          moreResultsButton.click();
          await stall(2000);
          moreResultsButton = document.querySelector('button[aria-label="Load more"]');
        } while (moreResultsButton);
      }
    });
  };
  await context.evaluate(async function () {
    // is popup?
    const popUpSelector = document.querySelector('button[data-test="accept-all"]');
    if (popUpSelector) {
      // @ts-ignore
      popUpSelector.click();
    }
  });
  // Extractor loading all results on site
  await applyScrollAndClick(context);
  // Code executed after all results are loaded
  await context.evaluate(async function () {
    // AggregateRating formating
    const aggregateRatingSelector = document.querySelectorAll('div[data-test="product-pod-content"] > p > a > span > span > span');
    if (aggregateRatingSelector) {
      aggregateRatingSelector.forEach(element => {
        // @ts-ignore
        const properFormat = element.innerText.replace(/\./, ',');
        // @ts-ignore
        element.innerText = properFormat;
      });
    }
    // Creating rank/rankOrganic
    const allProducts = document.querySelectorAll('article[data-test="product-pod"]');
    if (allProducts) {
      let x;
      for (x = 0; allProducts.length - 1 >= x; x++) {
        allProducts[x].setAttribute('count', `${x + 1}`);
      }
    }
    // Creating thumbnail image url (lazyload on site)
    if (allProducts) {
      allProducts.forEach(element => {
        const idRegex = /tPp(\d+)/;
        const elementId = element.getAttribute('id');
        const matchId = elementId.match(idRegex);
        if (matchId[1]) {
          const thumbnailUrl = `https://ecom-su-static-prod.wtrecom.com/images/products/3/LN_${matchId[1]}_BP_3.jpg`;
          element.setAttribute('thumbnail', thumbnailUrl);
        }
      });
    }
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'waitrose',
    transform,
    domain: 'waitrose.com',
    zipcode: '',
  },
  implementation,
};
