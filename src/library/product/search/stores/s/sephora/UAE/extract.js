const { transform } = require('./format');
const url = require('../../../../action');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UAE',
    store: 'sephora',
    transform,
    domain: 'sephora.ae',
    zipcode: '',
    url,
  },
  implementation,
};

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { url } = parameters;

  const { productDetails } = dependencies;

  const scrollFunc = await context.evaluate(async function (url) {
    const items = '//div[contains(@class, "search-result-content")]//li';
    var itemsCheck = document.evaluate(items, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (itemsCheck.snapshotLength) {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        // await stall(2500);
        // await new Promise(resolve => setTimeout(resolve, 5000));
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        await new Promise(resolve => setTimeout(resolve, 5000));

        console.log('SCROLLING');
        if (scrollTop === 20000) {
          break;
        }
      }
    }
  }, url);

  await context.evaluate(async function () {
    // appending product rating
    async function appendRating () {
      const rowSelector = '#search-result-items li.grid-tile';
      const fullyFilledStarsSelector = 'div[class*="product-rating"] img[src*="star-full"]';
      const decimalSelector = 'div[class*="product-rating"] svg linearGradient';
      const rows = document.querySelectorAll(rowSelector);
      rows.forEach(row => {
        let rating = row.querySelectorAll(fullyFilledStarsSelector).length;
        const gradientNode = row.querySelector(decimalSelector);
        if (gradientNode && gradientNode.hasAttribute('x1')) {
          let gradientPct = gradientNode.getAttribute('x1');
          gradientPct = parseInt(gradientPct);
          gradientPct = gradientPct / 100;
          rating = gradientPct + rating;
        }
        console.log('AGGGGG: ' + rating);
        if (rating !== 0) {
          row.insertAdjacentHTML('afterbegin', `<div class="prodRating" style='display: none'>${rating}</div>`);
        }
      });
    }
    await appendRating();
  });

  return await context.extract(productDetails, { transform });
}
