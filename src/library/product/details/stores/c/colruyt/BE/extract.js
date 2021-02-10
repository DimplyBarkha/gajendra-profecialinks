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
  let viewArticleNumber;
  try {
    viewArticleNumber = await context.evaluate(() => {
      return document.querySelector('input[name="viewArticleNumber"]').value;
    });
  } catch (error) {
    console.log('Read more not available');
  }
  if (viewArticleNumber) {
    url = 'https://fic.colruytgroup.com/productinfo/fr/cogo/' + viewArticleNumber;
  };

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
  let calciumPerServing = '';
  let SodiumPerServing = '';
  let magnesiumPerServing = '';
  let vitaminAPerServing = '';

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
    totalSugarsPerServing = await context.evaluate(() => {
      const totalSugarsPerServingSelector = document.evaluate('(//span[contains(text(),"Sucres")]/following-sibling::span[contains(@class,"val-nbr")])[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return totalSugarsPerServingSelector ? totalSugarsPerServingSelector.innerText : '';
    });
    proteinPerServing = await context.evaluate(() => {
      const proteinPerServingSelector = document.evaluate('(//span[contains(text(),"Protéines")]/following-sibling::span[contains(@class,"val-nbr")])[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return proteinPerServingSelector ? proteinPerServingSelector.innerText : '';
    });
    totalCarbPerServing = await context.evaluate(() => {
      const totalCarbPerServingSelector = document.evaluate('(//span[contains(text(),"Total glucides")]/following-sibling::span[contains(@class,"val-nbr")])[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return totalCarbPerServingSelector ? totalCarbPerServingSelector.innerText : '';
    });
    saturatedFatPerServing = await context.evaluate(() => {
      const saturatedFatPerServingSelector = document.evaluate('(//span[contains(text(),"Graisses saturées")]/following-sibling::span[contains(@class,"val-nbr")])[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return saturatedFatPerServingSelector ? saturatedFatPerServingSelector.innerText : '';
    });
    totalFatPerServing = await context.evaluate(() => {
      const totalFatPerServingSelector = document.evaluate('(//span[contains(text(),"Total graisses")]/following-sibling::span[contains(@class,"val-nbr")])[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return totalFatPerServingSelector ? totalFatPerServingSelector.innerText : '';
    });
    caloriesPerServing = await context.evaluate(() => {
      const caloriesPerServingSelector = document.evaluate('(//span[contains(text(),"Énergie kcal")]/following-sibling::span[contains(@class,"val-nbr")])[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return caloriesPerServingSelector ? caloriesPerServingSelector.innerText : '';
    });
    servingSize = await context.evaluate(() => {
      const servingSizeSelector = document.evaluate('(//div[contains(@class,"value-left")]//p[contains(@class,"subtitle")])[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return servingSizeSelector ? servingSizeSelector.innerHTML : '';
    });
    legalDisclaimer = await context.evaluate(() => {
      const legalDisclaimerSelector = document.evaluate('//div[contains(@id,"disclaimer")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return legalDisclaimerSelector ? legalDisclaimerSelector.innerText : '';
    });
    ingredientsList = await context.evaluate(() => {
      const ingredientsListSelector = document.evaluate('//span[contains(@class,"caption")]/parent::*', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return ingredientsListSelector ? ingredientsListSelector.innerText : '';
    });
    saltPerServing = await context.evaluate(() => {
      const saltPerServingSelector = document.evaluate('(//span[contains(text(),"Sel")]/following-sibling::span[contains(@class,"val-nbr")])[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return saltPerServingSelector ? saltPerServingSelector.innerText : '';
    });
    storage = await context.evaluate(() => {
      const storageSelector = document.evaluate('//span[contains(@class,"caption")]/parent::*/following-sibling::p[last()]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
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
    calciumPerServing = await context.evaluate(() => {
      const calciumPerServingSelector = document.evaluate('(//span[contains(text(),"Calcium")]/following-sibling::span[contains(@class,"val-nbr")])[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return calciumPerServingSelector ? calciumPerServingSelector.innerText : '';
    });
    SodiumPerServing = await context.evaluate(() => {
      const SodiumPerServingSelector = document.evaluate('(//span[contains(text(),"Sodium")]/following-sibling::span[contains(@class,"val-nbr")])[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return SodiumPerServingSelector ? SodiumPerServingSelector.innerText : '';
    });
    magnesiumPerServing = await context.evaluate(() => {
      const magnesiumPerServingSelector = document.evaluate('(//span[contains(text(),"Magnésium")]/following-sibling::span[contains(@class,"val-nbr")])[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return magnesiumPerServingSelector ? magnesiumPerServingSelector.innerText : '';
    });
    vitaminAPerServing = await context.evaluate(() => {
      const vitaminAPerServingSelector = document.evaluate('(//span[contains(text(),"Magnésium")]/following-sibling::span[contains(@class,"val-nbr")])[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      return vitaminAPerServingSelector ? vitaminAPerServingSelector.innerText : '';
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
    addHiddenDiv('proteinPerServing_added', proteinPerServing);
    addHiddenDiv('totalCarbPerServing_added', totalCarbPerServing);
    addHiddenDiv('totalFatPerServing_added', totalFatPerServing);
    addHiddenDiv('saturatedFatPerServing_added', saturatedFatPerServing);
    addHiddenDiv('caloriesPerServing_added', caloriesPerServing);
    addHiddenDiv('servingSize_added', servingSize);
    addHiddenDiv('legalDisclaimer_added', legalDisclaimer);
    addHiddenDiv('ingredientsList_added', ingredientsList);
    addHiddenDiv('saltPerServing_added', saltPerServing);
    addHiddenDiv('storage_added', storage);
    addHiddenDiv('gtin_added', gtin);
    addHiddenDiv('quantity_added', quantity);
    addHiddenDiv('calciumPerServing_added', calciumPerServing);
    addHiddenDiv('SodiumPerServing_added', SodiumPerServing);
    addHiddenDiv('magnesiumPerServing_added', magnesiumPerServing);
    addHiddenDiv('vitaminAPerServing_added', vitaminAPerServing);
    let desc = document.querySelector('p.product__details');
    if (desc) {
      var descList1;
      let description1 = '';

      descList1 = document.querySelectorAll('p.product__details');
      console.log('descList1', descList1);
      descList1.forEach((element) => {
        console.log('element', element);
        description1 +=
          element.innerHTML + " ";
      });
      addHiddenDiv('description_added', description1);
    }
    let sku = document.evaluate('//script[contains(text(),"product_sku")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (sku) {
      let sku1;
      sku = sku ? sku.innerText : '';
      // eslint-disable-next-line prefer-const
      sku1 = sku.replace(/(.+)product_sku\s:\s([^,]+)(.+)/ms, '$2');
      addHiddenDiv('sku_added', sku1);
    }
  }, { totalSugarsPerServing, proteinPerServing, totalCarbPerServing, saturatedFatPerServing, totalFatPerServing, caloriesPerServing, servingSize, legalDisclaimer, ingredientsList, saltPerServing, storage, gtin, quantity, calciumPerServing, SodiumPerServing, magnesiumPerServing, vitaminAPerServing });

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
