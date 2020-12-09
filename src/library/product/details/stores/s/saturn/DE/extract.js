// @ts-nocheck
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
  const request = await context.searchForRequest('.*jplist.*', 'GET');
  console.log('search for request', request);
  // await context.evaluate(() => {
  //   const videosUrl = [];
  //   function clickImages (image) {
  //     const videos = [...document.querySelectorAll(image)];
  //     try {
  //       // Get the Videos to scope
  //       videos.map(e => { e.click(); });
  //     } catch (err) {
  //       console.log('Video Loading issues');
  //     }
  //   }

  //   function clickTheVideo (playButton) {
  //     const clickButton = [...document.querySelectorAll(playButton)];
  //     // Click the videos
  //     clickButton.map(e => {
  //       setInterval(function () {
  //         e.click();
  //       }, 7000);
  //     });
  //   }

  //   // Call the function to get the images
  //   clickImages('div > div > picture > img[alt]');

  //   setTimeout(function () {
  //     console.log('Clicking the Play Button');
  //     clickTheVideo('#playButton div');

  //   }, 7000);

  // await context.waitForSelector('video[preload="auto"]');
  try {
    await context.waitForSelector('div > div > picture > img[alt]');
    await context.evaluate(() => {
      const videos = [
        ...document.querySelectorAll('div > div > picture > img[alt]'),
      ];
      try {
        // Get the Videos to scope
        videos.map((e) => {
          e.click();
        });
        console.log('clicked the video thumbnail');
      } catch (err) {
        console.log('Video Loading issues');
      }
    });
    await context.waitForSelector('#playButton div');
    await context.evaluate(() => {
      const clickButton = [...document.querySelectorAll('#playButton div')];
      // Click the videos
      clickButton.map((e) => {
        setInterval(function () {
          e.click();
        }, 7000);
      });
      setTimeout(function () {
        console.log('Grabbing the data');
        const videosUrl = [];
        [...document.querySelectorAll('video[preload="auto"]')].map((e) => {
          videosUrl.push(e.getAttribute('src'));
          document
            .querySelector('body')
            .setAttribute(
              'videos',
              videosUrl ? videosUrl.join('|') : 'Nothing',
            );
          console.log(`_____${videosUrl.join('|')}_________`);
        });
      }, 7000);
    });
  } catch (e) {
    console.log('doesnot have video tumbnail');
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
