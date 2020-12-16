const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    transform: transform,
    domain: 'mediamarkt.de',
    zipcode: '',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    SharedHelpers: 'module:product/details/stores/${store[0:1]}/${store}/helpersShared',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails, Helpers, SharedHelpers }) => {
    const sharedhelpers = new SharedHelpers(context);

    const popUpsButton = await context.evaluate(async function () {
      return !!document.querySelector('button#privacy-layer-accept-all-button');
    });

    const popUps = async function () {
      await context.evaluate(async function () {
        if (document.querySelector('button#privacy-layer-accept-all-button')) {
          document.querySelector('button#privacy-layer-accept-all-button').click();
        }
      });
    };

    try {
      await context.waitForSelector('button#privacy-layer-accept-all-button', { timout: 35000 });
    } catch (error) {
      console.log('No pop-ups!');
    }

    if (popUpsButton) {
      await context.click('button#privacy-layer-accept-all-button');
    }

    popUps();

    try {
      await context.waitForSelector('div[class^="RichProductDescription"] button', { timeout: 45000 });
    } catch (error) {
      console.log('Not loading manufacturer button');
    }

    const manufDescButton = await context.evaluate(async function () {
      return !!document.querySelector('div[class^="RichProductDescription"] button');
    });

    console.log('manufDescButton')
    console.log(manufDescButton)

    const expandDetailsButton = await context.evaluate(async function () {
      return !!document.querySelector('div[class^="ProductFeatures"] a[class*="ExpandLink"]');
    });

    if (expandDetailsButton) {
      await context.click('div[class^="ProductFeatures"] a[class*="ExpandLink"]');

      await context.evaluate(async function () {
        if (document.querySelector('div[class^="ProductFeatures"] a[class*="ExpandLink"]') && !(document.querySelector('div[class^="ProductFeatures"] a[class*="ExpandLink"]').textContent.includes('Details ausblenden'))) {
          document.querySelector('div[class^="ProductFeatures"] a[class*="ExpandLink"]').click();
        }
      });
    }

    const link = await context.evaluate(async function () {
      return window.location.href;
    });

    if (manufDescButton) {
      let content = null;
      let image = null;
      let inBoxText = null;
      let inBoxUrls = null;
      let comparisionText = null;
      await context.click('div[class^="RichProductDescription"] button');
      // await context.evaluate(async function () {
      //   document.querySelector('div[class^="RichProductDescription"] button').click();
      // });

      try {
        await context.waitForSelector('iframe[id^="loadbee"]', { timeout: 55000 });
        const iframeURLLink = await context.evaluate(async function () {
          return document.querySelector('iframe[id^="loadbee"]').getAttribute('src');
        });
        const obj = await sharedhelpers.goToiFrameLink(iframeURLLink, link, 'body img', 'data-src', null, null, '.in-the-box', '.compare-headline');
        image = obj.image;
        content = obj.content;
        inBoxText = obj.inBoxText;
        inBoxUrls = obj.inBoxUrls;
        comparisionText = obj.comparisionText;

        console.log('object!@12');
        console.log(obj);

        inBoxUrls.forEach((element) => {
          sharedhelpers.addHiddenInfo('ii_inBoxUrls', element);
        });
        inBoxText.forEach((element) => {
          sharedhelpers.addHiddenInfo('ii_inBoxText', element);
        });
        sharedhelpers.addHiddenInfo('ii_comparisionText', comparisionText);

        await sharedhelpers.addHiddenInfo('manufContent', content);
        await sharedhelpers.addHiddenInfo('manufImg', image.join(' || '));
      } catch (err) {
        console.log('Looks like the website may not have manufacturer content');
      }
    }

    await sharedhelpers.addHiddenInfo('ii_producturl', link);

    const productID = await sharedhelpers.getEleByXpath('(//span[contains(@class, "DetailsHeader__")]//span)[1]');

    async function graphQLCallObj (productID) {
      const obj = await context.evaluate(async function (productID) {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }

        async function getData (url) {
          let data = {};

          const response = await fetch(url, {
            accept: 'application/json, text/plain, */*',
            referrer: window.location.href,
            referrerPolicy: 'no-referrer-when-downgrade',
            body: null,
            method: 'GET',
            mode: 'cors',
          });

          if (response && response.status === 404) {
            console.log('Product Not Found!!!!');
            return data;
          }

          if (response && response.status === 200) {
            console.log('Product Found!!!!');
            data = await response.json();
            return data;
          }
        };

        console.log(productID);

        const productIDText = productID.replace('| Art.-Nr. ', '').replace(' | ', '').trim();
        const graphQLCall = `GraphqlProduct:${productIDText}`;
        console.log(graphQLCall);
        // eslint-disable-next-line prefer-const
        let videos = [];
        let ean = null;
        if (window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.apolloState && window.__PRELOADED_STATE__.apolloState[graphQLCall]) {
          console.log(window.__PRELOADED_STATE__.apolloState[graphQLCall]);
          if (window.__PRELOADED_STATE__.apolloState[graphQLCall].ean) {
            ean = window.__PRELOADED_STATE__.apolloState[graphQLCall].ean;
          }
          if (window.__PRELOADED_STATE__.apolloState[graphQLCall].assets) {
            const totalAssets = window.__PRELOADED_STATE__.apolloState[graphQLCall].assets;
            totalAssets.forEach(async function (element) {
              if (window.__PRELOADED_STATE__.apolloState[element.id].usageType === 'Video') {
                const url = window.__PRELOADED_STATE__.apolloState[element.id].link;
                const result = await getData(url);
                console.log(result);
                if (result !== null && Object.keys(result).length) {
                  console.log(result);
                  result.forEach((element) => {
                    console.log(element);
                    const videosResults = element.videos !== null ? element.videos : [];
                    console.log(videosResults);
                    videosResults.forEach(async function (video) {
                      console.log(video);
                      const videoText = video.links[0].location;
                      videos.push(videoText.replace('/thumb/', '/vm/'));
                    });
                  });
                }
                addHiddenDiv('ii_videos', videos.join(' || '));
              }
            });
          }
        }
        console.log('{ videos: videos, ean: ean }');
        console.log({ videos: videos, ean: ean });
        return { videos: videos, ean: ean };
      }, productID);
      return obj;
    }
    const graphQLObj = await graphQLCallObj(productID);

    if (graphQLObj !== null) {
      await sharedhelpers.addHiddenInfo('ii_ean', graphQLObj.ean);
      await sharedhelpers.addHiddenInfo('ii_videos1', graphQLObj.videos.join(' || '));
    }
    await context.extract(productDetails, { transform });
  },
};
