
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'coopvitality',
    transform: null,
    domain: 'coopvitality.ch',
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
      // @ts-ignore
      const brand = window.dlObjects[0].ecommerce.detail.products[0].brand;
      addElementToDocument('brand', brand);

      // @ts-ignore
      const category = window.dlObjects[0].ecommerce.detail.products[0].category;
      var z = category.split("/");
      var len = z.length;
      for (let i=0 ; i<len; i++){
        addElementToDocument('category', z[i]);
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

      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      var name = getXpath('//span[@data-ui-id="page-title-wrapper"]/text()', 'nodeValue');
      if (name != null){
        var abc = name.split(" ");
        var zz = abc.slice(Math.max(abc.length - 2, 1))
        zz = zz.join(" ")
        addElementToDocument('zz', zz);
      }


// description
      var dec = getAllXpath('//div[@class="product attribute description"]/div/div/text()', 'nodeValue');
      var res = "";
      if ( dec != null){
         res = dec.join(" ");
         addElementToDocument('res', res);
      }

      var dec1 = getAllXpath('//div[@class="prescriptionProductInfo"]/p/text()', 'nodeValue');
      if( dec1 != null){
        res = dec1.join(" ");
        addElementToDocument('res', res);
      }

      var dec2 = getXpath('//p[@class="MsoNormal"]/span/text()', 'nodeValue');
      if( dec2 != null){
        res = dec2;
        addElementToDocument('res', res);
      }

      var dec3 = getXpath('//p[@class="MsoNormal"]/text()', 'nodeValue');
      if ( dec3 != null){
        res = dec3;
        addElementToDocument('res', res);
      }
      
      var rat = getXpath('//div[@class="redirect-to-review-details rating-summary reviews-actions"]/a/div/@title', 'nodeValue');
      var rating = 1;
      if(rat != null){
        if( rat.includes("%") ){
          rating = rat.slice(0,-1);
          rating = (rating*5)/100;
          addElementToDocument('rating', rating);
        }
      }

      var ppu = 0;
      addElementToDocument('ppu', ppu);


      var sec = getAllXpath('//div[@class="fotorama__nav__frame fotorama__nav__frame--thumb"]/div/img/@src', 'nodeValue');
      if( sec != null){
        addElementToDocument('sec', sec);
      }

      

    });
    await context.extract(productDetails);
  },
};
