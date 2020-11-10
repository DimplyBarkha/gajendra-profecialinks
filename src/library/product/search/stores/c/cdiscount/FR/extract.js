const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // Function to fetch aggregateRating from script tag as not available on DOM.
    function fetchRatingFromScript () {
      const scriptDataTagSelector = document.evaluate('//script[contains(text(), "RealTimeTracking")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const scriptTagData = scriptDataTagSelector ? scriptDataTagSelector.innerText : '';
      const scriptTagJSONText = scriptTagData ? scriptTagData.replace(/.*tracking\.params=(.*);\$.track.send.*/gm, '$1') : '';
      let scriptTagJSON;
      try {
        scriptTagJSON = scriptTagJSONText ? JSON.parse(scriptTagJSONText) : '';
      } catch (e) {
        console.log('Product Data JSON cannot be parsed...');
      }
      const productsListArray = scriptTagJSON && scriptTagJSON.products ? scriptTagJSON.products : [];
      const ratingArray = [];
      for (let i = 0; i < productsListArray.length; i++) {
        const productObj = productsListArray[i];
        const rating = productObj.rate;
        ratingArray.push(rating);
      }
      return ratingArray;
    }

    // Function to add fetched rating to DOM
    function addRatingToProductBlock () {
      const fetchedRating = fetchRatingFromScript();
      const productBlockSelector = document.querySelectorAll('ul[id="lpBloc"] li[data-sku]');
      if (fetchedRating.length) {
        for (let i = 0; i < productBlockSelector.length; i++) {
          const productBlock = productBlockSelector[i];
          // Adding rating to each product block
          const newDiv = document.createElement('div');
          newDiv.id = 'added_aggregate_rating';
          newDiv.textContent = fetchedRating[i];
          newDiv.style.display = 'none';
          productBlock.appendChild(newDiv);
        }
      }
    }

    // Adding search url to DOM
    const searchURL = window.location.href;
    addHiddenDiv('added_search_url', searchURL);

    addRatingToProductBlock();
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'cdiscount',
    transform,
    domain: 'cdiscount.com',
    zipcode: '',
  },
  implementation,
};
