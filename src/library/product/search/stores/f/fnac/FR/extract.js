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

  // Clicking on load more button until the specified number of results are loaded
  async function loadResults (results) {
    await context.evaluate(async function (results) {
      let loadMoreButtonSelector = document.querySelector('div[class*="infinite__container"] a');
      while (loadMoreButtonSelector) {
        loadMoreButtonSelector.click();
        await new Promise((resolve) => setTimeout(resolve, 4000));
        loadMoreButtonSelector = document.querySelector('div[class*="infinite__container"] a');
        // Check if number of products exceeds the results value
        const productLengthSelector = document.querySelectorAll('article[class*="Article-itemGroup"]');
        const numberOfProducts = productLengthSelector.length;
        //console.log('numberOfProduct before break ---> ',numberOfProducts);
        if (numberOfProducts >= results) {
          //console.log('numberOfProduct while breking the look ---> ',numberOfProducts);
          break;
        }
      }
    }, results);
  }
  //await loadResults(results);

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
    country: 'FR',
    store: 'fnac',
    transform,
    domain: 'fnac.com',
    zipcode: '',
  },
  implementation,
};
