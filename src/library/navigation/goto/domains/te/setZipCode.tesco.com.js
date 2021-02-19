async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { url, zipcode, storeId } = inputs;
  await context.goto('https://www.tesco.com/');
  //selecting cookie
  try{
    await context.click('button[class*=beans-cookies-notification]');
  }
  catch(e){
    console.log('No cookie button');
  }
  //Clicking on sign-in
  await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
  await context.waitForSelector('div[class*="utility-option"]>a[title="Sign in"]', {timeout: 40000});
    await context.click('div[class*="utility-option"]>a[title="Sign in"]');
    await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
  await context.waitForSelector('input[type="email"]', {timeout: 40000});
  await context.setInputValue('input[type="email"]', 'abhisek.d@partner.import.io');
  await context.setInputValue('input[type="password"]', 'Fukrey@85856');
  await context.click('button.ui-component__button');
  await context.waitForNavigation({ timeout: 40000, waitUntil: 'load' });
  await context.evaluate(async () => {
    const storeLocator = document.querySelector('a[title="Store locator"]');
    if (storeLocator) {
      console.log('entered if block');
      storeLocator.click();
      console.log('button clicked sucessfully');
    }
  });
  await context.waitForSelector('div.drop-down-search input',{timeout: 40000});
  await context.setInputValue('div.drop-down-search input', `${zipcode}`);
  //Clicking on zipcode selector
  await context.waitForSelector('#store-locator-tab > div > form > fieldset > div > button');
  await context.click('#store-locator-tab > div > form > fieldset > div > button');
  //Selecting store
  await context.waitForNavigation({ timeout: 40000, waitUntil: 'load' });
  await context.evaluate((storeId) => {
    if (storeId) {
      const selectElementAll = document.querySelectorAll("div.store-list i[class*=store-number]");
      // @ts-ignore
      const ourElement = [...selectElementAll].find((element) => element.getAttribute('title').includes(`${storeId}`));
      ourElement.click();
      const storeDetails = document.querySelector("a.ddl-btn-primary-link");
      storeDetails.click();
    }
  },storeId);
  await context.goto(url);
  await context.waitForSelector('div.product-image--wrapper');
  await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
  await context.evaluate((inputs) => {
    const zipcodeDiv = document.querySelector('div.product-image--wrapper');
    zipcodeDiv.setAttribute('storeid', inputs.storeId);
    zipcodeDiv.setAttribute('zipcode', inputs.zipcode);
    console.log('appended the zipinformation successfully');
  }, inputs);
}
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'UK',
    domain: 'tesco.com',
    store: 'tesco',
    zipcode: '',
  },
  implementation,
};