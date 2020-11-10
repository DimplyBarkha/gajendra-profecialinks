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
    const URL = await context.evaluate(async function () {
      return window.location.href;
    });
    console.log(URL);
    await context.goto(URL);
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
      const productDescription = getXpath("//div[contains(@class,'hidden-tab-up')]//h4[@class='product-short-description']", 'innerText');
      const name = getXpath("//div[contains(@class,'hidden-tab-up')]//div[@data-component='productDetailInfo']//h1", 'innerText');

      const marketingDescription = getXpath("//div[@id='marketing-content']", 'innerText');
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
        addElementToDocument('added_product_description', name + ' ' + productDescription);
        // addElementToDocument('added_variant', scriptXpathObj.graph[0].sku);
        addElementToDocument('added_mpn', scriptXpathObj.graph[0].mpn);
        // addElementToDocument('added_manufacturer', scriptXpathObj.graph[0].offers.seller.name);
        if (marketingDescription !== null) {
          addElementToDocument('added_description', scriptXpathObj.graph[0].description + '||' + marketingDescription);
        } else {
          addElementToDocument('added_description', scriptXpathObj.graph[0].description);
        }
        if (scriptXpathObj.graph[0].aggregateRating !== undefined) {
          const aggregateData = scriptXpathObj.graph[0].aggregateRating.ratingValue;
          const aggregate = aggregateData.split('.');
          const aggregateNewValue = aggregate[0] + '.' + aggregate[1].substring(0,1);
          // addElementToDocument('added_rating', aggregateNewValue);
          addElementToDocument('added_rating', aggregateNewValue.replace(/\./g, ','));
          addElementToDocument('added_rating_count', scriptXpathObj.graph[0].aggregateRating.reviewCount);
        }
      }
      const skuCodePath = getXpath('//div/@data-product-sku', 'nodeValue');
      if (skuCodePath && typeof skuCodePath === 'string') {
        addElementToDocument('added_sku', skuCodePath);
      }
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
        addElementToDocument('added_weight', weightNet.toString().replace(/,/g, '.'));
      }
      const energyXpath = getXpath("//div[@data-target='specifiche']//div/p[contains(text(),'energetica')]/parent::div/following-sibling::div", 'innerText');
      if (energyXpath !== null) {
        addElementToDocument('added_energy', energyXpath);
      }
      const upcXpathData = getXpath("//script[@type='text/javascript'][contains(@src,'//media.flixcar.com/delivery/js/hotspot/')]/@src", 'nodeValue');
      if (upcXpathData !== '' && upcXpathData !== null) {
        const upcData = upcXpathData.split('?');
        const upcDataFinal = upcData[0].split('/');
        addElementToDocument('added_gtin', upcDataFinal[upcDataFinal.length - 1]);
        console.log(upcDataFinal[upcDataFinal.length - 1]);
      }

      const sellerXpathData = getXpath('//div[@class="withdrawal-holder box-container"]//p[@class="services__item"]', 'innerText');
      if (sellerXpathData !== '' && sellerXpathData !== null) {
        const sellerInfo = sellerXpathData.toLowerCase();
        if (sellerInfo.includes('mediaworld') > -1) {
          addElementToDocument('added_seller_detail', 'MediaWorld');
        }
      }
      const manufactureXpath = getAllXpath("//div[@id='flix-inpage']//div[contains(@class,'flix-std-content')]", 'innerText');
      if (manufactureXpath.length > 0) {
        addElementToDocument('added_manufacture', manufactureXpath.join('|'));
      }
      const manufactureImageXpath = getAllXpath("//div[@id='flix-inpage']//img//@srcset | //div[@id='flix-inpage']//img//@data-img-src|//div[@id='flix-inpage']//img//@data-srcset", 'nodeValue');
      // addElementToDocument('added_manufactureImage', manufactureImageXpath);
      if (manufactureImageXpath.length > 0) {
        const manufactureImages = [];
        manufactureImageXpath.forEach(item => {
          manufactureImages.push('http:' + item);
        });
        addElementToDocument('added_manufactureImage', manufactureImages.join('|'));
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
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
