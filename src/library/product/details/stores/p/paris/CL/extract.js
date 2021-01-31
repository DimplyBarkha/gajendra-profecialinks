
const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
// @ts-ignore
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  let manufacturerDescDivSel = 'div[id*="flixinpage"] img, div[class*="description-table"] img';
  let manufacDivLoaded = false;
  let thisTime = 0;
  let maxTime = 100000;
  while((!manufacDivLoaded) && thisTime < maxTime) {
    manufacDivLoaded = await context.evaluate(async (manufacturerDescDivSel) => {
      console.log('manufacturerDescDivSel', manufacturerDescDivSel);
      let elm = document.querySelectorAll(manufacturerDescDivSel);
      if(elm && elm.length > 0) {
        return true;
      }
      return false;
    }, manufacturerDescDivSel);
    await new Promise(resolve => setTimeout(resolve, 10000));
    thisTime += 10000;
  }

  console.log('waited for', thisTime);
  console.log('manufacDivLoaded', manufacDivLoaded);
  let moreDescBtnXpath = '//a[contains(.,"Ver toda la descripción")]';
  try {
    await context.waitForXPath(moreDescBtnXpath);
  } catch(err) {
    console.log('error while waiting', err.message);
  }
  try {
    await context.evaluate(async (moreDescBtnXpath) => {
      console.log('need to click', moreDescBtnXpath);
      let btn = document.evaluate(moreDescBtnXpath, document, null, 7, null);
      if(btn && btn.snapshotLength > 0) {
        let btnElm = btn.snapshotItem(0);
        if(btnElm) {
          btnElm.click();
        }
      }
    }, moreDescBtnXpath);
  } catch (e) {
    console.log('Error in click read more description');
  }
  await new Promise(resolve => setTimeout(resolve, 3000));

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

  try {
    await context.waitForXPath('//div[contains(@class,"description-table")]//img');
    console.log('got some images');
  } catch(err) {
    console.log('got some error while waiting for manufacImages', err.message);
    try {
      await context.waitForXPath('//div[contains(@class,"description-table")]//img');
      console.log('got some images');
    } catch(error) {
      console.log('got some error while waiting for manufacImages', error.message);
    }
  }

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const scriptTagSelector = document.querySelector('script[type="application/ld+json"]');
    // @ts-ignore
    const scriptTagData = scriptTagSelector ? scriptTagSelector.innerText : '';
    let scriptTagJSON = '';
    try {
      scriptTagJSON = scriptTagData ? JSON.parse(scriptTagData) : '';
    } catch (e) {
      console.log('Error in converting text to JSON....');
      scriptTagJSON = '';
    }
    // @ts-ignore
    const gtin = scriptTagJSON ? scriptTagJSON.gtin13 : '';
    console.log('gtin', gtin);
    addHiddenDiv('added_gtinText', gtin);
    // @ts-ignore
    let availabilityText = scriptTagJSON ? scriptTagJSON.offers ? scriptTagJSON.offers[0].availability ? scriptTagJSON.offers[0].availability : '' : '' : '';
    availabilityText = availabilityText && availabilityText.toLowerCase().includes('instock') ? 'In Stock' : 'Out Of Stock';
    addHiddenDiv('added_availabilityText', availabilityText);
  });

  await new Promise(resolve => setTimeout(resolve, 3000));
  console.log('done scrolling');
  let videoSel = 'div[class*="fullJwPlayerWarp fullPlaylist"] iframe, iframe[src*="youtube"], iframe[ _src*="youtube"]';
  let videosPresent = false;
  try {
    await context.waitForSelector(videoSel);
    console.log('got the videos');
    videosPresent = true;
  } catch(err) {
    console.log('got some error while waiting for videos', err.message);
    try {
      await context.waitForSelector(videoSel);
      console.log('got the videos - finally');
      videosPresent = true;
    } catch(error) {
      console.log('got some error while waiting for videos - again', error.message);
    }
  }
  let allVideosUrlArr = [];
  if(videosPresent) {
    allVideosUrlArr = await context.evaluate(async (videoSel) => {
      console.log('videoSel', videoSel);
      let videoElms = document.querySelectorAll(videoSel);
      let allVideos = [];
      if(videoElms) {
        for(let i = 0; i < videoElms.length; i++) {
          let thisUrl = videoElms[i].getAttribute('src');
          if(!thisUrl) {
            thisUrl = videoElms[i].getAttribute('_src');
          }
          console.log('thisUrl', thisUrl);
          allVideos.push(thisUrl);
        }
      }
      return allVideos;
    }, videoSel)
  }

  await context.evaluate(async (allVideosUrlArr) => {
    console.log('we have ' + allVideosUrlArr.join(' | '));
    async function addElementToDocumentAsync (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      document.body.appendChild(catElement);
    }

    await addElementToDocumentAsync('videos', allVideosUrlArr.join(' | '))
  }, allVideosUrlArr);

  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CL',
    store: 'paris',
    transform,
    domain: 'paris.cl',
    zipcode: '',
  },
  implementation,
};
