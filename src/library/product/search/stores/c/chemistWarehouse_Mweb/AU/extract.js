const { transform } = require('../shared')
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'chemistWarehouse_Mweb',
    transform,
    domain: 'chemistwarehouse.com.au',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // try {
  //   await context.waitForSelector("button[aria-label='close']");
  //   await context.click("button[aria-label='close']");
  // } catch (e) {
  //   console.log('No pop up');
  // }
  let count = 0;
  while (true) {
    await context.extract(productDetails, { transform }, { type: 'APPEND' });
    count += await context.evaluate(() => {
      return document.querySelectorAll("div.search__result__product__list div.row div.col-xs-4.search__result__product").length;
    });
    const nextLink = await context.evaluate(() => {
      const element = document.evaluate('//div[@class="search__result__products row"]/following-sibling::div[@class="search__result__pager row"][1]//div[contains(@class, "search__result__pager-list")]//button[@class="search__result__pager-button--active search__result__pager-button"]/following-sibling::button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (element) {
        return true;
      } else {
        return false;
      }
    });
    // await context.waitForXpath("//span[contains(@class,'hbmid active')]/following-sibling::a[contains(@class,'page_list')]", { timeout: 60000 });
    if (nextLink && count < 150) {
      await context.evaluate(async () => {
        const element = document.evaluate('//div[@class="search__result__products row"]/following-sibling::div[@class="search__result__pager row"][1]//div[contains(@class, "search__result__pager-list")]//button[@class="search__result__pager-button--active search__result__pager-button"]/following-sibling::button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Elemdsfsdfdent' + element);
        // @ts-ignore
        element && element.click();
        await new Promise(resolve => setTimeout(resolve, 2000));
      });
    } else {
      break;
    }
  }
  return await context.extract(productDetails, { transform });
}