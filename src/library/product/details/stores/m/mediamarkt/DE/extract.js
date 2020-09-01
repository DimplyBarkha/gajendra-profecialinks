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

    /*

    await context.waitForSelector('div[class^="slick-slide"]', { timeout:45000 });
    try {
      await context.waitForSelector('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]', { timeout:45000 });
    } catch (error) {
      console.log('No videos')
    }

    const videosTiles = await context.evaluate(async function () {
      const dataIndex = [];
      if (document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]').length) {
        [...document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]')].forEach((element) => {
          if (element.parentNode && element.parentNode.parentNode && element.parentNode.parentNode.parentNode && element.parentNode.parentNode.parentNode.getAttribute('data-index')) {
            dataIndex.push(element.parentNode.parentNode.parentNode.getAttribute('data-index'));
          }
        });
        return dataIndex;
      }
      console.log(document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]'));
      return document.querySelectorAll('div[class^="slick-slide"] div[data-test="mms-video-thumbnail"]').length;
    });

    const tiles = await context.evaluate(async function () {
      return document.querySelectorAll('div[class^="slick-slide"]').length;
    });

    await new Promise((resolve, reject) => setTimeout(resolve, 10000));

    console.log('vide');
    console.log(videosTiles);
    console.log(tiles);

    async function grabVideoLinks (videosTiles) {
      if (videosTiles) {
        const videos = [];
        for (let i = 0; i < videosTiles.length; i++) {
          await new Promise((resolve, reject) => setTimeout(resolve, 5000));
          await context.evaluate(async function (index) {
            if (document.querySelector('div.cl-video-control-pause') && document.querySelector('div.cl-video-control-pause').style.display === 'block') {
              document.querySelector('div.cl-video-control-pause').click();
            }
            // const playButton = document.querySelector('div[class^="slick-slide"][data-index="' + index + '"] div[data-test="mms-video-thumbnail"]');
            // if (playButton) {
            //   playButton.click();
            // }
          }, videosTiles[i]);
          await new Promise((resolve, reject) => setTimeout(resolve, 5000));
          await context.click('div[class^="slick-slide"][data-index="' + videosTiles[i] + '"] div[data-test="mms-video-thumbnail"]');
          await new Promise((resolve, reject) => setTimeout(resolve, 5000));
          // await context.waitForSelector('div#playButton > div');
          try {
            await context.waitForSelector('div[class^="slick-slide slick-active slick-current"][data-index="' + videosTiles[i] + '"]');
          } catch (error) {
            await context.evaluate(async function (index) {
              if (document.querySelector('div.cl-video-control-pause') && document.querySelector('div.cl-video-control-pause').style.display === 'block') {
                document.querySelector('div.cl-video-control-pause').click();
              }
              await new Promise((resolve, reject) => setTimeout(resolve, 5000));
              const playButton = document.querySelector('div[class^="slick-slide"][data-index="' + index + '"] div[data-test="mms-video-thumbnail"]');
              if (playButton) {
                playButton.click();
              }
            }, videosTiles[i]);
            await context.click('div[class^="slick-slide"][data-index="' + videosTiles[i] + '"] div[data-test="mms-video-thumbnail"]');
            await new Promise((resolve, reject) => setTimeout(resolve, 5000));
            await context.waitForSelector('div#playButton > div');
            await context.waitForSelector('div[class^="slick-slide slick-active slick-current"][data-index="' + videosTiles[i] + '"]');
          }
          await context.click('div#playButton > div');
          await context.evaluate(async function () {
            document.querySelector('div#playButton > div').click();
          });
          await new Promise((resolve, reject) => setTimeout(resolve, 10000));
          const vid = await context.evaluate(async function () {
            function getEleByXpath (xpath) {
              const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
              console.log('Element' + element);
              const text = element ? element.textContent : null;
              return text;
            }
            const vidLink = getEleByXpath('//video/@src');
            console.log(vidLink);
            return vidLink;
          });
          videos.push(vid);
        }
        return videos;
      }
    }

    console.log('vide');
    console.log(videosTiles);

    const vid = await grabVideoLinks(videosTiles);

    const addHiddenVidDiv = await context.evaluate(async function (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }, 'ii_videos', vid.join(' || '));

    // addHiddenVidDiv;

    console.log(addHiddenVidDiv);
    */

    await context.evaluate(async function () {
      // const response = await fetch('/gp/delivery/ajax/address-change.html', {
      //   headers: {
      //     accept: 'text/html,/',
      //     'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      //     'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      //     'x-requested-with': 'XMLHttpRequest',
      //   },
      //   body,
      //   method: 'POST',
      //   mode: 'cors',
      //   credentials: 'include',
      // });
      // if (response.status !== 200) {
      //   throw new Error('Zipcode change failed');
      // } else {
      //   window.location.reload();
      // }
    });

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
          totalAssets.forEach((element) => {
            if (window.__PRELOADED_STATE__.apolloState[element.id].usageType === 'Video') {
              console.log(window.__PRELOADED_STATE__.apolloState[element.id]);

              async function getData (url = '', data = {}) {
                const response = await fetch(url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                });
                return response.json();
              };
              // var requestOptions = {
              //   method: 'GET',
              //   redirect: 'follow',
              // };
              // fetch(window.__PRELOADED_STATE__.apolloState[element.id].link, requestOptions)
              //   .then(response => response.json())
              //   .then(result => {
              //     const videos = [];
              //     console.log(result);
              //     result.forEach((element) => {
              //       console.log(element);
              //       const videosResults = element.videos !== null ? element.videos : [];
              //       console.log(videosResults);
              //       videosResults.forEach((video) => {
              //         console.log(video);
              //         console.log(video.links[0]);
              //         const videoText = video.links[0].location;
              //         // .replace(/(thumb|icon|picture)/gm, 'deliverVideo');
              //         videos.push(videoText);
              //       });
              //     });
              //     return videos;
              //   })
              //   .catch(error => console.log('error', error));
              // console.log('why ignore');
              // console.log(vids);
            }
          });
        }
      }
      // var requestOptions = {
      //   method: 'GET',
      //   redirect: 'follow'
      // };
      // const videos = [];
      // fetch('https://mycliplister.com/cliplister/precheck?api_token=5PJ6S8cKdR_4Fu5Nywiu_089iv_tTlWEm2pqAScLhrH&lang=13047116a560ce1e5c1d48249fe463a90&ean=15f38daff78e2fc7e27764462ae48f7ce', requestOptions)
      //   .then(response => response.text())
      //   .then(result => console.log(result))
      //   .catch(error => console.log('error', error));
    });
    await context.extract(productDetails, { transform });
  },
};
