module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'petsmart.com',
    timeout: null,
    country: 'US',
    store: 'petsmart',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    // const tempurl = `https://www.petsmart.com`;
    // await context.goto(tempurl, { timeout: 30000 });
    // await context.evaluate(async () => {
    //   const clickButton = document.querySelector('#dp-header > div.row.mobile-header > div.dp-promo2 > div > section > a > div');
    //   if (clickButton) {
    //     clickButton.click();
    //     await new Promise((resolve) => setTimeout(resolve, 20000));
    //   }
    // })
    await context.setBlockAds(false);
    await context.setFirstRequestTimeout(100000);
    await context.goto(url,
      {
        block_ads: false,
        timeout: 100000,
        waitUntil: 'load',
        load_all_resources: true,
        images_enabled: true,
      });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  }
};
