const { transform } = require('../shared');
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const mainUrl = await context.evaluate(() => {
    return window.location.href;
  });
  let mainUrlWithDomain = '';
  mainUrlWithDomain = mainUrl.includes('https://www.doz.pl') ? mainUrl : 'https://www.doz.pl' + mainUrl;
  if (mainUrlWithDomain) {
    await context.goto(mainUrlWithDomain, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
  }
  await context.evaluate(({ totalSugarsPerServing, proteinPerServing, totalCarbPerServing, saturatedFatPerServing, totalFatPerServing, caloriesPerServing, servingSize, legalDisclaimer, ingredientsList, saltPerServing, storage, gtin, quantity, calciumPerServing, SodiumPerServing, magnesiumPerServing, vitaminAPerServing }) => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    // addHiddenDiv('servingSize_added', ingredients);
    addHiddenDiv('totalSugarsPerServing_added', totalSugarsPerServing);
  }, { totalSugarsPerServing });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'doz',
    transform: transform,
    domain: 'doz.pl',
    zipcode: '',
  },
  implementation,
};
