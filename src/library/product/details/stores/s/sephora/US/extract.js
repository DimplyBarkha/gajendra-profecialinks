const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'sephora',
    transform,
    domain: 'sephora.com',
  },
  implementation: async ({ parentInput }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    const itemUrl = await context.evaluate(function () {
      const resultsCheck = '(//h1//text()[not(parent::b)])[1]';
      var checkResults = document.evaluate(resultsCheck, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (checkResults.snapshotLength > 0) {
        const checkNone = checkResults.snapshotItem(0).textContent;
        if (checkNone === '0 Product results:') {
          // throw new Error("notFound");
          console.log('NO PRODUCTS FOUND');
        }
      }

      const itemCheck = '//div[@data-comp="ProductGrid "]//a';
      var checkElement = document.evaluate(itemCheck, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (checkElement.snapshotLength > 0) {
        const url = checkElement.snapshotItem(0).href;
        const splits = url.split('&');
        return splits[0];
      } else {
        return null;
      }
    });
    if (itemUrl) {
      await context.goto(itemUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
    }
    else {
      let prodUrl = await context.evaluate(function () {
        return window.location.href;
      });      
      if (prodUrl.includes('/ca/en')) {
        prodUrl = prodUrl.replace('/ca/en','');
        await context.goto(prodUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });
      }
    }

    const pageCheck = await context.evaluate(function () {
      const pageLoaded = '//main[contains(@data-comp, "ProductPage")]';
      var checkElement = document.evaluate(pageLoaded, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (checkElement.snapshotLength > 0) {
        return true;
      } else {
        return false;
      }
    });

    if (!pageCheck) {
      // throw new Error("productPageNotLoaded");
      return false;

    }


    await context.evaluate(async function () {
      if (document.querySelector('span[data-at^="number_of_reviews"]')) {
        document.querySelector('span[data-at^="number_of_reviews"]').click();
      }
    });

    try {
      await context.waitForSelector('div#ratings-reviews-container div#ratings-reviews', { timeout: 20000 });
    } catch (error) {
      const reviewButtonExists = await context.evaluate(async function () {
        return !!document.querySelector('span[data-at^="number_of_reviews"]');
      });
      if (reviewButtonExists) {
        await context.click('span[data-at^="number_of_reviews"]');
      }
      console.log('Loading ratings and reviews');
    }

    try {
      await context.waitForSelector('div[data-comp~="ReviewsStats"]  span[data-comp^="Text Box StyledComponent BaseComponent"]', { timeout: 20000 });
    } catch (error) {
      await context.evaluate(async function () {
        if (document.querySelector('span[data-at^="number_of_reviews"]')) {
          document.querySelector('span[data-at^="number_of_reviews"]').click();
        }
      });
      console.log('Loading ratings and reviews');
    }

    try {
      await context.waitForSelector('div[data-comp~="StyledComponent"] h2, div#tabpanel0', { timeout: 20000 });
    } catch (error) {
      console.log('Loading details');
    }

    await context.evaluate(async function () {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      if (document.querySelector('p[data-at="item_sku"]') && document.querySelector('p[data-at="item_sku"]').parentNode && document.querySelector('p[data-at="item_sku"]').parentNode.parentElement && document.querySelector('p[data-at="item_sku"]').parentNode.parentElement.lastElementChild) {
        const descriptionText = document.querySelector('p[data-at="item_sku"]').parentNode.parentElement.lastElementChild.innerText;
        addHiddenDiv('ii_Details', descriptionText);
      }

      if (document.querySelector('div[data-comp^="Rcarousel"] li:first-child img') && document.querySelector('div[data-comp^="Rcarousel"] li:first-child img').getAttribute('alt')) {
        const imageAlt = document.querySelector('div[data-comp^="Rcarousel"] li:first-child img').getAttribute('alt');
        addHiddenDiv('ii_imgAlt', imageAlt);
      }
    });

    const videos = await context.evaluate(function () {
      const videoClicks = document.querySelectorAll('div[data-comp*="Carousel"] img[src*="VideoImagesNEW"]');
      const videos = [];
      for (let i = 0; i < videoClicks.length; i++) {
        const link = videoClicks[i].getAttribute('src');
        if (!videos.includes(link)) { videos.push(link); }
      }
      return videos;
    });

    var reqAccept = 'application/json;pk=BCpkADawqM2Q0u_EMhwh6sG-XavxnNSGgRmPVZqaQsilEjLYeUK24ofKhllzQeA8owqhzPCRuGbPh9FkCBxnD8mYW4RHulG2uVuwr363jOYU8lRht0dPdw7n31iz7t3LvGdQWkUrxdxrXrqk';
    if (videos && videos.length) {
      for (let i = 0; i < videos.length; i++) {
        // Click a link on the page
        var selectorCheck = await context.evaluate(function (videos, i) {
          const ticks = videos[i].replace(/'/g, '"');
          const selectorVid = document.querySelector(`img[src='${ticks}']`);
          if (selectorVid) {
            return true;
          } else {
            return false;
          }
        }, videos, i);
        if (selectorCheck) {
          await context.click(`img[src='${videos[i]}']`);
          // await context.click('#tabItem_ogt_3_0 > button.css-snmyc5.e65zztl0[type="button"] > div.css-38q71r > div.css-5ix92y.e65zztl0 > div.css-16g8jcx.e65zztl0 > div.css-10aokas.e65zztl0 > div.css-1u6gbn2.e65zztl0 > svg.css-1a5s7yv.e65zztl0');
          console.log(`img[src='${videos[i]}']`);
          console.log('finished click');
          // Clicking a link caused a page reload, this function waits for the page to finish loading.
          // await context.waitForPage();
          await new Promise(resolve => setTimeout(resolve, 5000));
          console.log('finished waiting for page');
          const req = await context.searchAllRequests('edge.api.brightcove.com/playback/v1/accounts/6072792324001/videos/');

          if (req) {
            if (req[0]) {
              reqAccept = req[0].requestHeaders.Accept;
            }
          }
        }
      }
    }

    const videoIdArray = await context.evaluate(function () {
      const videoEle = document.querySelector('#linkJSON');
      const videoIdForUrl = [];
      if (videoEle) {
        const videoObj = JSON.parse(videoEle.innerText);
        if (videoObj[4] || videoObj[1]) {
          let videoIds = [];
          if (videoObj[4] && videoObj[4].props.currentProduct) {
            const partialVideo = videoObj[4].props.currentProduct;
            if (partialVideo) {
              videoIds = videoObj[4].props.currentProduct.productVideos;
            }
          } else if (videoObj[1] && videoObj[1].props.product) {
            const partialVideo = videoObj[1].props.product.product;
            if (partialVideo) {
              videoIds = partialVideo.productVideos;
            }
          }
          if (videoIds) {
            videoIds.forEach(obj => {
              videoIdForUrl.push(obj.videoUrl);
            });
          }
        }
      }
      return videoIdForUrl;
    });

    const html = await context.evaluate(async function getEnhancedContent(videoIdForUrl, acceptHeader) {
      const srcArray = [];
      async function fetchRetry(url, n) {
        function handleErrors(response) {
          if (response.status === 200) {
            return response;
          } else {
            console.log('FETCH FAILED');
            if (n === 1) return 'Nothing Found';
            return fetchRetry(url, n - 1);
          }
        }
        const fetched = fetch(url, {
          headers: {
            accept: acceptHeader,
          },
        }).then(handleErrors).then(response => response.text()).catch(() => {
          console.log('FETCH FAILED');
          if (n === 1) return 'Nothing Found';
          return fetchRetry(url, n - 1);
        });
        return fetched;
      }
      for (let i = 0; i < videoIdForUrl.length; i++) {
        const fetchTry = await fetchRetry(`https://edge.api.brightcove.com/playback/v1/accounts/6072792324001/videos/${videoIdForUrl[i]}`, 5);
        if (fetchTry !== 'Nothing Found') {
          srcArray.push(JSON.parse(fetchTry));
        }
      }
      return srcArray;
    }, videoIdArray, reqAccept);

    await context.evaluate(function (parentInput, html) {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      const prodUrl = window.location.href.split('&keyword=');
      addHiddenDiv('ii_url', prodUrl[0]);
      addHiddenDiv('ii_parentInput', parentInput);

      const element = document.querySelectorAll("script[type='application/ld+json']");
      let variantObj;
      const variantSkuArray = [];
      if (element.length > 0) {
        for (let i = 0; i < element.length; i++) {
          const variantText = element[i].innerText;
          if (variantText.includes('sku')) {
            const varObj = JSON.parse(variantText);
            if (varObj) {
              variantObj = varObj;
            }
          }
        }
      }
      if (variantObj) {
        if (variantObj.offers && variantObj.offers[0].sku) {
          for (let j = 0; j < variantObj.offers.length; j++) {
            if (variantObj.offers[j].sku) {
              variantSkuArray.push(variantObj.offers[j].sku);
            }
          }
        }
      }
      if (variantSkuArray.length) {
        const variantsStr = variantSkuArray.join(' | ');
        addHiddenDiv('ii_variantCount', variantSkuArray.length);
        addHiddenDiv('ii_variants', variantsStr);
      }

      let flag = true;
      let i = 0;
      while (flag) {
        const tab = document.querySelector(`button#tab${i}`);
        const pannel = document.querySelector(`div[aria-labelledby="tab${i}"]`);
        if (tab && pannel) {
          addHiddenDiv(`ii_${tab.innerText}`, pannel.innerText);
        } else {
          flag = false;
          break;
        }
        i++;
      }

      html.forEach(obj => {
        if (obj.sources) {
          const videoSrc = obj.sources[2];
          if (videoSrc) {
            addHiddenDiv('ii_video', videoSrc.src);
          }
        }
      });

      const sizeInfo = '//div[contains(@data-comp,"SizeAndItemNumber")]';
      var sInfo = document.evaluate(sizeInfo, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      if (sInfo.snapshotLength > 0) {
        const info = sInfo.snapshotItem(0).textContent;
        if (info.includes('•ITEM') || info.includes('• ITEM')) {
          const splits = info.split('•');
          if (!splits[0].includes('ITEM')) {
            const removeSize = splits[0].replace(/SIZE /g, '');
            addHiddenDiv('ii_quantity', removeSize);
          }
        }
        if (info.includes('ITEM')) {
          const skuSelect = info.match(/ITEM ([0-9])+/g);
          if (skuSelect) {
            const skuNum = skuSelect[0].replace(/ITEM /g, '');
            addHiddenDiv('ii_sku', skuNum);
          }
        }
      }

      const variantInfo = '//span[contains(@data-at,"item_variation_type")]';
      var vInfo = document.evaluate(variantInfo, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const variantArr = [];
      if (vInfo.snapshotLength > 0) {
        const info = vInfo.snapshotItem(0).textContent;
        const splits = info.split(':');
        if (splits[1]) {
          variantArr.push(splits[1]);

          if (info.includes('COLOR')) {
            addHiddenDiv('ii_color', splits[1]);
          }
          if (info.includes('SIZE') || info.includes('oz/') || info.includes(' mL')) {
            addHiddenDiv('ii_quantity', splits[1]);
          }
          addHiddenDiv('ii_variantInfo', splits[1]);
        } else {
          if (splits[0].includes('oz/') || splits[0].includes(' mL')) {
            addHiddenDiv('ii_quantity', splits[0]);
          }
          variantArr.push(splits[0]);
          addHiddenDiv('ii_variantInfo', splits[0]);
        }
      }

      const nameExtended = '//h1[contains(@data-comp,"DisplayName")]//text()';
      var eName = document.evaluate(nameExtended, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const nameArray = [];
      if (eName.snapshotLength > 0) {
        for (let i = 0; i < eName.snapshotLength; i++) {
          const name = eName.snapshotItem(i).textContent;
          nameArray.push(name);
        }
        variantArr.forEach(info => {
          nameArray.push(info);
        });
        const fullName = nameArray.join(' - ');
        addHiddenDiv('ii_nameExtended', fullName);
      }
    }, parentInput, html);

    await new Promise(resolve => setTimeout(resolve, 5000));

    return await context.extract(productDetails, { transform: transformParam });
  },
};
