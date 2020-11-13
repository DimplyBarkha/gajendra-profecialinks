const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'bjs',
    transform: null,
    domain: 'bjs.com',
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

      const skuXpath = getXpath("//div[@class='prod-item-model-number']/span[1]/text()",'nodeValue');
      console.log("sku: ", skuXpath);
      if(skuXpath != null  ){
        const sku = skuXpath ? skuXpath.split(':') : [];
        addElementToDocument('sku_added',sku[1]);
        console.log(sku[1]);
        }
      
        const upcXpath1 = getXpath("//table[@class='table table-bordered']//tbody[@class='specs-table-body']/tr/th[contains(.,'upc')]/following-sibling::td[1]",'innerText');
        console.log("upcXpath1", upcXpath1);
        const upcXpath2 = getXpath("//table[@class='table table-bordered']//tbody[@class='specs-table-body']/tr/th[contains(.,'UPC')]/following-sibling::td[1]",'innerText');
        console.log("upcXpath2", upcXpath2);

        if(upcXpath1 != null){
          addElementToDocument('upc_added',upcXpath1);
        }else{
          addElementToDocument('upc_added',upcXpath2);
        }

        const weightXpath1 = getXpath("//table[@class='table table-bordered']//tbody[@class='specs-table-body']/tr/th[contains(.,'Item Weight')]/following-sibling::td[1]",'innerText');
        console.log("weightXpath1", weightXpath1);
        const weightXpath2 = getXpath("//table[@class='table table-bordered']//tbody[@class='specs-table-body']/tr/th[contains(.,'Weight')]/following-sibling::td[1]",'innerText');
        console.log("weightXpath2", weightXpath2);

        if(weightXpath1 != null){
          addElementToDocument('weight_added',weightXpath1);
        }else{
          addElementToDocument('weight_added',weightXpath2);
        }

        const quanityXpath1 = getXpath("//table[@class='table table-bordered']//tbody[@class='specs-table-body']/tr/th[contains(.,'Size')]/following-sibling::td[1]",'innerText');
        console.log("quanityXpath1", quanityXpath1);
        const quanityXpath2 = getXpath("//table[@class='table table-bordered']//tbody[@class='specs-table-body']/tr/th[contains(.,'Unit Size')]/following-sibling::td[1]",'innerText');
        console.log("quanityXpath2", quanityXpath2);

        if(quanityXpath1 != null){
          addElementToDocument('quantity_added',quanityXpath1);
        }else{
          addElementToDocument('quantity_added',quanityXpath2);
        }

        const jsonstr = getXpath("//script[@_ngcontent-bjs-universal-app-c171='']/text()",'nodeValue');
        console.log("jsonstr", jsonstr);

        if(jsonstr){
          const jsonObj = JSON.parse(jsonstr);
          console.log('jsonObj' + jsonObj.sku);
          addElementToDocument('retailer_product_code_added',jsonObj.sku);
        }
        //*[@id="desktopDescriptiontabcontent"]/div[1]/app-pdp-tab-description-molecule/div/div/li
        // const bulletXpath1 = getXpath("//*[@id='desktopDescriptiontabcontent']/div[1]/app-pdp-tab-description-molecule/div/div/li",'innerText');
        // console.log(bulletXpath1.length);
        // console.log("bulletXpath1", bulletXpath1);
        // const bulletXpath2 = getXpath("//*[@id='desktopDescriptiontabcontent']/div[1]/app-pdp-tab-description-molecule/div/div/ul/li",'innerText');
        // console.log("bulletXpath2", bulletXpath2);

        // if(bulletXpath1 != null){
        //   addElementToDocument('bullet_added',bulletXpath1);
        // }else{
        //   addElementToDocument('bullet_added',bulletXpath2);
        // }
        //const jsonStr = getXpath("//table[@class='table table-bordered']//tbody[@class='specs-table-body']//tr[@class='specs-table-row']//th[contains(.,  'upc')]", 'nodeValue');
      //table[@class="table table-bordered"]//tbody[@class="specs-table-body"]//tr[@class="specs-table-row"]//th[contains(.,  "upc")]
      //let available;
      //console.log("jsonStr: ", jsonStr);
      // if (jsonStr != null) {
      //   const jsonObj = JSON.parse(jsonStr);
      //   console.log('jsonObj' + jsonObj.sku);
      //   // if (((jsonObj.offers.availability).includes(['InStock']))) {
      //   //   available = 'InStock';
      //   // } else {
      //   //   available = 'OutOfStock';
      //  // addElementToDocument("",);
      //   }
   });
  await context.extract(productDetails, { transform: transformParam });
  },
};
