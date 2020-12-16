async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { url, zipcode, storeId } = inputs;
  console.log('Mamatha inputs store id' + storeId);
  console.log('Mamatha inputs store id' + zipcode);
  // console.log('Mamatha inputs store id' + storeId.toString());
  await context.evaluate(async () => {
    const isCookie = document.querySelector('button[id="cookieConsentClose"]');
    if (isCookie) {
      isCookie.click();
    }
    const changeButton = document.querySelector('div [class*="reserve-nav__instore"] > button');
    if (changeButton) {
      changeButton.click();
      console.log('Change button clicked sucessfully');
      await new Promise(resolve => { setTimeout(resolve, 15000); });
    }
  });

  await context.setInputValue('div [class*="fulfillment-content__search"] > input', `${zipcode}`);
  await context.click('span[aria-label="search Zipcode"]');
  await context.waitForSelector('div.tabs-wrapper__tabs-content');

  await context.evaluate(async (storeId) => {
    // const searchButton = document.querySelector('div [class*="fulfillment-content__search"] > span');
    // if (searchButton) {
    //   searchButton.click();
    //   await new Promise(resolve => { setTimeout(resolve, 15000); });
    //   console.log('able to click the button');
    // }
    // if (storeId) {
    await new Promise(resolve => { setTimeout(resolve, 10000); });
    console.log('Mamatha' + storeId);
    console.log(`//p[contains(.,${storeId})]/parent::div/parent::div/following-sibling::div//a[contains(@class,"card-store-btn")]`);
    const xpath = `//p[contains(.,${storeId})]/parent::div/parent::div/following-sibling::div//a[contains(@class,"card-store-btn")]`;
    const isClick = document.evaluate(xpath, document).iterateNext();
    if (isClick) {
      isClick.click();
    }
    // }
    // else {
    //   const selectButton = document.querySelector('div[class="card-wrapper"]>div[class="card-store"]:nth-child(1) a[role="button"]');
    //   if (selectButton) {
    //     selectButton.click();
    //   }
    // }
    await new Promise(resolve => { setTimeout(resolve, 15000); });
  }, storeId);
  await context.goto(url, { timeout: 60000, waitUntil: 'networkidle0' });
  // , checkBlocked: true, block_ads: false, load_all_resources: true, images_enabled: true, discard_CSP_header : true
  await context.waitForSelector('div.product-heading');
  // await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
  // await context.evaluate((inputs) => {
  //   const zipcodeDiv = document.querySelector('picture>img');
  //   zipcodeDiv.setAttribute('storeid', inputs.storeId);
  //   zipcodeDiv.setAttribute('zipcode', inputs.zipcode);
  //   console.log('appended the zipinformation successfully');
  // }, inputs);
}
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'safeway.com',
    store: 'safeway',
    zipcode: '',
  },
  implementation,
};
