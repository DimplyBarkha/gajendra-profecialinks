const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'mobilcom-debitel',
    transform: transform,
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

      const priceXpath = currencyXpath.concat((priceXpath1.concat(',').concat(priceXpath2)));
      console.log("priceXpath- new : ", priceXpath);
      addElementToDocument('added_price', priceXpath);

      const pXpath = getXpath("//div[@class='site-md__main-content']//script[3]",'nodeValue');

      const jsonStr = getXpath("//div[@class='site-md__main-content']//script[@type='application/ld+json']",'innerText');
      if(jsonStr){
        const jsonObj = JSON.parse(jsonStr);

        var sku1 = jsonObj.isSimilarTo[0].sku;
        var color1 = jsonObj.isSimilarTo[0].color;
        var sku2 = "";
        var color2 = "";
        console.log("color1: ", color1);
        var skuColr1 = (color1.concat(" - ")).concat(sku1);
        addElementToDocument('added_firstVarient', skuColr1);
        //
        if(jsonObj.isSimilarTo[1] != null){
          sku2 = jsonObj.isSimilarTo[1].sku;
          color2 = jsonObj.isSimilarTo[1].color;
          var skuColr2 = (color2.concat(" - ")).concat(sku2);
          var varientInfo  = (skuColr1.concat(" | ")).concat(skuColr2);
          addElementToDocument('added_varientInfo', varientInfo);
        }else{
          addElementToDocument('added_varientInfo', skuColr1);
        }

        addElementToDocument('added_brand', jsonObj.brand);
        addElementToDocument('added_nameExtended', jsonObj.name);

        var availabilityTextPath = jsonObj.offers.availability;
        var availabilityTextPathValue = availabilityTextPath.split('/')[3];
        //console.log("availabilityTextPathValue: ", availabilityTextPathValue)
        addElementToDocument('added_availabilityText',  availabilityTextPathValue);

        
        var descriptionTextPath = jsonObj.isSimilarTo[0].description;
        //console.log("descriptionTextPath: ", descriptionTextPath);
        const depSplitText = (descriptionTextPath.split('|')).join('||');
        //console.log("depSplitText: ", depSplitText);
        addElementToDocument('added_desc', depSplitText);

      }

      const manuXpath = getAllXpath("//div[@class='table-list-grouping__items-wrapper']//div[@class='table-list-grouping__item']//div[contains(.,'Manufacturer')]/following-sibling::div[1]",'textContent');
      //const manuXpath = getAllXpath("//div[@class='table-list-grouping__items-wrapper']/div[@class='table-list-grouping__item']/div[@class='table-list-grouping__item-label']/font/font",'innerText');
      console.log("manuXpath: ", manuXpath);
     
      // const somePath = getAllXpath("//div[@class='site-md__product-details-technicaldata']/div[@class='table-list-grouping']/div[@class='table-list-grouping__items-wrapper']/div[@class='table-list-grouping__item'][3]/div[@class='table-list-grouping__item-value']",'innerText');
      // //console.log("somePath: ", somePath);
      // addElementToDocument('added_dimentions', somePath);
   
      const retailerCodeXpath = getXpath("//link[@rel='canonical']/@href",'nodeValue').split('/');
      var retailerCodeXpathLength = retailerCodeXpath.length;
      addElementToDocument('added_retailer_product_code', (retailerCodeXpath[retailerCodeXpathLength-1]).split("-")[2]);

      const specificationXpath = getAllXpath("//div[@class='table-list-grouping__items-wrapper']//div[@class='table-list-grouping__item']",'innerText').join(' || ');
      console.log("specificationXpath: ", specificationXpath);
      addElementToDocument('specificationXpath_added', specificationXpath);
      //addElementToDocument('added_desc', descXpath);

      const listPriceXpath = getXpath("//span[@class='price-item__strike']",'innerText');
      //console.log("listPriceXpath: ", listPriceXpath);
      addElementToDocument('listPriceXpath_added', listPriceXpath);

      const colorXpath = getXpath("//div[@class='table-list-grouping__items-wrapper']//div[@class='table-list-grouping__item']//div[contains(.,'colour')]/following-sibling::div[1]",'outerText');
      console.log("colorXpath: ", colorXpath);

      const imgXpath = getAllXpath("//div[@class='swiper-wrapper js-grid-slider-wrapper']/div[position()>1]/img/@src",'nodeValue');
      var url = "https://www.mobilcom-debitel.de";
          
      var strImageValue = '';
      var emptyImageArray = [];
     
      if(imgXpath.length > 1){
        for(var i=0; i<imgXpath.length; i++){
          strImageValue =  ((imgXpath.join('||')).split('||'))[i];
          console.log("strImageValue: ", url.concat(strImageValue));
          var stringArray = [url.concat(strImageValue)];
         console.log("ArrayImg is: ", stringArray);
         emptyImageArray.push(stringArray);
        }
        console.log("emptyImageArray: ", emptyImageArray.join('  || '));
        addElementToDocument('altImages_added',  emptyImageArray.join('  || '));
      }else if(imgXpath.length == 1){
        var Str = imgXpath[0];
        console.log("altImages:-2  ", url.concat(Str));
        addElementToDocument('altImages_added', url.concat(Str));
      }
      
  });
  await context.extract(productDetails, { transform: transformParam });
  },
};


