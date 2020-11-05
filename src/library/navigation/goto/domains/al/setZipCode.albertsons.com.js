async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  await context.evaluate(async (context) => {
    // try {
      console.log('entered thr try block');
      await context.waitForSelector('button[id="openFulfillmentModalButton"][class*="button"]', { timeout: 40000 })
      console.log('button loaded successfully');
      const changeButton = document.querySelector('button[id="openFulfillmentModalButton"][class*="button"]');
      if (changeButton) {
        console.log('entered if block');
        changeButton.click();
        console.log('button clicked sucessfully');
      }
      console.log('sucessfully clicked the change button');
      const filZip = document.querySelector('input[aria-labelledby="zipcode"]');
      // @ts-ignore
      filZip.value = 83642;
      const searchButton = document.querySelector('span[aria-label*="Zipcode"]');
      if (searchButton) {
        searchButton.click()
      }
      console.log('clicked the search button');
      await context.waitForSelector('div[class="card-wrapper"]>div[class="card-store row"]', { timeout: 30000 });
      console.log('our store loaded');
      const selectButton = document.querySelector('div[class="card-wrapper"]>div[class="card-store"]:nth-child(2) a[role="button"]');
      selectButton.click();
      console.log('sucessfully clicked the select button');
      await context.waitForNavigation({ timeout: 3000 })
    // } catch (e) {
    //   console.log('not able to set the zipcode');
    //   console.log(e);
    // }
  })

}
module.exports = {
  implements: 'navigation/goto/setZipCode',
  parameterValues: {
    country: 'US',
    domain: 'albertsons.com',
    store: 'albertsons',
    zipcode: '83642',
  },
  implementation,
};
