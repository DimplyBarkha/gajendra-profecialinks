const { transform } = require('./format');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try {
    await context.waitForSelector("button[aria-label='close']");
    await context.click("button[aria-label='close']");
  } catch (e) {
    console.log('No pop up');
  }
  let count = 0;
  while (true) {
    const nextLink = await context.evaluate(() => {
      const element = document.evaluate("//span[contains(@class,'hbmid active')]/following-sibling::a[contains(@class,'page_list')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (element) {
        return true;
      } else {
        return false;
      }
    });
    if (nextLink && count < 144) {
      await context.extract(productDetails, { transform }, { type: 'APPEND' });
      count += await context.evaluate(() => {
        return document.querySelectorAll("div[id*='prodGrid'] div[class*='prod-widget-responsive']").length;
      });
      console.log('Count of the product', count);
      await context.evaluate(async () => {
        const element = document.evaluate("//span[contains(@class,'hbmid active')]/following-sibling::a[contains(@class,'page_list')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        element && element.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
      });
    } else {
      break;
    }
  }
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'dermstore',
    transform,
    domain: 'dermstore.com',
    zipcode: '',
  },
  implementation,
};
