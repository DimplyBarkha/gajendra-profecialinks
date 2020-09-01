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
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    const manufDescButton = await context.evaluate(async function () {
      return !!document.querySelector('div[class^="RichProductDescription"] button');
    });

    const link = await context.evaluate(async function () {
      return window.location.href;
    });

    async function addHiddenInfo (elementID, content) {
      await context.evaluate(async function (elementID, content) {
        const newDiv = document.createElement('div');
        newDiv.id = elementID;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }, elementID, content);
    }

    if (manufDescButton) {
      let content = null;
      let image = null;
      await context.click('div[class^="RichProductDescription"] button');
      await context.waitForSelector('iframe#loadbeeTabContent');
      const iframeURLLink = await context.evaluate(async function () {
        return document.querySelector('iframe#loadbeeTabContent').getAttribute('src');
      });
      await context.goto(iframeURLLink);

      const text = await context.evaluate(async function () {
        return document.querySelector('body').innerText;
      });
      content = text;
      const images = await context.evaluate(async function () {
        const images = document.querySelectorAll('body img');
        const imagesSrc = [];
        [...images].forEach((element) => {
          if (element.getAttribute('data-src')) {
            imagesSrc.push(element.getAttribute('data-src'));
          }
        });
        return imagesSrc.join(' || ');
      });
      image = images;
      await context.goto(link);
      addHiddenInfo('manufContent', content);
      addHiddenInfo('manufImg', image);
    }

    await context.evaluate(async function () {
      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        const text = element ? element.textContent : null;
        return text;
      }

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

      let productID = getEleByXpath('(//span[contains(@class, "DetailsHeader__")]//span)[1]');
      productID = productID.replace('| Art.-Nr. ', '').replace(' | ', '').trim();
      const graphQLCall = `GraphqlProduct:${productID}`;
      console.log(window.__PRELOADED_STATE__);
      console.log(window.__PRELOADED_STATE__.apolloState);
      console.log(graphQLCall);
      console.log(window.__PRELOADED_STATE__.apolloState[graphQLCall]);
      if (window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.apolloState && window.__PRELOADED_STATE__.apolloState[graphQLCall]) {
        console.log(window.__PRELOADED_STATE__.apolloState[graphQLCall]);
        if (window.__PRELOADED_STATE__.apolloState[graphQLCall].ean) {
          const ean = window.__PRELOADED_STATE__.apolloState[graphQLCall].ean;
          console.log(ean);
          addHiddenDiv('ii_ean', ean);
        }
        if (window.__PRELOADED_STATE__.apolloState[graphQLCall].assets) {
          const totalAssets = window.__PRELOADED_STATE__.apolloState[graphQLCall].assets;
          totalAssets.forEach(async (element) => {
            if (window.__PRELOADED_STATE__.apolloState[element.id].usageType === 'Video') {
              console.log(window.__PRELOADED_STATE__.apolloState[element.id]);
              const url = window.__PRELOADED_STATE__.apolloState[element.id].link;
              const result = await getData(url);
              console.log('result');
              console.log(result);
              const videos = [];
              if (result !== null && Object.keys(result).length) {
                console.log(result);
                result.forEach((element) => {
                  console.log(element);
                  const videosResults = element.videos !== null ? element.videos : [];
                  console.log(videosResults);
                  videosResults.forEach((video) => {
                    console.log(video);
                    console.log(video.links[0]);
                    const videoText = video.links[0].location;
                    videos.push(videoText);
                  });
                });
              }
              addHiddenDiv('ii_videos', videos.join(' || '));
            }
          });
        }
      }
    });
    await context.extract(productDetails, { transform });
  },
};
