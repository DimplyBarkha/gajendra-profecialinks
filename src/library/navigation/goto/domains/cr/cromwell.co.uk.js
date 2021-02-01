
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'cromwell.co.uk',
    timeout: 200000,
    country: 'UK',
    store: 'cromwell',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    // await context.setBlockAds(false);
    // await context.setLoadAllResources(true);
    // await context.setLoadImages(true);
    // await context.setJavaScriptEnabled(true);
    // await context.setAntiFingerprint(false)
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    try {
      await context.waitForSelector('div.row.InfoB,div[class="FamilyDetailsPanel FamilyDetailsPanel_ListView"]')
    } catch (error) {
      console.log('Error Wait For Xpath :',error)
    }
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  }
};
