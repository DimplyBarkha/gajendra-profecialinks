const { transform } = require('../../bestbuy/format');
/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        await stall(500);
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };
  await applyScroll(context);
  await context.evaluate(async function (context) {
    const selector1 = document.querySelector('div[class*="products"] div[class="product-block"]:nth-child(3)>span> span[class="overlayTrigger"]>button');
    const selector2 = document.querySelector('div[class*="products"] div[class="product-block"]:nth-child(5)>span> span[class="overlayTrigger"]>button');
    const selector3 = document.querySelector('div[class*="products"] div[class="product-block"]:nth-child(7)>span> span[class="overlayTrigger"]>button');
    const selector4 = document.querySelector('div[class*="products"] div[class="product-block"]:nth-child(9)>span> span[class="overlayTrigger"]>button');
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    let skuId;
    const currentUrl = window.location.href;
    if (currentUrl) {
      skuId = currentUrl.match(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/) && currentUrl.match(/[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/)[0];
    }
    if (skuId == null) {
      if (document.querySelector('button.add-to-cart-button')) {
        skuId = document.querySelector('button.add-to-cart-button').getAttribute('data-sku-id');
      }
    }
    addElementToDocument('pd_skuId', skuId);

    if (selector1) {
      selector1.click();
      const expandData = document.querySelector('div[class*="products"]>div[class="product-block"] span[class*="c-overlay"] h3>a').textContent;
      if (expandData) {
        addElementToDocument('elementData1', expandData);
      }
    }
    if (selector2) {
      selector2.click();
      const expandData = document.querySelector('div[class*="products"]>div[class="product-block"] span[class*="c-overlay"] h3>a').textContent;
      if (expandData) {
        addElementToDocument('elementData1', expandData);
      }
    }
    if (selector3) {
      selector3.click();
      const expandData = document.querySelector('div[class*="products"]>div[class="product-block"] span[class*="c-overlay"] h3>a').textContent;
      if (expandData) {
        addElementToDocument('elementData1', expandData);
      }
    }
    if (selector4) {
      selector4.click();
      const expandData = document.querySelector('div[class*="products"]>div[class="product-block"] span[class*="c-overlay"] h3>a').textContent;
      if (expandData) {
        addElementToDocument('elementData1', expandData);
      }
    }
  });
  await context.evaluate(async function (context) {
    const seeAllSelector1 = document.querySelector('.v-m-bottom-g .shop-product-carousels div.pager-carousel-content > button[class*="right"]');
    const seeAllSelector2 = document.querySelector('.v-m-bottom-m .shop-product-carousels div[class*="product-carousel"]:nth-child(1) div.pager-carousel-content > button[class*="right"]');
    const seeAllSelector3 = document.querySelector('.v-m-bottom-m .shop-product-carousels div[class*="product-carousel"]:nth-child(2) div.pager-carousel-content > button[class*="right"]');
    const seeAllSelector4 = document.querySelector('.v-m-bottom-m .shop-product-carousels div[class*="product-carousel"]:nth-child(3) div.pager-carousel-content > button[class*="right"]');
    for (let i = 0; i < 5; i++) {
      seeAllSelector1 && seeAllSelector1.click();
    }
    for (let i = 0; i < 3; i++) {
      seeAllSelector2 && seeAllSelector2.click();
    }
    for (let i = 0; i < 3; i++) {
      seeAllSelector3 && seeAllSelector3.click();
    }
    for (let i = 0; i < 3; i++) {
      seeAllSelector4 && seeAllSelector4.click();
    }
  });
  const mainUrl = await context.evaluate(async function () {
    return window.location.href;
  });

  try {
    // await context.captureRequests();
    // try{
    //   await new Promise(resolve => setTimeout(resolve, 2000));
    // await context.waitForSelector('button[data-track*="From the Manufacturer"]')
    // await context.click('button[data-track*="From the Manufacturer"]')
    // await context.waitForSelector('iframe.manufacturer-content-iframe')
    // const ifr = document.querySelector('iframe.manufacturer-content-iframe')
    // if(ifr){
    //   const aplusImg = ifr.contentDocument.body.querySelectorAll('img.wc-media');

    // }

    // } catch (error){
    //   console.log('Manufacturer contents are not loaded')
    // }
    // try {
    //   await context.click('li.video-thumbnail')
    //   await context.waitForSelector('div.video-thumbnail-wrapper')
    // } catch (error) {
    //   console.log('there are no videos');
    // }
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      // try {
      //   await new Promise(resolve => setTimeout(resolve, 8000));
      //   await context.waitForSelector('button[data-track*="From the Manufacturer"]')
      //   await context.click('button[data-track*="From the Manufacturer"]')
      //   const manuf = document.querySelector('button[data-track*="From the Manufacturer');
      //   if (manuf) {
      //     manuf.click();
      //     await new Promise(resolve => setTimeout(resolve, 5000));
      //     // await context.waitForSelector('iframe.manufacturer-content-iframe');
      //     const ifr = document.querySelector('iframe.manufacturer-content-iframe');
      //     if (ifr) {
      //       const aplusImgs = ifr.contentDocument.body.querySelectorAll('img.wc-media');
      //       console.log('aplusImgs', aplusImgs);
      //       if (aplusImgs && aplusImgs.length > 0) {
      //         aplusImgs.forEach((el, idx) => {
      //           const img = el.getAttribute('src');
      //           if (img) {
      //             addHiddenDiv(`aplusImg_${idx}`, img);
      //           }
      //         });
      //       }
      //     }
      //   }
      // } catch (error) {
      //   console.log('Manufacturer contents are not loaded');
      // }
      const vidSel = document.querySelector('li.video-thumbnail button');
      if (vidSel) {
        vidSel.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      const videos = [];
      const videoElem = document.querySelectorAll('div.video-thumbnail-wrapper li button');
      // console.log("videoElems:::::::::", videoElem);
      if (videoElem && videoElem.length > 0) {
        for (let i = 0; i < videoElem.length; i++) {
          videoElem[i].click();
          await new Promise(resolve => setTimeout(resolve, 1000));

          const videoUrl = document.querySelector('video source').getAttribute('src');
          // console.log("videoUrl:: ", videoUrl);
          videos.push(videoUrl);
          addHiddenDiv(`ii_video_${i}`, videoUrl);
        }
      }
      // image
      const imgSel = document.querySelector('button#product-images-tab');
      // console.log("imgSel:::: ", imgSel);
      if (imgSel) {
        imgSel.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      const imgEle = document.querySelectorAll('li.thumbnail-content button');
      // console.log("imgEle:: ", imgEle);
      if (!imgEle) {
        document.querySelector('li.image-more-thumbnail button').click();
      }

      if (imgEle && imgEle.length > 0) {
        for (let i = 1; i < imgEle.length; i++) {
          const imgUrl = imgEle[i].querySelector('img').getAttribute('src');
          console.log('imgUrl:: ', imgUrl);
          addHiddenDiv('secImages', imgUrl.replace(';maxHeight=150;maxWidth=150', ''));
        }
      }
      // return videos;
    });

    const videos = [];
    // const request = await context.searchAllRequests('videos') || [];
    // console.log('video request:: ', request);
    //  videos = new Set(request.map(({url})=>url));
    //  await new Promise(resolve => setTimeout(resolve, 2000));

    await context.evaluate(async function (videos) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      // for (const [index, video] of videos.entries()) {
      //   addHiddenDiv(`ii_video_${index}`, video)
      // }
      // try {
      //   document.querySelector('li.image-more-thumbnail button').click()
      // } catch (error) {
      //   console.log('No extra Image',error);
      // }
      const descContent = (document.querySelector('div.overview-accordion-content-wrapper')) ? document.querySelector('div.overview-accordion-content-wrapper').innerHTML.replace(/<li.*?>/gm, ' || ').replace(/\n/gm, ' ').replace(/<script>.*?<\/script>/gm, '').replace(/<.*?>/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').trim() : '';
      descContent && addHiddenDiv('ii_description', descContent);
      const iframe = document.querySelector('iframe.manufacturer-content-iframe');
      if (iframe) {
        iframe.scrollIntoView({ behavior: 'smooth' });
        await new Promise(resolve => setTimeout(resolve, 500));
        try {
          const container = document.querySelector('div.shop-manufacturer-content');
          const manufaturerContents = iframe.contentDocument.documentElement.innerHTML.replace(/<div\s*class="wc-json-data".*?<\/div>/g, ' ');
          if (/360-view/i.test(manufaturerContents)) {
            addHiddenDiv('roundimg', 'Yes');
          }
          container.innerHTML = manufaturerContents;
        } catch (error) {
          console.log(error);
        }
      }
    }, Array.from(videos));

    await context.evaluate(async function () {
      document.querySelector('button.has-text.image-button') ? document.querySelector('button.has-text.image-button').click() : document.querySelector('button.see-more-images-button') ? document.querySelector('button.see-more-images-button').click() : '';
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const secondaryImages = document.querySelectorAll('li.thumbnail-content img');
      const secondaryImagesArr = [];
      if (secondaryImages) {
        for (let i = 1; i < secondaryImages.length; i++) {
          secondaryImagesArr.push(secondaryImages[i].src);
          addHiddenDiv('secImages', secondaryImages[i].src.replace(';maxHeight=150;maxWidth=150', ''));
        }
      }
      document.querySelector('button#product-videos-tab') && document.querySelector('button#product-videos-tab').click();
      const videos = [];
      const videoElem = document.querySelectorAll('div.video-thumbnail-wrapper li button');
      // console.log("videoElems:::::::::", videoElem);
      if (videoElem && videoElem.length > 0) {
        for (let i = 0; i < videoElem.length; i++) {
          videoElem[i].click();
          await new Promise(resolve => setTimeout(resolve, 500));

          const videoUrl = document.querySelector('video source').getAttribute('src');
          // console.log("videoUrl:: ", videoUrl);
          videos.push(videoUrl);
          addHiddenDiv(`ii_video_${i}`, videoUrl);
        }
      }
    });
    await context.extract(productDetails, { transform, type: 'MERGE_ROWS'  });
  } catch (error) {
    console.log(error);
  }

  const iFrameSrc = await context.evaluate(async function () {
    const manuf = document.querySelector('button[data-track*="From the Manufacturer');
    if (manuf) {
      manuf.click();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    const iFrameSrc = document.querySelector('iframe.manufacturer-content-iframe') && document.querySelector('iframe.manufacturer-content-iframe').getAttribute('src');
    console.log('IFRAME', document.querySelector('iframe.manufacturer-content-iframe'));
    return iFrameSrc;
  });
  let manufacturerData = '';
  const timeout = parameters.timeout ? parameters.timeout : 60000;
  if (iFrameSrc) {
    console.log('IFRAME SRC found', iFrameSrc);
    try {
      await context.goto(`${iFrameSrc}#[!opt!]{"force200": true, "block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true}[/!opt!]`);
      await context.waitUntil('load');
      console.log('on iFrame page');
    } catch (error) {
      console.log('Enhanced content navigation error', error);
    }
    try {
      try {
        await context.waitForSelector('div#syndi_powerpage div[class*="syndigo-shadowed-powerpage"]');
      } catch (error) {
        console.log('Error: syndi_powerpage selector not found');
      }
      manufacturerData = await context.evaluate(async function () {
        const manuData = document.querySelector('div#syndi_powerpage div[class*="syndigo-shadowed-powerpage"]');
        const getShadowDomHtml = async (manuData) => {
          let shadowText = '';
          const shadowImage = [];
          if (manuData && manuData.shadowRoot) {
            let imagesHtml = manuData.shadowRoot.childNodes[0];
            for (const el of manuData.shadowRoot.childNodes) {
              shadowText += el.innerText;
            }
            imagesHtml = imagesHtml.querySelectorAll('img') || '';
            if (imagesHtml && imagesHtml.length) {
              imagesHtml.forEach(element => {
                shadowImage.push(element.src);
              });
            }
          } else {
            manuData = document.querySelector('div.ccs-cc-inline.ccs-cc-block-inline');
            if (manuData) {
              shadowText = manuData.innerText;
              const imagesHtml = manuData.querySelectorAll('img') || '';
              if (imagesHtml && imagesHtml.length) {
                imagesHtml.forEach(element => {
                  shadowImage.push(element.src);
                });
              }
            } else {
              manuData = document.querySelector('#wc-outter-wrapper');
              if (manuData) {
                // shadowText = manuData.innerText;
                const imagesHtml = manuData.querySelectorAll('img') || '';
                if (imagesHtml && imagesHtml.length) {
                  imagesHtml.forEach(element => {
                    shadowImage.push(element.src);
                  });
                }
                // if (shadowText === '') {
                const tabButtons = document.querySelectorAll('div[id="navbar"] ul li[class*="wc-selected"] ~ li a');
                if (tabButtons) {
                  for (let index = 0; index < tabButtons.length; index++) {
                    const tabButtonsHref = tabButtons[index].href;
                    const responseData = await fetch(tabButtonsHref).then(x =>
                      x.text(),
                    );
                    const domParser = new DOMParser();
                    const parsedData = domParser.parseFromString(responseData, 'text/html');
                    const fetchedData = parsedData.querySelector('div[class*=wc-pc-tabbed-content] div[class*="wc-pc-content"]');
                    if (shadowText) {
                      shadowText += fetchedData.innerText;
                    }
                    const imgArr = parsedData.querySelectorAll('div[class*=wc-pc-tabbed-content] div[class*="wc-pc-content"] img');
                    for (let i = 0; i < imgArr.length; i++) {
                      shadowImage.push(imgArr[i].src);
                    }
                  }
                  // }
                  // const tabButtons = document.querySelectorAll('div.wc-ms-navbar ul li a');
                  // for (let index = 0; index < tabButtons.length; index++) {
                  //   const element = tabButtons[index];
                  //   console.log(element);
                  //   const data = document.querySelector('#wc-pc-content');
                  //   if (data) { shadowText = data.innerText; }
                  //   element.click();
                  //   await new Promise((resolve, reject) => setTimeout(resolve, 500));
                  // }
                }
              } else {
                manuData = document.querySelectorAll('#inpage_container');
                if (manuData && manuData.length) {
                  const shadowTextArr = [];
                  manuData.forEach(element => {
                    shadowTextArr.push(element.innerHTML.replace(/<.*?>/gm, '').replace(/&nbsp;/g, '').replace(/Close Video/g, '').replace(/function.*?;,/g, '').replace(/FlixjQ.*?;,/g, '').trim());
                    shadowImage.push(element.querySelector('img').src);
                  });
                  shadowText = shadowTextArr.join();
                }
              }
            }
          }
          return { shadowText: shadowText.trim(), shadowImage };
        };
        return getShadowDomHtml(manuData);
      });
    } catch (error) {
      console.log('Enhanced content not loaded', error);
    }
    await context.goto(`${mainUrl}&intl=nosplash#[!opt!]{"force200": true, "block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true}[/!opt!]`, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
  }

  let shadowTextApiData;

  async function getEnhancedHtmlJS () {
    try {
      if (mainUrl.match(/(\d+).p\?/)) {
        const id = mainUrl.match(/(\d+).p\?/)[1];
        await context.goto('https://scontent.webcollage.net/', { checkBlocked: false });
        return await context.evaluate(async (id) => {
          const api = `https://scontent.webcollage.net/bestbuy/power-page?ird=true&channel-product-id=${id}`;
          const response = await fetch(api);
          const text = await response.text();
          return text;
        // return text.match(/html\s*:\s*"([^\n]+)/)[1].replace(/"$/, '').replace(/\\/g, '');
        }, id);
      }
      return false;
    } catch (error) {
      console.log('getEnhancedHtmlJS api not available');
    }
  }
  let enhacnedContentJS;
  try {
    enhacnedContentJS = await getEnhancedHtmlJS();
  } catch (error) {
    console.log('error getting enhanced content');
  }
  // Get Enhanced HTML.
  try {
    if (enhacnedContentJS) {
      await context.evaluate((enhacnedContentJS) => {
        eval(enhacnedContentJS);
        const html = window._wccontent.aplus.html;
        const newDiv = document.createElement('div');
        newDiv.id = 'webcollage-content';
        newDiv.innerHTML = html;
        document.body.appendChild(newDiv);
        function getIframeHTML (parentIFrame) {
          if (parentIFrame.tagName === 'IFRAME') {
            parentIFrame = parentIFrame.contentDocument;
          }
          const iframes = Array.from(parentIFrame.querySelectorAll('iframe'));
          console.log(iframes);
          for (const iframe of iframes) {
            const html = getIframeHTML(iframe);
            iframe.parentElement.innerHTML = html;
          }
          if (parentIFrame.querySelector('html')) {
            return parentIFrame.querySelector('html').outerHTML;
          }
        }
        getIframeHTML(document.querySelector('#webcollage-content'));
        Array.from(document.querySelectorAll('#webcollage-content .wc-json-data')).forEach(elm => elm.remove());
        shadowTextApiData = document.querySelector('#webcollage-content') && document.querySelector('#webcollage-content').innerText;

        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        if (shadowTextApiData) {
          addHiddenDiv('pd_manu_desc', shadowTextApiData);
        }
      }, enhacnedContentJS);
      await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
    }
  } catch (error) {
    console.log('Could not execute enhanced content js. Error: ', error);
  }
  await context.goto(`${mainUrl}&intl=nosplash#[!opt!]{"force200": true, "block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true}[/!opt!]`, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });

  if (manufacturerData != null) {
    await context.evaluate(async function (manufacturerData) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      console.log('---------->', manufacturerData);
      manufacturerData.shadowText && addHiddenDiv('pd_manu_desc', manufacturerData.shadowText);
      manufacturerData.shadowImage && manufacturerData.shadowImage.length && manufacturerData.shadowImage.forEach(element => {
        addHiddenDiv('aplus_img', element);
      });
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const enhancedContent = document.querySelector('div[class*="syndi_powerpage"]');
      if (enhancedContent) {
        const witbData = Array.from([...enhancedContent.shadowRoot.querySelectorAll('[class="syndigo-widget-section-header"]')].find(elm => elm.innerText.match(/in the box/i)).nextElementSibling.querySelectorAll('[class="syndigo-featureset-feature"]'));
        witbData.forEach(element => {
          element.querySelector('h3') && addElementToDocument('witbText', element.querySelector('h3').innerText);
          element.querySelector('img') && addElementToDocument('witbImg', element.querySelector('img').src);
        });
      }

      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const documentFrame = document.querySelector('div[class="analytics-adsense-ads"]> iframe[title="Ads by Google"]');
      if (documentFrame) {
        const witbData = [...documentFrame.shadowRoot.querySelectorAll('[style*="ms-flex-direction"] div[style*="ms-flex-direction"]')];
        witbData.forEach(element => {
          element.querySelector('a[class*="lc_ si6"]') && addElementToDocument('witbDocument', element.querySelector('a[class*="lc_ si6"]'));
        });
      }
    }, manufacturerData);
  } else {
    await context.evaluate(async function (shadowTextApiData) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      if (shadowTextApiData) {
        addHiddenDiv('pd_manu_desc', shadowTextApiData);
      }
    });
  }

  async function addWitbandCRT () {
    async function getWitbAndComparison () {
      if (window.location.pathname.match(/(\d+).p$/)) {
        const id = window.location.pathname.match(/(\d+).p$/)[1];
        const api = `https://cors-anywhere.herokuapp.com/https://content.syndigo.com/page/cbd6abd4-eeda-49d1-9173-06edce7e52ca/${id}.json`;
        const response = await fetch(api);
        const json = await response.json();
        if (Object.keys(json).length) {
          return json;
        }
      }
      return false;
    }
    async function getCompareTable () {
      if (window.location.pathname.match(/(\d+).p$/)) {
        const id = window.location.pathname.match(/(\d+).p$/)[1];
        const api = `https://cors-anywhere.herokuapp.com/https://scontent.webcollage.net/bestbuy/power-page?ird=true&channel-product-id=${id}`;
        const response = await fetch(api);
        const text = await response.text();
        eval(text);
        return Boolean(_wccontent.aplus.html.match(/wc-comparison-table/));
      }
    }
    const json = await getWitbAndComparison();
    if (json) {
      let witb = Object.values(Object.values(Object.values(json.experiences).find(elm => elm.hasOwnProperty('experiences')).experiences).find(elm => elm.hasOwnProperty('widgets')).widgets).filter(elm => elm.headerText.match(/in the box/i));
      witb = (witb[0] && witb[0].items[0].features.map(elm => ({ text: elm.caption, img: elm.asset.url.replace('{0}', elm.asset.originalWidth) }))) || [];
      const hasComparision = Object.values(Object.values(Object.values(json.experiences).find(elm => elm.hasOwnProperty('experiences')).experiences).find(elm => elm.hasOwnProperty('widgets')).widgets).filter(elm => elm.widgetType.match(/ComparisonTable/i));
      document.body.setAttribute('has-comparison', Boolean(hasComparision && hasComparision.length));
      document.body.setAttribute('witb-text', witb.map(elm => elm.text).join('|'));
      document.body.setAttribute('witb-url', witb.map(elm => elm.img).join('|'));
    } else {
      document.body.setAttribute('has-comparison', await getCompareTable());
    }
  }
  try {
    await context.evaluate(addWitbandCRT);
  } catch (error) {
    console.log('Error adding WITB/CTR', error);
  }

  return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    transform,
    domain: 'bestbuy.com',
    zipcode: '',
  },
  implementation,
};
