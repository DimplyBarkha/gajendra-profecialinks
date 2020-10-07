
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'pixmania.es',
    timeout: 100000,
    country: 'ES',
    store: 'pixmania',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters,
    context,
    dependencies,
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 100000;
    await context.setJavaScriptEnabled(true);
    await context.setCssEnabled(true);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setBlockAds(false);
    // await context.setAntiFingerprint(false);
    await context.goto(url, {
      timeout: timeout,
      waitUntil: 'load',
      checkBlocked: false,
      cssEnabled: true,
      discardCSPHeader: true,
      embedIframes: true,
      imagesEnabled: true,
      loadAllResources: true,
      force200: true,
      blockAds: false,
      jsEnabled: true,
    });
    return await context.evaluate(async function () {
      async function addEnhancedContent () {
        const div = document.createElement('div');
        div.setAttribute('class', 'IcecatLive -icecat-tabs_body for-title,gallery,featurelogos,essentialinfo,bulletpoints,marketingtext,manuals,reasonstobuy,tours3d,videos,featuregroups,reviews,productstory');
        const script = document.createElement('script');
        script.setAttribute('src', 'https://icecat.biz/stats/scripts/trackLive.js');
        div.append(script);
        await new Promise(resolve => setTimeout(resolve, 2000));
        const gtin = document.querySelector('[data-flix-ean]').getAttribute('data-flix-ean');
        const response = await fetch(`https://live.icecat.biz/api/html?lang=es&content=title,gallery,featurelogos,essentialinfo,bulletpoints,marketingtext,manuals,reasonstobuy,tours3d,videos,featuregroups,reviews,productstory&version=2.0.0&UserName=v.poezevara&GTIN=${gtin}`);
        const html = await response.text();
        div.innerHTML += html;
        document.querySelector('#IcecatLive').append(div);
      }
      await addEnhancedContent();
      const isLoaded = Boolean(document.querySelector('#IcecatLive'));
      console.log(`isLoaded: ${isLoaded}`);
      if (!isLoaded) {
        const script = document.createElement('script');
        script.setAttribute('src', 'https://icecat.biz/stats/scripts/trackLive.js');
        div.append(script);
      }
    });
  },
};
