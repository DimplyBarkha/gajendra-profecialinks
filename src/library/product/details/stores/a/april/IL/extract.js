const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IL',
    store: 'april',
    transform: transform,
    domain: 'april.co.il',
    zipcode: '',
  },


implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
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
      console.log("I am node set" , nodeSet.snapshotLength);
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
    };


    // const category = getXpath("//div[@id='mytab_1']//ul//li[1]", 'innerText');
    // console.log("My category in before if @@@@@@@@@@@@@@@@  ", category);
    //    if(category && typeof category == 'string') {
    //     console.log("My category", category);
    //     // console.log("My category", category.substring(29,34));
    //     // addElementToDocument('category', (category.substring(29,34)) );
    //   }

  const expectedSKU = getXpath("//meta[@property='og:url']/@content", 'nodeValue')
       if(expectedSKU && typeof expectedSKU == 'string') {
        console.log("My expectedSKU", expectedSKU);
        console.log("My expectedSKU", expectedSKU.substring(29,34));
        addElementToDocument('sku', (expectedSKU.substring(29,34)) );
      }

   const variants = getAllXpath("//div[@class='colors']//button[@class='color_img']/@id", 'nodeValue').join("|");
   if(variants && typeof variants == 'string') {
    console.log("my variant info" , variants);
    
    addElementToDocument('variants', variants);
   }
   var strVariant = variants.split('|');
    if(strVariant.length>1) {
      const category = getXpath("//div[@id='mytab_1']//ul//li[3]", 'innerText');
      addElementToDocument('category', category);
      console.log("My category in before if @@@@@@@@@@@@@@@@  ", category);
      addElementToDocument('variantcount', strVariant.length);
    } else {
      const category = getXpath("//div[@id='mytab_1']//ul//li[1]", 'innerText');
      addElementToDocument('category', category);
      addElementToDocument('variantcount', '1');
    }


    // addElementToDocument('variantscount', variants.length);
   

   const variantId = getAllXpath("//div[@class='colors']//button[@class='color_img']/@id", 'nodeValue').join("|");
   if(variantId.length > 1) {
    console.log("my variant info variantId " , variantId.split('|'));
    var str = variantId.split('|');
    addElementToDocument('variantId', str[0]);
   } else {
    const variantIdForSingle = getAllXpath("//div[@class='imgProduct']//img/@id", 'nodeValue');
    console.log("my variant info variantId single " , variantIdForSingle);
    addElementToDocument('variantId', variantIdForSingle);
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

    });
    await context.extract(productDetails);
  },
};

