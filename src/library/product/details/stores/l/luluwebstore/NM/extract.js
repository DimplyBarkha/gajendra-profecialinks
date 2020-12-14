
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NM',
    store: 'luluwebstore',
    transform: null,
    domain: 'luluhypermarket.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
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
      }
      var alternateImages = getAllXpath("//ul[@class='hide-bullets']//li[position()>1]/span[@class='thumbnail']/img/@src", 'nodeValue');
      if (alternateImages != null) {
        for(var i=0; i<alternateImages.length;i++){
          if(alternateImages[i].includes('http')){

          }else{
            alternateImages[i]="https://www.luluhypermarket.com"+alternateImages[i];
          }
        }
        addElementToDocument('alternateImages', alternateImages);
      }
      // for (let k = 0; k < alternateImages.length; k++) {
      //   addElementToDocument('alternateImages', alternateImages,);
      // }
    });
    await context.extract(productDetails);
     },
    };