async function implementation(
<<<<<<< HEAD
    inputs,
    parameters,
    context,
    dependencies,
) {
    const { url, zipcode } = inputs;
    const { country, domain, store } = parameters;
    await context.evaluate(async(context) => {
        const changeButton = document.querySelector('button[id="openFulfillmentModalButton"][class*="button"]');
        if (changeButton) {
            console.log('entered if block');
            changeButton.click();
            console.log('button clicked sucessfully');
            await new Promise(resolve => { setTimeout(resolve, 30000) })
        }
        console.log('sucessfully clicked the change button');
    })
    await context.setInputValue('input[aria-labelledby="zipcode"]', `${zipcode}`);
    await context.evaluate(async() => {
        const searchButton = document.querySelector('span[aria-label*="Zipcode"]');
        if (searchButton) {
            searchButton.click()
            console.log('able to click the button')
            await new Promise(resolve => { setTimeout(resolve, 30000) })
        }
        const selectButton = document.querySelector('div[class="card-wrapper"]>div[class="card-store"]:nth-child(1) a[role="button"]');
        if (selectButton) {
            selectButton.click();
        }
        await new Promise(resolve => { setTimeout(resolve, 30000) });
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
=======
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
>>>>>>> 892773279dfcd7b5365c858515a9e107421f971f
