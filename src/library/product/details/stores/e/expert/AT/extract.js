const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'expert',
    transform: transform,
    domain: 'expert.at',
    zipcode: '',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    SharedHelpers: 'module:product/details/stores/${store[0:1]}/${store}/helpersShared',
  },
  implementation: async (input, { country, domain, transform: transformParam }, context, { productDetails, Helpers, SharedHelpers }) => {
    const sharedhelpers = new SharedHelpers(context);
    console.log('inputString');
    console.log(input);
    if (input && input.id) {
      try {
        await context.waitForSelector('div.product-item.is-clickable', { timeout: 40000 });
      } catch (error) {
        console.log('Waiting for search product to load');
      }
      const firstItemLink = async function () {
        return await context.evaluate(function () {
          const firstItem = document.querySelector('div.product-item.is-clickable h2 > a') ? document.querySelector('div.product-item.is-clickable h2 > a').href : null;
          return firstItem;
        });
      };
      const url = await firstItemLink();
      if (url !== null) {
        await context.goto(`${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_timeout":60,"load_all_resources":true}[/!opt!]`, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
      }
    } else {
      console.log('either input id is null or input object is null');
    }

    let content = null;
    let image = null;

    const link = await context.evaluate(async function () {
      return window.location.href;
    });
    console.log(`link is - ${link}`);
    const apiManufCall = await context.evaluate(async function () {
      return document.querySelector('iframe#loadbeeTabContent') ? document.querySelector('iframe#loadbeeTabContent').getAttribute('src') : null;
    });
    console.log(`apiManufCall is - ${apiManufCall}`);
    if (apiManufCall) {
      const obj = await sharedhelpers.goToiFrameLink(apiManufCall, link, 'body img', 'src');
      content = obj.content;
      image = obj.image;
      sharedhelpers.addHiddenInfo('ii_manufContent', content);
      if (image.length) {
        sharedhelpers.addHiddenInfo('ii_manufImg', image.join(' || '));
      }
    }

    const loadManufactuter = await context.evaluate(async function () {
      return document.querySelector('li#tab-nav-external-content');
    });

    const xpathForSpecification = '//div[contains(@class,"container-product-detail")]//div[contains(@id,"tab-content")]//div[contains(@class,"product_features")]//ul/li';

    await context.evaluate(async function (xpathForSpecification) {
      const newDiv = document.createElement('div');
      newDiv.id = 'specification';
      document.body.appendChild(newDiv);
      let specElms = document.evaluate(xpathForSpecification, document, null, 7, null);
      if(specElms.snapshotLength > 0) {
        for (let index = 0; index < specElms.snapshotLength; index++) {
          if (specElms.snapshotItem(index)) {
            let newSpecli = document.createElement('div');
            newSpecli.id = 'spec-' + index;
            newSpecli.textContent = specElms.snapshotItem(index).textContent.trim().replace(/\s/g, "");
            newDiv.appendChild(newSpecli);
          } else {
            console.log('we do not have the specification for ' + index + ' th element in the details tab');
          }
        }
      } else {
        console.log("we do not have specification - please check with xpathForSpecification");
      }
    }, xpathForSpecification)

    if (loadManufactuter) {
      await context.evaluate(async function () {
        if (document.querySelector('a[href="#tab-external-content"]')) {
          document.querySelector('a[href="#tab-external-content"]').click();
        }
      });
    }

    const urlLink = await context.evaluate(async function () {
      return window.location.href;
    });
    console.log(`urlLink is - ${urlLink}`);
    sharedhelpers.addHiddenInfo('iio_product_url', urlLink);

    let ratingReviews = '';

    const scriptXpath = '//script[contains(@type, "application/ld+json") and contains(text(), "Product")]';
    const isScriptLoaded = await context.evaluate(async function (xpath, reloadSec, maxTime) {
      window.scrollTo(0, document.body.scrollHeight);
      async function timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      // let element = document.querySelector(selector);
      let element = document.evaluate(xpath, document, null, 7, null);
      let elementVal = {};
      if (element.snapshotLength > 0) {
        elementVal = element.snapshotItem(0);
      }
      let count = 0;
      while (elementVal === null) {
        count = count + reloadSec;
        element = document.evaluate(xpath, document, null, 7, null);
        if (element && element.snapshotLength > 0) {
          elementVal = element.snapshotItem(0);
        }
        await timeout(reloadSec);
        if (count >= maxTime) {
          console.log('script with rating info not found');
          return false;
        }
      }
      return true;
    }, scriptXpath, 500, 30000);

    if (isScriptLoaded) {
      ratingReviews = await sharedhelpers.getEleByXpath('//script[contains(@type, "application/ld+json") and contains(text(), "Product")]');
    }

    console.log('ratingReviews');
    console.log(ratingReviews);
    if (ratingReviews) {
      ratingReviews = Object.keys(JSON.parse(ratingReviews)).length ? JSON.parse(ratingReviews) : null;
    } else {
      console.log('script containing rating is not loaded');
    }

    console.log('ratingReviews');
    console.log(ratingReviews);

    if (ratingReviews) {
      sharedhelpers.addHiddenInfo('iio_rating', ratingReviews && ratingReviews.aggregateRating && ratingReviews.aggregateRating.ratingValue ? ratingReviews.aggregateRating.ratingValue.replace('.', ',') : '');
      sharedhelpers.addHiddenInfo('iio_rating_count', ratingReviews && ratingReviews.aggregateRating && ratingReviews.aggregateRating.reviewCount ? ratingReviews.aggregateRating.reviewCount : '');
    }

    await context.evaluate(async function () {
      async function timeout(ms) {
        console.log('waiting for ' + ms + ' millisecs');
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      const externalContentXpath = '//div[contains(@class,"container-product-detail")]//li[@id="tab-nav-external-content"]/a[contains(.,"Hersteller-Info")]';
      let tabToClick = document.evaluate(externalContentXpath, document, null, 7, null);
      if(tabToClick.snapshotLength > 0) {
        console.log('we have the tab to click for videos');
        // if more than more tab shows up - we will be clicking only the first one
        tabToClick.snapshotItem(0).click();
      } else {
        console.log('either the "Hersteller-Info" tab is not loaded yet or it is not present in the page itself');
        console.log('waiting to check again');
        await timeout(2000);
      }
      // await timeout(15000);
    });


    const videoXpath = '//iframe[contains(@title,"Flix-media-video")]//@src | //iframe[contains(@title,"Flix-media-video")]//@_src';
    let videoUrlArray = [];

    const isVideoLoaded = await context.evaluate(async function (xpath, reloadSec, maxTime) {
      window.scrollTo(0, document.body.scrollHeight);
      async function timeout(ms) {
        console.log('waiting for ' + ms + ' millisecs');
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      // let element = document.querySelector(selector);
      let element = document.evaluate(xpath, document, null, 7, null);
      let count = 0;
      while (element.snapshotLength === 0) {
        count = count + reloadSec;
        element = document.evaluate(xpath, document, null, 7, null);
        if (element && element.snapshotLength > 0) {
          break;
        }
        await timeout(reloadSec);
        if (count >= maxTime) {
          console.log('iframe with video not found');
          return false;
        }
      }
      return true;
    }, videoXpath, 500, 30000);

    if(isVideoLoaded) {

      console.log('video is loaded - ' + isVideoLoaded);
    
      videoUrlArray = await context.evaluate(async function (videoXpath) {
        let urlArray = [];
        let videoUrlElms = document.evaluate(videoXpath, document, null, 7, null);
        if(videoUrlElms.snapshotLength > 0) {
          for(let index = 0; index < videoUrlElms.snapshotLength; index++) {
            if(videoUrlElms.snapshotItem(index)) {
              // sharedhelpers.addHiddenInfo(`video-${index + 1}`, videoUrlElms.snapshotItem(index).textContent.trim());
              urlArray.push(videoUrlElms.snapshotItem(index).textContent.trim());
            } else {
              console.log('we do not have the video url for ' + index + ' th element');
            }
          }
        } else {
          console.log("we do not have video");
        }
        return urlArray;
      }, videoXpath);
    
      console.log('we have ' + videoUrlArray.length + ' video links from external tab');
    
      if (videoUrlArray) {
        for(let index = 0; index < videoUrlArray.length; index++ ) {
          await sharedhelpers.addHiddenInfo(`video-${index + 1}`, videoUrlArray[index]);
        }
      }
    
    } else {
      console.log('video is loaded - ' + isVideoLoaded);
      console.log('we do not have any video extracted from the external tab');
    }

    const galleryVideoXpath = '//div[contains(@class, "image-holder slick-slide")]//video/@src';
    let galleryVideoUrls = [];
    galleryVideoUrls = await context.evaluate(async function (videoXpath) {
      let urlArray = [];
      let videoUrlElms = document.evaluate(videoXpath, document, null, 7, null);
      if(videoUrlElms.snapshotLength > 0) {
        for (let index = 0; index < videoUrlElms.snapshotLength; index++) {
          if (videoUrlElms.snapshotItem(index)) {
            // sharedhelpers.addHiddenInfo(`galleryVideo-${index + 1}`, videoUrlElms.snapshotItem(index).textContent.trim());
            urlArray.push('https://www.expert.at' + videoUrlElms.snapshotItem(index).textContent.trim());
          } else {
            console.log('we do not have the video url for ' + index + ' th element in the gallery');
          }
        }
      } else {
        console.log("we do not have video in gallery - if you see in the webpage - check with galleryVideoXpath");
      }
      return urlArray;
    }, galleryVideoXpath);

    if (galleryVideoUrls) {
      for(let index = 0; index < galleryVideoUrls.length; index++ ) {
        await sharedhelpers.addHiddenInfo(`galleryVideo-${index + 1}`, galleryVideoUrls[index]);
      }
    } else {
      console.log('nothing')
    }

    await context.waitForFunction(function (sel) {
      return Boolean(document.querySelector(sel));
    }, { timeout: 20000 }, 'body');

    return await context.extract(productDetails, { transform: transformParam });
  },
};
