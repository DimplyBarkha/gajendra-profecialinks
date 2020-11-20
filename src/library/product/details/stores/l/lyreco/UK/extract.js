
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
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

  // specification
      var pp = getAllXpath('(//section[@id="specification"]/div[@class="info_description float clear"]/div/div/div/p/span)/text()', 'nodeValue');
      var final = ""
      if(pp != null){
        for(let i=0; i<pp.length; i=i+2){
          var temp = pp[i]+pp[i+1]+" || ";
          final = final+temp;
        }
        final = final.slice(0,-4);
        addElementToDocument('final', final);
      }
  // bullets with pipe
      var ll = getAllXpath('//div[@class="l-submain-h g-html"]/ul/li/p/text()', 'nodeValue');
      if(ll != null){
        var bullets = ll.join(" || ");
        addElementToDocument('bullets', bullets);
      }
      
  // variant information
  var vinfo = getAllXpath('//div[@class="product-selector--attribute"]/a//div[@class="product-selector--valueDisplay"]/text()', 'nodeValue');
  if(vinfo != null){
    var varinfo = vinfo.join(" || ");
    addElementToDocument('varinfo', varinfo);
  }

  //alternate image
  var altimg = getAllXpath('//ul[@class="product_miniature_cms float jcarousel-list jcarousel-list-vertical"]/li[position()>1]/a/div/@style', 'nodeValue');
  var alt = []
  if(altimg != null){
    for(let i=0; i < altimg.length; i++){
      var j = altimg[i].slice(95, -3);
      j = j.replace("wid=66","wid=300");
      j = j.replace("hei=66","wid=300");
      alt.push(j);
    }
    addElementToDocument('alt', alt);
  }

    });
    await context.extract(productDetails);
  },
};
