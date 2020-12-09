// @ts-nocheck
const { transform } = require('./transform');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const privacySelector = '#privacy-layer-accept-all-button';
  const privacyButton = await context.evaluate(
    (selector) => !!document.querySelector(selector),
    privacySelector,
  );
  if (privacyButton) {
    await context.click(privacySelector);
    await context.waitForNavigation({ waitUntil: 'load' });
  }
  const moreSpecsSelector = 'a[class*="ProductFeatures__StyledExpandLink"]';
  const moreSpecs = await context.evaluate(
    (selector) => !!document.querySelector(selector),
    moreSpecsSelector,
  );
  if (moreSpecs) {
    await context.click(moreSpecsSelector);
    await context.waitForNavigation({ waitUntil: 'load' });
  }

  // adding rating count with API since value seems to vary during run.
  async function getRating () {
    const productId = window.location.pathname.match(/([^-]+).html$/)[1];
    const API = `https://www.saturn.de/api/v1/graphql?operationName=GetSelectProduct&variables={"hasMarketplace":false,"id":"${productId}"}&extensions={"pwa":{"salesLine":"Saturn","country":"DE","language":"de"},"persistedQuery":{"version":1,"sha256Hash":"bf21cd23afefaf0e92d339815ffe1da9ed05b7fdbeb5f00dcf5478e5abdfee89"}}`;
    const response = await fetch(API);
    const json = await response.json();
    const rating = json.data && json.data.reviews && json.data.reviews.rating;
    if (rating) {
      document.body.setAttribute('rating-count', rating.count);
    }
  }
  await context.evaluate(getRating);
  await context.evaluate(() => {
    if (document.querySelector('button[class*="ProductFeatures"]')) {
      document
        .querySelector('button[class*="ProductFeatures"]')
        .scrollIntoView();
      // @ts-ignore
      document.querySelector('button[class*="ProductFeatures"]').click();
    }
  });

  try {
    await context.evaluate(() => {
      // @ts-ignore
      const x = window.__PRELOADED_STATE__.apolloState;
      const sku = window.location.href.replace(/(.+-)(\d+)(.htm.+)/g, '$2');
      const y = x[`GraphqlProduct:${sku}`].variants;
      // const variantsId = '';
      let variantsCount = 0;
      const body = document.querySelector('body');
      if (y.length === 1) {
        const variants = y[0].variantProducts;
        variantsCount = variants.length;
        let allVariants = '';
        variants.forEach((variant) => {
          allVariants =
            allVariants + (allVariants ? ' | ' : '') + variant.productId;
        });
        const firstVariant = allVariants.split(' | ')[0];
        body.setAttribute('variants', allVariants);
        body.setAttribute('first-variant', firstVariant);
      }
      body.setAttribute('variants-count', variantsCount.toString());
    });
  } catch (e) {
    console.log(e.message);
  }

  await context.evaluate(async () => {
    const delay = t => new Promise(resolve => setTimeout(resolve, t));
    const videosUrl = [];
    async function clickImages (image) {
      const videos = [...document.querySelectorAll(image)];
      try {
        // Get the Videos to scope
        for (const video of videos){
          await delay(2000);
          video.click();  
          console.log('clicking on play button:');
          await clickTheVideo('#playButton div');
        }
      } catch (err) {
        console.log('Video Loading issues');
      }
    }
    async function clickTheVideo (playButton) {
      const clickButton = [...document.querySelectorAll(playButton)];
      // Click the videos
      for (const button of clickButton){
        await delay(2000);
        button.click();  
      }
    }
    // Call the function to get the images
    await clickImages('div > div > picture > img[alt]');
      
  });
  const requests = await context.searchAllRequests('https://mycliplister.com/jplist/.*', 'GET');
    for (const request of requests) {
    if (request && request.responseBody && request.responseBody.body) {
      const inf = JSON.parse(request.responseBody.body);
      const vidUrl = inf.cliplist.clip.clipurl;
      console.log('VIDEO URL :  ',vidUrl); // This needs to be appended to DOM and extracted
      const videosAll = vidUrl.join(' | ')
      body.setAttribute('video-url', videosAll);
    }
  }

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'saturn',
    transform,
    domain: 'saturn.de',
    zipcode: '',
  },
  implementation,
};
