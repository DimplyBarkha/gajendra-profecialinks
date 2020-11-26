const { transform } = require('../../../../shared');

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
  },
  // @ts-ignore
  implementation: async ({ inputString }, { transform }, context, { productDetails }) => {
    const popUpsButton = await context.evaluate(async function () {
      return !!document.querySelector('button#privacy-layer-accept-all-button');
    });

    const popUps = async function () {
      await context.evaluate(async function () {
        if (document.querySelector('button#privacy-layer-accept-all-button')) {
          // @ts-ignore
          document.querySelector('button#privacy-layer-accept-all-button').click();
        }
      });
    };

    try {
      await context.waitForSelector('button#privacy-layer-accept-all-button', { timout: 5000 });
    } catch (error) {
      console.log('No pop-ups!');
    }

    if (popUpsButton) {
      await context.click('button#privacy-layer-accept-all-button');
    }

    popUps();

    const manufDescButton = await context.evaluate(async function () {
      return !!document.querySelector('div[class^="RichProductDescription"] button');
    });

    const expandDetailsButton = await context.evaluate(async function () {
      return !!document.querySelector('div[class^="ProductFeatures"] button[class*="ExpandLink"]');
    });

    if (expandDetailsButton) {
      await context.click('div[class^="ProductFeatures"] button[class*="ExpandLink"]');
      await context.evaluate(async function () {
        if (document.querySelector('div[class^="ProductFeatures"] button[class*="ExpandLink"]') && !(document.querySelector('div[class^="ProductFeatures"] button[class*="ExpandLink"]').textContent.includes('Details ausblenden'))) {
          // @ts-ignore
          document.querySelector('div[class^="ProductFeatures"] button[class*="ExpandLink"]').click();
        }
      });
    }

    let manufacturerObj;
    if (manufDescButton) {
      try {
        await context.click('div[class^="RichProductDescription"] button');
        await context.waitForSelector('div.inpage_features,div.flix-features-columns', { timeout: 10000 });
        manufacturerObj = await context.evaluate(async function () {
          const result = {};
          // @ts-ignore
          const desc = [...document.querySelectorAll('div.inpage_features > ul > li')].map(el => el.innerText).filter(el => !!el);
          // @ts-ignore
          const additionalDesc = [...document.querySelectorAll('div.flix-features-columns div.flix-std-content')].map(el => el.innerText).filter(el => !!el);
          // @ts-ignore
          const images = [...document.querySelectorAll('div.flix-features-columns img')].map(el => {
            const imagePath = el.getAttribute('data-srcset');
            if (imagePath) return imagePath.includes('https:') ? el.getAttribute('data-srcset') : 'https:' + el.getAttribute('data-srcset');
          }).filter(el => !!el);
          result.images = images;
          result.description = [...desc, additionalDesc].map(el => el.replace(/^\s+$/, '')).filter(el => !!el);
          return result;
        });
      } catch (err) {
        console.log('Looks like the website may not have manufacturer content');
      }
    }

    async function getElementByXpath (xpath) {
      return await context.evaluate((xpath) => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        const text = element ? element.textContent : null;
        return text;
      }, xpath);
    }

    const productID = await getElementByXpath('(//span[contains(@class, "DetailsHeader__")]//span)[1]');

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
            // @ts-ignore
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
        // @ts-ignore
        if (window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.apolloState && window.__PRELOADED_STATE__.apolloState[graphQLCall]) {
          // @ts-ignore
          console.log(window.__PRELOADED_STATE__.apolloState[graphQLCall]);
          // @ts-ignore
          if (window.__PRELOADED_STATE__.apolloState[graphQLCall].ean) {
            // @ts-ignore
            ean = window.__PRELOADED_STATE__.apolloState[graphQLCall].ean;
          }
          // @ts-ignore
          if (window.__PRELOADED_STATE__.apolloState[graphQLCall].assets) {
            // @ts-ignore
            const totalAssets = window.__PRELOADED_STATE__.apolloState[graphQLCall].assets;
            totalAssets.forEach(async function (element) {
              // @ts-ignore
              if (window.__PRELOADED_STATE__.apolloState[element.id].usageType === 'Video') {
                // @ts-ignore
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
    // @ts-ignore
    const graphQLObj = await graphQLCallObj(productID);

    await context.evaluate(async ({ graphQLObj, manufacturerObj }) => {
      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      function appendData (data) {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const name = 'product-' + key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
          addElementToDocument(name, data[key]);
        }
      }

      async function extractVideos () {
        let result = [];
        try {
          const videoElements = document.querySelectorAll('img[alt="Play Video"]');
          for (let i = 0; i < videoElements.length; i++) {
            console.log('iter ' + i);
            // @ts-ignore
            await document.querySelectorAll('img[alt="Play Video"]')[i].click();
            await new Promise(resolve => setTimeout(resolve, 5000));
            // @ts-ignore
            await document.querySelectorAll('#playButton > div')[i].click();
            await new Promise(resolve => setTimeout(resolve, 250));
          }
          // @ts-ignore
          result = [...document.querySelectorAll('div[data-test="mms-video-player"] video')].map(el => el.getAttribute('src')).filter(el => !!el);
          console.log(result);
          await new Promise(resolve => setTimeout(resolve, 200));
          // @ts-ignore
          result = [...document.querySelectorAll('div[data-test="mms-video-player"] video')].map(el => el.getAttribute('src')).filter(el => !!el);
          console.log(result);
        } catch (e) {
          console.log(e);
          console.log('Error extracting videos.');
        }
        return result;
      }

      const data = {};
      // @ts-ignore
      const photos = [...document.querySelectorAll('div > picture > source + img')];
      data.photo = photos[0].getAttribute('src');
      data.imgAlt = photos[0].getAttribute('alt');
      data.alternateImages = photos.slice(1).map(el => el.getAttribute('src'));
      data.secImagesCount = data.alternateImages.length;
      data.videos = await extractVideos();
      data.url = window.location.href;
      if (graphQLObj) {
        if (graphQLObj.ean) data.ean = graphQLObj.ean;
        if (graphQLObj.videos) data.videos = [...data.videos, graphQLObj.videos];
      }
      if (manufacturerObj) {
        if (manufacturerObj.images.length) data.manufacturerImages = manufacturerObj.images;
        if (manufacturerObj.description.length) data.manufacturerDesc = manufacturerObj.description;
      }
      appendData(data);
    }, { graphQLObj, manufacturerObj });
    await context.extract(productDetails, { transform });
  },
};
