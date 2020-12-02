
const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (inputs, parameters, context, dependencies) {
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
    // If images are present in description then add to manufacturerDescription else add to description
    const manufacturerImageFlag = document.querySelector('div[id="AdditionDescription"] img');
    const descriptionSelector = document.querySelector('div[id="AdditionDescription"]');
    const description = descriptionSelector ? descriptionSelector.innerText : '';
    if (manufacturerImageFlag) {
      addHiddenDiv('added-manufacturerDesc', description);
    } else {
      addHiddenDiv('added-description', description);
    }

    function fetchDetailsFromScript () {
      const scriptTagSelector = document.querySelector('script[type="application/ld+json"]');
      const scriptTagData = scriptTagSelector ? scriptTagSelector.innerText : '';
      let scriptTagJSON = '';
      try {
        scriptTagJSON = scriptTagData ? JSON.parse(scriptTagData) : '';
      } catch (e) {
        console.log('Error in converting text to JSON....');
        scriptTagJSON = '';
      }
      const brand = scriptTagJSON ? scriptTagJSON.brand ? scriptTagJSON.brand.name ? scriptTagJSON.brand.name : '' : '' : '';
      addHiddenDiv('added_brandText', brand);

      // let availabilityText = scriptTagJSON ? scriptTagJSON.offers ? scriptTagJSON.offers.availability ? scriptTagJSON.offers.availability : '' : '' : '';
      // availabilityText = availabilityText && availabilityText.toLowerCase().includes('instock') ? 'In Stock' : 'Out Of Stock';
      // addHiddenDiv('added_availabilityText', availabilityText);
      if(document.querySelector('input[name="buyNow"]')){
        document.querySelector('body').setAttribute('availability','In Stock');     
      } else{
        document.querySelector('body').setAttribute('availability','Out of Stock');
      }

      const price = scriptTagJSON ? scriptTagJSON.offers ? scriptTagJSON.offers.price ? scriptTagJSON.offers.price : '' : '' : '';
      const currency = scriptTagJSON ? scriptTagJSON.offers ? scriptTagJSON.offers.priceCurrency ? scriptTagJSON.offers.priceCurrency : '' : '' : '';
      const wholePrice = currency + ' ' + price;
      addHiddenDiv('added_price', wholePrice);
    }
    fetchDetailsFromScript();
  });
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'wallashops',
    transform,
    domain: 'wallashops.co.il',
    zipcode: '',
  },
  implementation,
};
