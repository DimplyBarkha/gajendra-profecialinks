const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'mediaworld',
    transform: cleanUp,
    domain: 'mediaworld.it',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    const productUrl = await context.evaluate(async function () {
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      const url = getXpath("//div[contains(@class,'search-product-list') and contains(@class,'active')]//div[contains(@class,'search-product-list-content') and contains(@class,'display-mode-list active')]//h3[contains(@class,'product-name')]/a/@href", 'nodeValue');
      return url;
    });
    if (productUrl && productUrl !== '') {
      try {
        await context.setAntiFingerprint(false);
        await context.setLoadAllResources(true);
        await context.setBlockAds(false);
        await context.setLoadImages(true);
        await context.goto('https://www.mediaworld.it' + productUrl);
      } catch (error) {
        console.log('No record');
      }
    }
    const hasShowMore = await context.evaluate(function () {
      return Boolean(document.evaluate('//div[@id="flix_hotspots"]//svg[@id="flix_key_features"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
    });
    if (hasShowMore) {
      await context.click('div[id="flix_hotspots"] svg[id="flix_key_features"]', {}, { timeout: 100000 });
    }
    const videoMore = await context.evaluate(function () {
      return Boolean(document.evaluate('//script[@id="popup-product-detail-main"][contains(text(),"youtube")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
    });
    if (videoMore) {
      await context.click('div .thumb-media-container a.thumb-media-item', {}, { timeout: 50000 });
    }
    try {
      await new Promise(resolve => setTimeout(resolve, 5000));
      await context.waitForSelector('ul[class="productDetailsTabs"] li[class="productDetails-tab active"]', {}, { timeout: 100000 });
      await context.waitForXPath("//div[@id='flix-inpage']//img/@srcset | //div[@id='flix-inpage']//img/@data-img-src|//div[@id='flix-inpage']//img/@data-srcset", {}, { timeout: 100000 });
      await context.waitForSelector('div[id="flix-inpage"] img', {}, { timeout: 100000 });
    } catch (error) {
      console.log(error);
    }
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      function stall (ms) {
        // @ts-ignore
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }
      const name = getXpath("//div[contains(@class,'hidden-tab-up')]//div[@data-component='productDetailInfo']//h1", 'innerText');
      const productDescription = getXpath("//div[contains(@class,'hidden-lg')]//h2[contains(@itemprop,'description')]", 'innerText');
      addElementToDocument('added_description', productDescription);
      const scriptXpathData = getXpath("//script[@type='application/ld+json'][contains(text(),'@graph')]", 'innerText');
      if (scriptXpathData !== null) {
        const scriptXpath = scriptXpathData.toString().replace(/@graph/g, 'graph');
        var scriptXpathObj = JSON.parse(scriptXpath);
        const price = scriptXpathObj.graph[0].offers.price;
        const priceXpath = price.replace(/\./g, ',');
        addElementToDocument('added_product_price', scriptXpathObj.graph[0].offers.priceCurrency + priceXpath);
        const listPrice = getXpath("//div[@class='product-detail-main-container']/@data-gtm-price-full", 'nodeValue');
        const listPriceXpath = listPrice.toString().replace(/\./g, ',');
        addElementToDocument('added_listprice', scriptXpathObj.graph[0].offers.priceCurrency + listPriceXpath);
        addElementToDocument('added_brand', scriptXpathObj.graph[0].brand.name);
        addElementToDocument('added_product_description', name);
        addElementToDocument('added_mpn', scriptXpathObj.graph[0].mpn);
        // addElementToDocument('added_description', scriptXpathObj.graph[0].description);
        if (scriptXpathObj.graph[0].aggregateRating !== undefined) {
          const aggregateData = scriptXpathObj.graph[0].aggregateRating.ratingValue;
          const aggregate = aggregateData.split('.');
          const aggregateNewValue = aggregate[0] + '.' + aggregate[1].substring(0, 1);
          addElementToDocument('added_rating', aggregateNewValue.replace(/\./g, ','));
        } else {
          const ratingAlternateXpath = getXpath("//div[@class='absnippert2contain']/img/@alt", 'nodeValue');
          if (ratingAlternateXpath != null && !ratingAlternateXpath.includes('alaScore')) {
            addElementToDocument('added_rating', ratingAlternateXpath);
          } else {
            const ratingAlternateXpath = getXpath("//div[@class='absnippert2contain']/img/@alt", 'nodeValue');
            if (ratingAlternateXpath != null && ratingAlternateXpath.includes('alaScore')) {
              // @ts-ignore
              if (document.getElementById('frame_content') != null && document.getElementById('frame_content').contentWindow.document.querySelector('.topsummary_text') !== null) {
                // @ts-ignore
                const aggregateRatingSummary = document.getElementById('frame_content').contentWindow.document.querySelector('.topsummary_text').innerText;
                if (aggregateRatingSummary !== null && aggregateRatingSummary.includes('La media della valutazione per questo')) {
                  try {
                    // var aggregatematchData = aggregateRatingSummary.match(/([^\\/]+)/i);
                    console.log(aggregateRatingSummary);
                    var n = aggregateRatingSummary.indexOf('La media della valutazione per questo prodotto è');
                    var matchString = 'La media della valutazione per questo prodotto è';
                    const finalAggregate = aggregateRatingSummary.substr(n + matchString.length, 4);
                    // var aggregateRatingArray = aggregatematchData[0].split(' ');
                    // const finalAggregate = aggregateRatingArray[aggregateRatingArray.length - 1];
                    addElementToDocument('added_rating', finalAggregate.replace(/\./g, ','));
                  } catch (err) {
                    console.log('Rating is the problem');
                  }
                }
              } else {
                console.log('data is coming data is coming data is coming');
                const ratingXPath = getXpath('//div[@id="alaTestSnippet"]//div[@class="star_rating"]//div/@class', 'nodeValue');
                if (ratingXPath) {
                  var ratingXPathString = ratingXPath.replace(/r/g, '');
                  const aggregateX = ratingXPathString / 2;
                  console.log(aggregateX);
                  addElementToDocument('added_rating', aggregateX.toString().replace(/\./g, ','));
                }
              }
            }
          }
        }
      }
      /* const skuCodePath = getXpath('//div[@class="product-detail-main-container"]//a[contains(@class,"wishlist-btn")]/@data-product-id', 'nodeValue');
      if (skuCodePath && typeof skuCodePath === 'string') {
        addElementToDocument('added_sku', skuCodePath);
      } */
      const specificInfoXpath = getAllXpath("//ul[@class='content__Tech__block']//li[@class='content__Tech__row']", 'innerText');
      addElementToDocument('added_specific_information', specificInfoXpath.join('||'));
      // const videoUrlPath = getXpath("//div[contains(@class,'fullJwPlayerWarp')]//input[@class='flix-jw']/@value", 'nodeValue');
      const videoUrlPath = getAllXpath("//input[@class='flix-jw']/@value", 'nodeValue');
      if (videoUrlPath.length > 0) {
        for (let i = 0; i < videoUrlPath.length; i++) {
          if (videoUrlPath[i] && typeof videoUrlPath[i] === 'string') {
            console.log(videoUrlPath[i]);
            try {
              var videoUrlObj = JSON.parse(videoUrlPath[i]);
              videoUrlObj.playlist.forEach(element => {
                addElementToDocument('added_video_url', 'https:' + element.file);
              });
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
      const videoUrlPath1 = getXpath("//div[contains(@class,'flix_jw_videoid')]/@data-jw", 'nodeValue');
      if (videoUrlPath1 && typeof videoUrlPath1 === 'string') {
        addElementToDocument('added_video_url', 'https:' + videoUrlPath1);
      }
      const weightNet = getXpath("//div[@data-target='specifiche']//div/p[contains(text(),'Peso')]/parent::div/following-sibling::div", 'innerText');
      if (weightNet !== null) {
        addElementToDocument('added_weight', weightNet.toString().replace(/,/g, '.'));
      }
      const energyXpath = getXpath("//div[@data-target='specifiche']//div/p[contains(text(),'energetica')]/parent::div/following-sibling::div", 'innerText');
      if (energyXpath !== null) {
        addElementToDocument('added_energy', energyXpath);
      }
      const sellerXpathData = getXpath('//div[@class="withdrawal-holder box-container"]//p[@class="services__item"]', 'innerText');
      if (sellerXpathData !== '' && sellerXpathData !== null) {
        const sellerInfo = sellerXpathData.toLowerCase();
        if (sellerInfo.includes('mediaworld') > -1) {
          addElementToDocument('added_seller_detail', 'MediaWorld');
        }
      }
      // const manufactureXpath = getAllXpath("//div[@id='flix-inpage'] | //div[@id='marketing-content']", 'innerText');
      const manufactureXpath = getAllXpath("//div[@id='flix-inpage']", 'innerText');
      const paginationPath = getXpath("//p[contains(@class,'fl1xcarousel-pagination')]", 'innerText');
      if (manufactureXpath.length > 0) {
        addElementToDocument('added_manufacture', manufactureXpath.join('|').replace(paginationPath, ' '));
      }
      const manufactureImageXpath = getAllXpath("//div[@id='flix-inpage']//img/@srcset | //div[@id='flix-inpage']//img/@data-img-src|//div[@id='flix-inpage']//img/@data-srcset", 'nodeValue');
      if (manufactureImageXpath.length > 0) {
        const manufactureImages = [];
        manufactureImageXpath.forEach(item => {
          manufactureImages.push('http:' + item);
        });
        addElementToDocument('added_manufactureImage', manufactureImages.join(' | '));
      }
      const variantXpath = getAllXpath('//div[@data-component="productDetailInfo"]//ul[@class="variant-list"]//li[position()>1]//a/@title', 'nodeValue');
      if (variantXpath.length > 0) {
        let colorList = '';
        let colorString;
        variantXpath.forEach(item => {
          colorString = item.split(' ');
          colorList += colorString[colorString.length - 1] + '|';
        });
        colorList = colorList.substring(0, colorList.length - 1);
        addElementToDocument('added_variantInfo', colorList);
      }
      const scriptXpath = getXpath("//script[@type='text/javascript'][contains(text(),'mwProductDetailData')]", 'innerText');
      if (scriptXpath !== null) {
        try {
          var script = scriptXpath.replace('window.mwProductDetailData = ', '');
          var scriptData = script.substring(1, script.length - 2);
          scriptData = scriptData.replace(/\\/g, '');
          scriptData = scriptData.replace(/\n/g, '');
          var matchData = scriptData.match(/("identifier":")([^"]+)/i);
          addElementToDocument('added_gtin', matchData[2]);
          var matchData2 = scriptData.match(/("catentryId":)([^,]+)/i);
          addElementToDocument('added_sku', matchData2[2]);
        } catch (error) {
          console.log(error);
        }
      }
      // secondary image Total
      // const videoAlignXpath2 = getXpath("//script[@id='popup-product-detail-main'][contains(text(),'youtube')]", 'innerText');
      const videoAlignXpath3 = getXpath("//div[@class='video-wrapper']//iframe/@src", 'nodeValue');
      if (videoAlignXpath3 !== null) {
        addElementToDocument('added_video_url', videoAlignXpath3);
      }
      // @ts-ignore
      if (document.getElementById('frame_content') != null && document.getElementById('frame_content').contentWindow.document.getElementById('abtabtags_count') !== null) {
        // @ts-ignore
        const ratingCountXpath = document.getElementById('frame_content').contentWindow.document.getElementById('abtabtags_count').innerText;
        addElementToDocument('added_rating_count', ratingCountXpath.substring(ratingCountXpath.indexOf('(') + 1, ratingCountXpath.lastIndexOf(')')));
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
