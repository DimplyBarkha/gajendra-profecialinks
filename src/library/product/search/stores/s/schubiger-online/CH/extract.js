
const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  let { results } = inputs;
  results = results || 150;

  // If cookie pop up appears then clicking on accept button
  await context.evaluate(async function () {
    const cookieButtonSelector = document.querySelector('button[class*="accept-all-btn"]');
    cookieButtonSelector && cookieButtonSelector.click();
  });

  // Clicking on load more button until the specified number of results are loaded
  async function loadResults (results) {
    await context.evaluate(async function (results) {
      let loadMoreButtonSelector = document.querySelector('div[class*="load-more-button"] a[role="button"]');
      while (loadMoreButtonSelector) {
        loadMoreButtonSelector.click();
        await new Promise((resolve) => setTimeout(resolve, 3000));
        loadMoreButtonSelector = document.querySelector('div[class*="load-more-button"] a[role="button"]');
        // Check if number of products exceeds the results value
        const productLengthSelector = document.querySelectorAll('div[class*="c-product-grid__item-wrapper"] div[class*="grid__item"]');
        const numberOfProducts = productLengthSelector.length;
        if (numberOfProducts >= results) {
          break;
        }
      }
    }, results);
  }
  await loadResults(results);

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    // Adding search url to DOM
    const searchURL = window.location.href;
    addHiddenDiv('added_search_url', searchURL);
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'schubiger-online',
    transform,
    domain: 'schubiger-online.ch',
    zipcode: '',
  },
  implementation,
};
