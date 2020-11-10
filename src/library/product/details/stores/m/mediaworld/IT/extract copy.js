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
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
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
      // div[@class='product-detail-main-container']/@data-pcode
      // div[@class='product-detail-main-container']/@data-gtm-price
      // div[@class='product-detail-main-container']/@data-gtm-brand
      // div[@class='product-detail-main-container']/@data-gtm-ranking
      // div[contains(@class,'hidden-lg')]//h2[@itemprop='description']
      // div[@itemprop="AggregateRating"]//meta[@itemprop="reviewCount"]/@content
      const marketingDescription = getXpath("//div[@id='marketing-content']", 'innerText');
      // const scriptXpath = getXpath("//script[@type='application/ld+json'][contains(text(),'@graph')]", 'innerText');
      const scriptXpathData = getXpath("//script[@type='application/ld+json'][contains(text(),'@graph')]", 'innerText');
      // const scriptXpath = scriptXpathData.replace('@graph', 'graph');
      if (scriptXpathData !== null) {
        const scriptXpath = scriptXpathData.toString().replace(/@graph/g, 'graph');
        var scriptXpathObj = JSON.parse(scriptXpath);
        addElementToDocument('added_product_price', scriptXpathObj.graph[0].offers.priceCurrency + ' ' + scriptXpathObj.graph[0].offers.price);
        const listPrice = getXpath("//div[@class='product-detail-main-container']/@data-gtm-price-full",'nodeValue');
        addElementToDocument('added_listprice', scriptXpathObj.graph[0].offers.priceCurrency + ' ' + listPrice);
        addElementToDocument('added_brand', scriptXpathObj.graph[0].brand.name);
        addElementToDocument('added_variant', scriptXpathObj.graph[0].sku);
        addElementToDocument('added_mpn', scriptXpathObj.graph[0].mpn);
        addElementToDocument('added_manufacturer', scriptXpathObj.graph[0].offers.seller.name);
        if (marketingDescription !== null) {
          addElementToDocument('added_description', scriptXpathObj.graph[0].description + '||' + marketingDescription);
        } else {
          addElementToDocument('added_description', scriptXpathObj.graph[0].description);
        }
        if (scriptXpathObj.graph[0].aggregateRating !== undefined) {
          addElementToDocument('added_rating', parseInt(scriptXpathObj.graph[0].aggregateRating.ratingValue));
          addElementToDocument('added_rating_count', scriptXpathObj.graph[0].aggregateRating.reviewCount);
        }
      }
      // const skuCodePath = getXpath("//div[@class='product-detail-main-container']//a/@data-parameters",'nodeValue');
      const skuCodePath = getXpath('//div/@data-product-sku', 'nodeValue');
      if (skuCodePath && typeof skuCodePath === 'string') {
        addElementToDocument('added_sku', skuCodePath);
      }
      /* addElementToDocument('added_product_price', scriptXpathObj['@graph'][0].offers.priceCurrency + ' ' + scriptXpathObj['@graph'][0].offers.price);
      addElementToDocument('added_brand', scriptXpathObj['@graph'][0].brand.name);
      addElementToDocument('added_sku', scriptXpathObj['@graph'][0].sku);
      addElementToDocument('added_mpn', scriptXpathObj['@graph'][0].mpn);
      addElementToDocument('added_manufacturer', scriptXpathObj['@graph'][0].offers.seller.name);
      addElementToDocument('added_description', scriptXpathObj['@graph'][0].description + ',' + marketingDescription);
      if (scriptXpathObj['@graph'][0].aggregateRating !== undefined) {
        addElementToDocument('added_rating', scriptXpathObj['@graph'][0].aggregateRating.ratingValue);
        addElementToDocument('added_rating_count', scriptXpathObj['@graph'][0].aggregateRating.reviewCount);
      } */

      const specificInfoXpath = getAllXpath("//ul[@class='content__Tech__block']//li[@class='content__Tech__row']", 'innerText');
      addElementToDocument('added_specific_information', specificInfoXpath.join('||'));

      const videoUrlPath = getXpath("//div[contains(@class,'fullJwPlayerWarp')]//input[@class='flix-jw']/@value", 'nodeValue');
      if (videoUrlPath && typeof videoUrlPath === 'string') {
        var videoUrlObj = JSON.parse(videoUrlPath);
        videoUrlObj.playlist.forEach(element => {
          addElementToDocument('added_video_url', 'http:' + element.file);
        });
      }
      const videoUrlPath1 = getXpath("//div[contains(@class,'flix_jw_videoid')]/@data-jw", 'nodeValue');
      if (videoUrlPath1 && typeof videoUrlPath1 === 'string') {
        addElementToDocument('added_video_url', 'http:' + videoUrlPath1);
      }
      const weightNet = getXpath("//div[@data-target='specifiche']//div/p[contains(text(),'Peso')]/parent::div/following-sibling::div", 'innerText');
      if (weightNet !== null) {
        addElementToDocument('added_weight', weightNet.toString().replace(/,/g, '.') + ' Kg');
      }
    });
    await context.extract(productDetails);
  },
};
