
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'foodlion.com',
    store: 'foodlion_28147',
    zipcode: '28147',
  },
  implementation: async ({ zipcode }, parameterValues, context, dependencies) => {
    try {
      await context.waitForSelector('span[id*="modal-close"]');
      await context.click('span[id*="modal-close"]');
    } catch (error) {
      console.log('close  reward message failed.');
    }
    try {
      await context.waitForSelector('span[class*="icon-delete"]');
      await context.click('span[class*="icon-delete"]');
    } catch (error) {
      console.log('close welcome message failed.');
    }
    const homePage = await context.evaluate(() => !document.evaluate('//button[contains(@data-test,"store-button")]//span[contains(text(),"0010")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
    try {
      if (homePage) {
        await context.waitForSelector('button[data-test*="store-button"]');
        await context.click('button[data-test*="store-button"]');
        await context.waitForSelector('input[name*="cityZipInput"]');
        await context.setInputValue('input[name*="cityZipInput"]', zipcode);
        await context.click('button[class*="map-toggle"]');
        await context.waitForSelector('div[class*="store-row"] button[data-test*="store-button"]');
        await context.click('div[class*="store-row"] button[data-test*="store-button"]');
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.log('Failed to set set zipcode');
    }
    try {
      await context.click('span[id*="modal-close"]');
    } catch (error) {
      console.log('close  reward message failed.');
    }
    try {
      await context.waitForXPath('//div[contains(@class,"product-image")]/@style');
    } catch (error) {
      console.log('wait for page load failed!!');
    }
  },
};
