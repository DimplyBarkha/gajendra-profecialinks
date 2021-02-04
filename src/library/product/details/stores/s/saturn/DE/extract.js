// @ts-nocheck
const { transform } = require('./transform');

async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails, helperModule: { Helpers }  } = dependencies;
  const helper = new Helpers(context);
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
  // async function getRating () {
  //   const productId = window.location.pathname.match(/([^-]+).html$/)[1];
  //   const API = `https://www.saturn.de/api/v1/graphql?operationName=GetSelectProduct&variables={"hasMarketplace":false,"id":"${productId}"}&extensions={"pwa":{"salesLine":"Saturn","country":"DE","language":"de"},"persistedQuery":{"version":1,"sha256Hash":"bf21cd23afefaf0e92d339815ffe1da9ed05b7fdbeb5f00dcf5478e5abdfee89"}}`;
  //   const response = await fetch(API);
  //   const json = await response.json();
  //   const rating = json.data && json.data.reviews && json.data.reviews.rating;
  //   if (rating) {
  //     document.body.setAttribute('rating-count', rating.count);
  //   } else {
  //     const ratingCountXpth = document.evaluate('//script[@type="application/ld+json"][contains(text(),"ratingCount")]', document, null, XPathResult.STRING_TYPE, null);
  //     if (ratingCountXpth && ratingCountXpth.stringValue) {
  //       document.body.setAttribute('rating-count', ratingCountXpth.stringValue.match(/(?<=ratingCount)(.*)(?=review")/) ? ratingCountXpth.stringValue.match(/(?<=ratingCount)(.*)(?=review")/)[0] : '');
  //     }
  //   }
  // }
  // await context.evaluate(getRating);

  try {
    await context.waitForSelector('button[class*="ProductFeatures"]', { timeout: 15000 });
  } catch (error) {
    console.log('Not loading product features yet');
  }
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
      var clickArrow = document.querySelector('div[ data-test="mms-th-gallery"] div[direction="next"]');
      if (clickArrow) {
        clickArrow.click();
      }
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

  const gDelay = t => new Promise(resolve => setTimeout(resolve, t));

  await context.evaluate(async () => {
    // const delay = t => new Promise(resolve => setTimeout(resolve, t));
    // async function clickImages (image) {
    //   const videos = Array.from(document.querySelectorAll(image));
    //   try {
    //     // Get the Videos to scope
    //     for (const video of videos) {
    //       console.log('clicking on play button:');
    //       video.click();
    //       await delay(2000);
    //     }
    //   } catch (err) {
    //     console.log('Video Loading issues');
    //   }
    // }
    // // Call the function to get the images
    // await clickImages('div > div > picture > img[alt]');

    var clickArrow = document.querySelector('div[ data-test="mms-th-gallery"] div[direction="next"]');
    if (clickArrow) {
      clickArrow.click();
    }

    var userAction = async () => {
      var sku = document.evaluate('//link[@rel="canonical"]/@href', document, null, XPathResult.ANY_TYPE, null).iterateNext().textContent.replace(/(.+-)(.+)(.html)/g, '$2');
      var skuNumber = 'GraphqlProduct:' + sku;
      var allAsset = window.__PRELOADED_STATE__.apolloState[skuNumber].assets;
      var VideoApi = allAsset.find(e => !e.pixelboxxId);
      var api = VideoApi.link;
      var response = await fetch(api);
      var myJson = await response.json(); // extract JSON from the http response
      if (myJson && myJson.length) {
        var videoUrls = myJson && myJson[0] && myJson && myJson[0].videos.map(e => {
          return e.links[0].location.replace('thumb', 'deliverVideo');
        });
        videoUrls.map(elm => {
          const newlink = document.createElement('a');
          newlink.setAttribute('class', 'videos');
          newlink.setAttribute('href', elm);
          document.body.appendChild(newlink);
        });
      }
    };

    await userAction();
  });

  await gDelay(2000);
  await context.waitForNavigation({ timeout: 15000, waitUntil: 'networkidle0' });

  // await context.searchForRequest('https://mycliplister.com/jplist.*', 'GET');
  // const requests = await context.searchAllRequests('https://mycliplister.com/jplist.*', 'GET');
  // // console.log(request);
  // // const requests = [request];
  // const videoUrls = [];
  // for (const request of requests) {
  //   if (request && request.responseBody && request.responseBody.body) {
  //     const inf = JSON.parse(request.responseBody.body);
  //     const vidUrl = inf.cliplist.clip.clipurl;
  //     videoUrls.push(vidUrl);
  //     console.log("Got video");
  //     console.log(videoUrls.length);
  //     console.log('VIDEO URL :  ', vidUrl);
  //   }
  // }

  // await context.evaluate(function (urls) {
  //   const videosAll = urls.join(' | ');

  //   document.body.setAttribute('video-url', videosAll);
  // }, videoUrls);
  await context.evaluate(async function (context) {
    const seeAllSelector = document.querySelector('[class*="Modalstyled__StyledModalInnerWrapper"]>div>div');
    if (seeAllSelector) {
      seeAllSelector.click();
    }
  });
  async function autoScroll (page) {
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }
  await autoScroll(context);
  try {
    await context.waitForSelector('ul[class="module__k-sc-1unnn6u-5 cTVddx"]', { timeout: 15000 });
  } catch (error) {
    console.log('Not loading the recomended page');
  }
  await context.evaluate(async () => {
    const check = document.querySelector('table[class="table table-striped"] > tbody >tr:nth-child(1) > td:nth-child(4)');
    const check2 = document.querySelector('div[class*="in-the-box"] img');
    if (check && check2 !== null) {
      const x = document.createElement('INPUT');
      x.setAttribute('type', 'Number');
      x.setAttribute('value', '4');
      document.body.appendChild(x);
    } else {
      console.log('element not found');
    }
    //   window.getComputedStyle(element).display
  });
  await helper.removeScriptsWhichContains('vendors~main.js');
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
  dependencies: {
    helperModule: 'module:helpers/helpers',
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  implementation,
};
