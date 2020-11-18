const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'mobilcom-debitel',
    transform: null,
    domain: 'mobilcom-debitel.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      //TBD
      const priceXpath1 = getXpath("//div[@class='price-item__euro js-product-detail-device-once-euro']",'innerText');
      const priceXpath2 = getXpath("//span[@class='price-item__cent-value js-product-detail-device-once-cent']",'innerText');
      const currencyXpath = getXpath("//div[@class='price-item__unit-icon']",'innerText');
      console.log("priceXpath1", priceXpath1);
      console.log("priceXpath2", priceXpath2);
      console.log("currencyXpath", currencyXpath);
      const priceXpath = priceXpath1.concat('.').concat(priceXpath2).concat(currencyXpath);
      console.log("priceXpath: ", priceXpath);
      addElementToDocument('added_price', priceXpath);


      //const descXpath = getXpath("//div[@class='product-info-box-text__content js-product-info-box-text-offset']//ul",'innerText');
      //console.log("descXpath", descXpath);

      const jsonStr = getXpath("//div[@class='site-md__main-content']//script[@type='application/ld+json']",'innerText');
      if(jsonStr){
        const jsonObj = JSON.parse(jsonStr);
        console.log('jsonObj: ' + jsonObj.brand);
        addElementToDocument('added_brand', jsonObj.brand);
      }
     
      const jsonStr1 = getXpath(" //div[@class='site-md__main-content']//script[2]",'innerText');
      if(jsonStr1){
        const jsonObj = JSON.parse(jsonStr);
        console.log('jsonObj: ' + jsonObj);
        addElementToDocument('added_brand', jsonObj.brand);
      }
      //div[@class="table-list-grouping__items-wrapper"]//div[@class="table-list-grouping__item"]//div[contains(.,"Dimensions")]/following-sibling::div[2]
      const dimentionXpath = getXpath("/html/body/div[1]/div[2]/div/section[4]/div/div/div/div/div[4]/div/div/div[2]/div[contains(.,'Dimensions')]/following-sibling::div",'nodeValue');
      console.log("dimentionXpath: ", dimentionXpath);

      //meta[@property="og:url"]/@content
      const retailerCodeXpath = getXpath("//link[@rel='canonical']/@href",'nodeValue');
      console.log("retailerCodeXpath: ", retailerCodeXpath);

  });
  await context.extract(productDetails, { transform: transformParam });
  },
};


