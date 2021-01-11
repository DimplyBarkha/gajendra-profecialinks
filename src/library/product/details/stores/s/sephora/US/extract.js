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
    } else {
      let prodUrl = await context.evaluate(function () {
        return window.location.href;
      });
      if (prodUrl.includes('/ca/en')) {
        prodUrl = prodUrl.replace('/ca/en', '');
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

    // await context.evaluate(async function () {
    //   if (document.querySelector('span[data-at^="number_of_reviews"]')) {
    //     document.querySelector('span[data-at^="number_of_reviews"]').click();
    //   }
    // });

    // try {
    //   await context.waitForSelector('div#ratings-reviews-container div#ratings-reviews', { timeout: 20000 });
    // } catch (error) {
    //   const reviewButtonExists = await context.evaluate(async function () {
    //     return !!document.querySelector('span[data-at^="number_of_reviews"]');
    //   });
    //   if (reviewButtonExists) {
    //     await context.click('span[data-at^="number_of_reviews"]');
    //   }
    //   console.log('Loading ratings and reviews');
    // }

    // try {
    //   await context.waitForSelector('div[data-comp~="ReviewsStats"]  span[data-comp^="Text Box StyledComponent BaseComponent"]', { timeout: 20000 });
    // } catch (error) {
    //   await context.evaluate(async function () {
    //     if (document.querySelector('span[data-at^="number_of_reviews"]')) {
    //       document.querySelector('span[data-at^="number_of_reviews"]').click();
    //     }
    //   });
    //   console.log('Loading ratings and reviews');
    // }

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




    await context.evaluate(function (parentInput) {
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

      const variantInfo = '//span[not(ancestor::*[contains(@data-comp,"AncillaryItem")])][contains(@data-at,"item_variation_type")]';
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

      // const nameExtended = '//h1[contains(@data-comp,"DisplayName")]//text()';
      // var eName = document.evaluate(nameExtended, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      // const nameArray = [];
      // if (eName.snapshotLength > 0) {
      //   for (let i = 0; i < eName.snapshotLength; i++) {
      //     const name = eName.snapshotItem(i).textContent;
      //     nameArray.push(name);
      //   }
      //   variantArr.forEach(info => {
      //     nameArray.push(info);
      //   });
      //   const fullName = nameArray.join(' - ');
      //   addHiddenDiv('ii_nameExtended', fullName);
      // }
    }, parentInput);
    await context.evaluate(async function () {
      var heading = document.querySelector('h1');
      const rating = Sephora.mboxAttrs.productRating.toFixed(1);
      if (heading) {
        heading.setAttribute('rating', rating);
      }
      async function getReviewCount() {
        var productId = Sephora.mboxAttrs.productId;
        const response = await fetch(`https://api.bazaarvoice.com/data/reviews.json?Filter=contentlocale%3Aen*&Filter=ProductId%3A${productId}&Sort=SubmissionTime%3Adesc&Limit=30&Offset=0&Include=Products%2CComments&Stats=Reviews&passkey=rwbw526r2e7spptqd2qzbkp7&apiversion=5.4&Locale=en_US`);
        return response.json();

      }
      var count = await getReviewCount();
      var reviewCount = count.Includes.Products
      var totalReviewCount = reviewCount[Object.keys(reviewCount)[0]].TotalReviewCount;
      var description = reviewCount[Object.keys(reviewCount)[0]].Description.replace(/-\s/g,' || ');
      if (heading) {
        heading.setAttribute('review-count', totalReviewCount);
        heading.setAttribute('description', description);
      }




      const altImage = JSON.parse(document.querySelector('script#linkStore').textContent);
      const arrImage = altImage["page"] && altImage["page"].product && altImage["page"].product.currentSku && altImage["page"].product.currentSku.alternateImages;
      if (arrImage && arrImage.length) {
        arrImage.map(e => {
          let newlink = document.createElement('a');
          newlink.setAttribute('class', 'append_image');
          newlink.setAttribute('href', e.imageUrl.replace(/(.+)/g, 'https://sephora.com$1'));
          document.body.appendChild(newlink);
        });
      }
      async function getVideo() {
        async function getObj() {
          const response = await fetch(window.location.href);
          const html = await response.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const json = JSON.parse(doc.querySelector("#linkJSON").innerText);
          return json;
        }
        const dataObj = await getObj();
        if (dataObj) {
          const videoIds = dataObj.find(elm => elm.props.product) && dataObj.find(elm => elm.props.product).props.product.product.productVideos && dataObj.find(elm => elm.props.product) && dataObj.find(elm => elm.props.product).props.product.product.productVideos.map(elm => elm.videoUrl);
          const accountID = document.querySelector('[src^="//players.brightcove.net/"]') && document.querySelector('[src^="//players.brightcove.net/"]').src && document.querySelector('[src^="//players.brightcove.net/"]').src.match(/players.brightcove.net\/([^\/]+)/)[1];
          const apis = videoIds && videoIds.map(elm => `https://edge.api.brightcove.com/playback/v1/accounts/${accountID}/videos/${elm}`);
          const promises = apis && apis.map(elm => fetch(elm, {
            "headers": {
              "accept": "application/json;pk=BCpkADawqM2Q0u_EMhwh6sG-XavxnNSGgRmPVZqaQsilEjLYeUK24ofKhllzQeA8owqhzPCRuGbPh9FkCBxnD8mYW4RHulG2uVuwr363jOYU8lRht0dPdw7n31iz7t3LvGdQWkUrxdxrXrqk",
            }
          }))
          if (promises) {
            const responses = await Promise.all(promises);
            const json = await Promise.all(responses.map(elm => elm.json()));
            const videoUrls = json.map(elm => elm.sources.find(elm => elm.container === "MP4").src);
            console.log(videoUrls);
            return videoUrls;
          }
        }
      }
      var video = await getVideo();
      if (video && video.length) {
        video.map(e => {
          let newlink = document.createElement('a');
          newlink.setAttribute('class', 'video');
          newlink.href = e;
          document.body.appendChild(newlink);
        });
      }
    })

    await new Promise(resolve => setTimeout(resolve, 5000));

    return await context.extract(productDetails, { transform: transformParam });
  },
};
