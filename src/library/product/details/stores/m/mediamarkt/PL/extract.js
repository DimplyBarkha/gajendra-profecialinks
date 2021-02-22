const { transform } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'mediamarkt',
    transform,
    domain: 'mediamarkt.pl',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    const enhancedContentVidSel = 'iframe[src*="youtube"], iframe[ _src*="youtube"]';
    let videosLoaded = false;
    console.log('waiting for 10 secs!!');
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.time('scrolling');
    await context.evaluate(async () => {
      async function infiniteScroll () {
        let prevScroll = document.documentElement.scrollTop;
        while (true) {
          window.scrollBy(0, document.documentElement.clientHeight);
          await new Promise(resolve => setTimeout(resolve, 1000));
          const currentScroll = document.documentElement.scrollTop;
          if (currentScroll === prevScroll) {
            break;
          }
          prevScroll = currentScroll;
        }
      }
      await infiniteScroll();
    });
    console.timeEnd('scrolling');
    console.log('done scrolling!');

    try {
      await context.waitForSelector(enhancedContentVidSel);
      console.log('videos loaded');
      videosLoaded = true;
    } catch (err) {
      console.log('had some error while waiting for video div', err.message);
    }

    videosLoaded = await context.evaluate(async (enhancedContentVidSel) => {
      const allVidElms = document.querySelectorAll(enhancedContentVidSel);
      if (allVidElms.length > 0) {
        console.log(`we have a total of ${allVidElms.length}`);
        return true;
      }
      return false;
    },
    enhancedContentVidSel);

    console.log('videosLoaded', videosLoaded);
    if (!videosLoaded) {
      console.log('not loaded yet!! trying waiting again');
      try {
        await context.waitForSelector(enhancedContentVidSel);
        console.log('videos loaded');
        videosLoaded = await context.evaluate(async (enhancedContentVidSel) => {
          const allVidElms = document.querySelectorAll(enhancedContentVidSel);
          if (allVidElms.length > 0) {
            console.log(`we have a total of ${allVidElms.length}`);
            return true;
          }
          return false;
        },
        enhancedContentVidSel);
      } catch (err) {
        console.log('had some error while waiting for video div', err.message);
      }
    }

    console.log('videosLoaded', videosLoaded);
    if (!videosLoaded) {
      console.log('cannot help it!! videos are not there');
    }

    if (videosLoaded) {
      await context.evaluate(async (enhancedContentVidSel) => {
        async function addElementToDocumentAsync (key, value) {
          const catElement = document.createElement('div');
          catElement.id = key;
          catElement.textContent = value;
          document.body.appendChild(catElement);
        }
        const videoArr = [];
        const allVideosElm = document.querySelectorAll(enhancedContentVidSel);
        if (allVideosElm && allVideosElm.length > 0) {
          for (let i = 0; i < allVideosElm.length; i++) {
            const thisElm = allVideosElm[i];
            let thisVidUrl = thisElm.getAttribute('src');
            if (!thisVidUrl) {
              thisVidUrl = thisElm.getAttribute('_src');
            }
            console.log('url - ' + thisVidUrl);
            videoArr.push(thisVidUrl);
          }
        } else {
          console.log('we do not have videos in enhanced content');
        }

        await addElementToDocumentAsync('videos', videoArr.join(' || '));
      },
      enhancedContentVidSel);
    }

    const manufacDescSelArr = ['div[id*="description"] div[class*="product"]', 'div[id="af-product-card"]', 'div[class*="b-offerRWD_description "]'];
    const showMoreBtnXPath = '//a[contains(@class,"m-btn")][contains(.,"Rozwiń opis")]';
    try {
      await context.waitForXPath(showMoreBtnXPath);
      console.log('we have the btn');
      await context.evaluate(async (showMoreBtnXPath) => {
        const elm = document.evaluate(showMoreBtnXPath, document, null, 7, null);
        if (elm && elm.snapshotLength > 0) {
          elm.snapshotItem(0).click();
        }
      }, showMoreBtnXPath);
    } catch (err) {
      console.log('had some error while clicking the load more btn', err.message);
    }

    await context.evaluate(async (manufacDescSelArr) => {
      async function addElementToDocumentAsync (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        document.body.appendChild(catElement);
      }

      let manufacDescText = '';
      let elm = [];
      let thisPageSel = '';
      for (let i = 0; i < manufacDescSelArr.length; i++) {
        elm = document.querySelectorAll(manufacDescSelArr[i]);
        if (elm && elm.length > 0 && elm[0] && elm[0].innerText) {
          thisPageSel = manufacDescSelArr[i];
          break;
        }
      }
      let allImages = [];
      if (elm && elm[0]) {
        manufacDescText = elm[0].innerText;
        allImages = elm[0].querySelectorAll('img');
      }
      console.log(manufacDescText);
      console.log('this page has ' + thisPageSel + ' for manufacturerDesc');
      const allImagesUrl = [];
      for (let i = 0; i < allImages.length; i++) {
        console.log(allImages[i].getAttribute('src'));
        allImagesUrl.push('https:' + allImages[i].getAttribute('src'));
      }
      await addElementToDocumentAsync('manufacdesc', manufacDescText);
      await addElementToDocumentAsync('manufacdescimgs', allImagesUrl.join(' || '));
    },
    manufacDescSelArr);

    return await context.extract(productDetails, { transform });
  },
};
