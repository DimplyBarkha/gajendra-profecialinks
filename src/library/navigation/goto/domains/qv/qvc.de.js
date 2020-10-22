
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'qvc.de',
    timeout: 50000,
    country: 'DE',
    store: 'qvc',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    const responseStatus = await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 250000,
      waitUntil: 'load',
      checkBlocked: true,
      embed_iframes: true,
    });
    console.log('response Status :', responseStatus.status);
    console.log('response URL :', responseStatus.url);
    // console.log(' search or core or both'+url);
    if (!url.includes('searchtext')) {
      await dependencies.setZipCode({ url, zipcode });
      let searchBtn = 'button[id="searchsubmit_ondemand"]';
      searchBtn = await context.evaluate((searchBtn) => {
        if (document.querySelector(searchBtn)) { return searchBtn; }
      }, searchBtn);
      const branchEnquiry = 'a[title="Filialanfrage"]';
      if (searchBtn) {
        await context.click(branchEnquiry);
        await context.waitForSelector('div[class="filialen hidden"]');
        const inputSelector = 'div[class="perimeter-wrap"] input[id="zipcodeorcity"]';
        const storeSearchBtn = 'button[id="storesearchsubmit"]';
        await context.setInputValue(inputSelector, zipcode);
        await context.click(storeSearchBtn);
      }
    };
}
};
