
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
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

      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      //sec image
      var img = getAllXpath('(//ul[@class="product_miniature_cms float jcarousel-list jcarousel-list-vertical"]/li/a/div[@class="hd_miniature hd_miniature_border"])[position()>1]/@style', 'nodeValue');
      if(img != null){
        for(var i=0; i<img.length; i++){
          var alt = img[i].slice(95,-3)
          alt = alt.replace("wid=66","wid=450");
          alt = alt.replace("hei=66","hei=450")
          addElementToDocument('alt', alt);
        }
      }

      //variants
      var vari = getAllXpath('//div[@class="product-selector--attribute"]/a/div/div[@class="product-selector--valueDisplay"]/text()', 'nodeValue');
      if( vari != null){
        for(var i=0; i<vari.length; i++){
          vari[i] = vari[i].trim();
        }
        var variants = vari.join(" | ");
        addElementToDocument('variants', variants);
      }

      //spec
      var data = getAllXpath('//p[contains(text(),"PRODUKTDETAILS")]/following::div[@class="slider_info slider clear float divDescriptionProduct"]/div/div/p/span/text()', 'nodeValue');
      var spec = "";
      if(data != null){
        for(var i=0; i<data.length; i=i+2){
          spec = spec + data[i] + " " + data[i+1] + " || "
        }
        spec = spec.slice(0,-3);
        addElementToDocument('spec', spec);
      }


    });
    await context.extract(productDetails);
  },
};

