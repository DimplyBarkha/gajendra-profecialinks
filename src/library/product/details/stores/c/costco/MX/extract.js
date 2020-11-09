const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'costco',
    transform: cleanUp,
    domain: 'costco.com.mx',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain,  transform: transformParam  }, context, { productDetails }) => {
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

      const priceOne = getXpath("//div[@class='price-original']//span[@class='notranslate']/text()", 'nodeValue'); 
      const priceTwo= getXpath("//div[@class='price-after-discount']//span[@class='you-pay-value']/text()", 'nodeValue');
      if(priceOne && priceTwo){
       addElementToDocument('added_onlinePrice', priceTwo);       
       addElementToDocument('addedlistedPrice', priceOne);       
      } else {
        addElementToDocument('added_onlinePrice', priceOne);
      }
  
      const aggregateRating = getXpath("//div[@class='bv_avgRating_component_container notranslate']/text()", 'nodeValue');
      console.log('aggregateRating' + aggregateRating)
      if(aggregateRating){
        addElementToDocument('added_aggregateRating', aggregateRating.replace('.' ,','));
    }
        addElementToDocument('added_variantCount', 0);

        const addtionalDescBullets = getAllXpath("//div[@id='collapse-PRODUCT_DETAILS']//ul/li//text()", 'nodeValue');
        console.log(addtionalDescBullets + 'addtionalDescBullets');
        if(addtionalDescBullets){
        var additionalDescBulletText = addtionalDescBullets.join('|| ');  
        addElementToDocument('addedAdditionaDescBullets', additionalDescBulletText);
        }    


        const addtionalDesc = getAllXpath("//div[@id='collapse-PRODUCT_DETAILS']//p/text()", 'nodeValue');
 
        var finalText = (additionalDescBulletText != '')  ? (additionalDescBulletText + " | " + addtionalDesc.join('')) : addtionalDesc;
        addElementToDocument('added_additionalDesc', finalText);

        
        const specification = getAllXpath("//div[@id='collapse-PRODUCT_SPECS']//div[@class='product-classifications']//div[@class='headline']/text() | //div[@id='collapse-PRODUCT_SPECS']//div[@class='product-classifications']//table//tr//td/text()"
        , 'nodeValue');
       if(specification){
        addElementToDocument('added_specification', specification);
       }

        const shippingDimension = getXpath("//div[@id='collapse-PRODUCT_DETAILS']//ul/li//text()[contains(.,'Tamaño de hoja abierta')]", 'nodeValue');
        console.log("********************* " , shippingDimension);
        if(shippingDimension!=null){
        var shippingDimenArray =shippingDimension.split(':');        
        addElementToDocument('added_shipingDimension', shippingDimenArray[1]);
        }


        const availabilityStatus = getXpath("//form[@id='addToCartForm']//button/text()[contains(.,'Agregar al Carrito')]", 'nodeValue');
        console.log(availabilityStatus + "availabilityStatus")
        var availabilityStatusValue;
        if (availabilityStatus != null) {        
            availabilityStatusValue = 'In stock';
        } else {
          availabilityStatusValue = 'Out of Stock';
        }
        addElementToDocument('added_availabilityText', availabilityStatusValue);
        
        const zoomImageFeature = getXpath("//div[@class='zoomImg']/../img[@class='lazyOwl']//@src",'nodeValue')
        console.log(zoomImageFeature + "zoomImageFeature")
        var zoomImageFeatureValue;
        if (zoomImageFeature != null) {
        
          zoomImageFeatureValue = 'Yes';
      
        } else {
          zoomImageFeatureValue = 'No';
        }
        addElementToDocument('added_zoomImageFeaturePresent', zoomImageFeatureValue);
  
      let scrollTop = 500;
        while (true) {
          window.scroll(0, scrollTop);
          await stall(1000);
          scrollTop += 500;
          if (scrollTop === 10000) {
            break;
          }
        }
      });
      await context.extract(productDetails,  { transform: transformParam });
    },
  };
