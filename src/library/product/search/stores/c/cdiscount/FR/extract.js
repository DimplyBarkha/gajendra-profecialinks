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
    // Adding search url to DOM
    const searchURL = window.location.href;
    addHiddenDiv('added_search_url', searchURL);

    // Fetching aggregateRating from script tag as not available on DOM.
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
    for (let i = 0; i < productsListArray.length; i++) {
      const productObj = productsListArray[i];
      const rating = productObj.rate;
      console.log(rating);
    }
    // Adding rating to DOM
    // code here
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
