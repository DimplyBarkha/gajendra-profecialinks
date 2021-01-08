/**
 *
 * @param { { url?: string,  id?: string, zipcode?: any, storeId?:any} } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action, createUrl: ImportIO.Action} } dependencies
 */
const implementation = async (inputs, { loadedSelector, noResultsXPath }, context, dependencies) => {
  const { url, id } = inputs;
  let builtUrl;
  if (!url) {
    if (!id) throw new Error('No id provided');
    else builtUrl = await dependencies.createUrl(inputs);
  }
  await dependencies.goto({ ...inputs, url: builtUrl || url });

  await new Promise((resolve, reject) => setTimeout(resolve, 5000));
  
  const videoSources = await context.evaluate(async function (selectorClick) {
    const videoSrcArr = [];
    const videoSelectors = document.querySelectorAll('div[data-comp="HeroMediaList "] div[data-comp="Carousel "] div[role="tabpanel"] button');
    const videoSrcXpath = '//video[@data-player="default"]/@src';
    //const srcSel = document.querySelector('iframe#video-article-details');
    
    let i = 0;
    while (i < videoSelectors.length) {
      //videoSelectors[i].addEventListener('click');
      videoSelectors[i].click();
      
      await new Promise(resolve => setTimeout(resolve, 5000));
      var videoSrcCheck = document.evaluate(videoSrcXpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (videoSrcCheck.snapshotLength > 0) {
        const checkSrc = videoSrcCheck.snapshotItem(0);
        //videoSrcArr.push(`https:${checkSrc.textContent}`);
        videoSrcArr.push(checkSrc.textContent);
      }
      console.log('going to close');
      //debugger;
      const closeSel = document.querySelector('button[data-at="modal_close"]');
      closeSel.click();
      await new Promise(resolve => setTimeout(resolve, 4000));
      i++;
    }
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    if (videoSrcArr) {
      console.log('videoSrcArr:: ',videoSrcArr);
      debugger;
      videoSrcArr.forEach(src => {
        addHiddenDiv('ii_video', src);
        console.log('ii_video DIV added: ');
      });
      debugger;
    }
    return videoSrcArr;
  })
  
  const nameExtended = await context.evaluate(function (parentInput, videoSources) {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    if (videoSources) {
      console.log('videoSources:: ',videoSources);
      debugger;
      videoSources.forEach(src => {
        //addHiddenDiv('ii_video', src);
      });
      debugger;
    }
  })

  if (loadedSelector) {
    await context.waitForFunction(
      (selector, xpath) => {
        return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
      },
      { timeout: 10000 },
      loadedSelector,
      noResultsXPath,
    );
  }
  return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
};
////div[@data-comp="HeroMediaList "]/div[1]//div[@data-hammer-carousel-inner="true"]//button
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'sephora',
    domain: 'sephora.com',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
