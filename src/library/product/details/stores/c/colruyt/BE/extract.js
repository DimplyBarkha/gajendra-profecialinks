// @ts-nocheck

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

  const mainUrl = await context.evaluate(() => {
    return window.location.href;
  });
  console.log('mainUrl---->', mainUrl);
  let url = '';
  try {
    url = await context.evaluate(() => {
      return document.querySelector('a.product__details-more').href || '';
    });
  } catch (error) {
    console.log('Read more not available');
  }

  // let ingredients = '';
  let totalSugarsPerServing = '';
  let proteinPerServing = '';
  let totalCarbPerServing = '';
  let saturatedFatPerServing = '';
  let totalFatPerServing = '';
  let servingSize = '';
  let caloriesPerServing = '';
  let legalDisclaimer = '';
  let ingredientsList = '';
  let saltPerServing = '';
  let storage = '';
  let gtin = '';
  let quantity = '';

  console.log('url---->', url);
  if (url) {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    try {
      await context.waitForSelector('button#onetrust-accept-btn-handler');
      await context.click('button#onetrust-accept-btn-handler');
    } catch (error) {
      console.log('Cookie button click fail');
    }
    try {
      await context.waitForSelector('p.category');
    } catch (error) {
      console.log('selector not present');
    }
    console.log('In second page');
    // ingredients = await context.evaluate(() => {
    //   console.log('ingredientSelector', document.querySelector('h1'));
    //   const ingredientSelector = document.querySelector('h1');
    //   return ingredientSelector ? ingredientSelector.innerText : '';
    // });
    totalSugarsPerServing = await context.evaluate(() => {
      const totalSugarsPerServingSelector = document.evaluate('//div[contains(@class,"value-left")]//span[contains(text(),"Sucres")]/following-sibling::span[contains(@class,"val-nbr")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return totalSugarsPerServingSelector ? totalSugarsPerServingSelector.innerText : '';
    });
    proteinPerServing = await context.evaluate(() => {
      const proteinPerServingSelector = document.evaluate('//div[contains(@class,"value-left")]//span[contains(text(),"Protéines")]/following-sibling::span[contains(@class,"val-nbr")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return proteinPerServingSelector ? proteinPerServingSelector.innerText : '';
    });
    totalCarbPerServing = await context.evaluate(() => {
      const totalCarbPerServingSelector = document.evaluate('//div[contains(@class,"value-left")]//span[contains(text(),"Total glucides")]/following-sibling::span[contains(@class,"val-nbr")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return totalCarbPerServingSelector ? totalCarbPerServingSelector.innerText : '';
    });
    saturatedFatPerServing = await context.evaluate(() => {
      const saturatedFatPerServingSelector = document.evaluate('//div[contains(@class,"value-left")]//span[contains(text(),"Graisses saturées")]/following-sibling::span[contains(@class,"val-nbr")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return saturatedFatPerServingSelector ? saturatedFatPerServingSelector.innerText : '';
    });
    totalFatPerServing = await context.evaluate(() => {
      const totalFatPerServingSelector = document.evaluate('//div[contains(@class,"value-left")]//span[contains(text(),"Total graisses")]/following-sibling::span[contains(@class,"val-nbr")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return totalFatPerServingSelector ? totalFatPerServingSelector.innerText : '';
    });
    caloriesPerServing = await context.evaluate(() => {
      const caloriesPerServingSelector = document.evaluate('//div[contains(@class,"value-left")]//span[contains(text(),"Énergie kcal")]/following-sibling::span[contains(@class,"val-nbr")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return caloriesPerServingSelector ? caloriesPerServingSelector.innerText : '';
    });
    servingSize = await context.evaluate(() => {
      const servingSizeSelector = document.evaluate('(//div[contains(@class,"value-left")]//p[contains(@class,"subtitle")])[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return servingSizeSelector ? servingSizeSelector.innerText : '';
    });
    legalDisclaimer = await context.evaluate(() => {
      const legalDisclaimerSelector = document.evaluate('//div[contains(@id,"disclaimer")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return legalDisclaimerSelector ? legalDisclaimerSelector.innerText : '';
    });
    ingredientsList = await context.evaluate(() => {
      const ingredientsListSelector = document.evaluate('(//span[contains(@class,"caption")]/following-sibling::text())[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return ingredientsListSelector ? ingredientsListSelector.innerText : '';
    });
    saltPerServing = await context.evaluate(() => {
      const saltPerServingSelector = document.evaluate('(//div[contains(@class,"value-left")]//span[contains(text(),"Sel")]/following-sibling::span[contains(@class,"val-nbr")])[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return saltPerServingSelector ? saltPerServingSelector.innerText : '';
    });
    storage = await context.evaluate(() => {
      const storageSelector = document.evaluate('//span[contains(@class,"caption")]//parent::*/following-sibling::p', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return storageSelector ? storageSelector.innerText : '';
    });
    gtin = await context.evaluate(() => {
      const gtinSelector = document.evaluate('//span[contains(@id,"current_gtin")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return gtinSelector ? gtinSelector.innerText : '';
    });
    quantity = await context.evaluate(() => {
      const quantitySelector = document.evaluate('//p[contains(@class,"brutto")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return quantitySelector ? quantitySelector.innerText : '';
    });
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.setUseRelayProxy(false);
    await context.goto(mainUrl, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    try {
      await context.waitForSelector('button#onetrust-accept-btn-handler');
      await context.click('button#onetrust-accept-btn-handler');
    } catch (error) {
      console.log('Cookie button click fail');
    }
  }

  await context.evaluate(({ totalSugarsPerServing, proteinPerServing, totalCarbPerServing, saturatedFatPerServing, totalFatPerServing, caloriesPerServing, servingSize, legalDisclaimer, ingredientsList, saltPerServing, storage, gtin, quantity }) => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    // addHiddenDiv('servingSize_added', ingredients);
    addHiddenDiv('totalSugarsPerServing_added', totalSugarsPerServing);
    addHiddenDiv('proteinPerServing_added', proteinPerServing);
    addHiddenDiv('totalCarbPerServing_added', totalCarbPerServing);
    addHiddenDiv('totalFatPerServing_added', totalFatPerServing);
    addHiddenDiv('saturatedFatPerServing_added', saturatedFatPerServing);
    addHiddenDiv('caloriesPerServing_added', caloriesPerServing);
    addHiddenDiv('servingSize_added', servingSize);
    addHiddenDiv('legalDisclaimer_added', legalDisclaimer);
    addHiddenDiv('legalDisclaimer_added', ingredientsList);
    addHiddenDiv('legalDisclaimer_added', saltPerServing);
    addHiddenDiv('storage_added', storage);
    addHiddenDiv('gtin_added', gtin);
    addHiddenDiv('quantity_added', quantity);
  }, { totalSugarsPerServing, proteinPerServing, totalCarbPerServing, saturatedFatPerServing, totalFatPerServing, caloriesPerServing, servingSize, legalDisclaimer, ingredientsList, saltPerServing, storage, gtin, quantity });

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BE',
    store: 'colruyt',
    transform,
    domain: 'colruyt.be',
    zipcode: '',
  },
  implementation,
};
