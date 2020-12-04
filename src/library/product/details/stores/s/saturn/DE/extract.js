const { Context } = require('mocha');
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
      const variantsId = '';
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
  // try {
  //   //await delay(15000);
  //   await context.waitForSelector('div[data-test="mms-video-thumbnail"] img');
  //   await context.evaluate(async () => {
  //     // @ts-ignore
  //     let videos = [...document.querySelectorAll('div > div > picture > img[alt]')];
  //     let videosUrl = '';
  //     console.log('videos length', videos.length);
  //     videos.forEach((video) => {
  //       console.log('waiting for 15 second');
  //       video.click();
  //       setTimeout(function () {
  //         // @ts-ignore
  //         document.querySelector('#playButton div').click();
  //       }, 15000);
  //      });
  //      const delay = t => new Promise(resolve => setTimeout(resolve, t));
  //      console.log('Waiting for 10 sec');
  //      delay(10000);
  //     videos.forEach(()=>{
  //       setTimeout(function () {
  //         let url = document
  //           .querySelector('video[preload="auto"]')
  //           .getAttribute('src');
  //         console.log('url is', url);
  //         videosUrl = videosUrl + (videosUrl ? ' | ' : '') + url;
  //       }, 15000);
  //     })
  //     let body = document.querySelector('body');
  //     body.setAttribute('videos', videosUrl);
  //   });
  // } catch (e) {
  //   console.log(e.message);
  // }
  try {
    await context.waitForSelector('div > div > picture > img[alt]', { timeout: 60000 });
    await context.click('div > div > picture > img[alt]');
    const delay = t => new Promise(resolve => setTimeout(resolve, t));
    console.log('Waiting for 10 sec');
    delay(10000);
    await context.waitForSelector('#playButton div', { timeout: 60000 });
    await context.click('#playButton div');
    await context.waitForXPath('//video[@preload="auto"]/@src', { timeout: 60000 });
    await context.evaluate(() => {
      const url = document.querySelector('video[preload="auto"]').getAttribute('src');
      console.log('url is', url);
    });
  } catch (e) {
    console.log(e.message);
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
