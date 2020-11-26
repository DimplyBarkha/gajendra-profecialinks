
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'lyreco',
    transform: null,
    domain: 'lyreco.com',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(() => {
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
      };
      var dec = getAllXpath('//p[@itemprop="description"]/text()', 'nodeValue');
      if (dec != null) {
        var str = dec.join(" | ");
        addElementToDocument('str', str);
      }
      var sec = getAllXpath('//ul[@class="product_miniature_cms float jcarousel-list jcarousel-list-vertical"]/li[position()>1]/a/div/@style', 'nodeValue');
      if(sec!=null){
        for(var i=0; i<sec.length; i++){
          addElementToDocument('sec_img', sec[i].slice(95,-3));
        }
      }
    });
    await context.extract(productDetails);
  },
};

