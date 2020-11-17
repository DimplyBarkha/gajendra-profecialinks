const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'pacson',
    transform: cleanUp,
    domain: 'pacson.se',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      // Method to Retrieve Xpath content of a Multiple Nodes
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

      var price = getXpath('(//div[@class="product-detail__price-info"]/span[@class="price prio-30"])/text()', 'nodeValue');
      if (price != null){
        price = price.replace(",",".");
        addElementToDocument('price', price);
      }

      //mpc
      var mpc = getXpath("//div[contains(text(),'Artikelnummer')]/text()", 'nodeValue');
      if (mpc != null){
        mpc = mpc.split(": ")[1];
        addElementToDocument('mpc', mpc);
      }

      //description 
      var brand = getXpath("(//div[@class='product-detail__specification']/table/tbody/tr/th[1])[contains(text(),'Varumärke')]/following-sibling::th/text()", 'nodeValue');
      var desc = getXpath("//h1[@class='product-page__title']/span/text()", 'nodeValue');
      var desc2 = getXpath("(//h1[@class='product-page__title'])/text()[2]", 'nodeValue');
      if (desc2 != null){
        desc = desc + " " + desc2;
        if(brand != null) {
            desc = brand+"-"+desc;
        }
      }
      if(desc != null){
        addElementToDocument('desc', desc);
      }


      //description
      var description = getXpath('//div[@class="product-detail__description__80"]/text()', 'nodeValue');
      if ( description != null && description.length > 1){
        description = description.trim();
        addElementToDocument('description', description);
      }
      description = getXpath('//div[@class="product-detail__description__80"]/p/b/text()', 'nodeValue');
      if (description != null && description.length > 1){
        description = description.trim();
          addElementToDocument('description', description);
      }
      description = getXpath('//div[@class="product-detail__description__80"]/p/text()', 'nodeValue');
      if ( description != null && description.length > 1){
        description = description.trim();
        addElementToDocument('description', description);
      }

      // if ( description != null){
      //   if( description.length > 1){
      //     description = description.trim();
      //     addElementToDocument('description', description);
      //   } else {
      //     description = getXpath('//div[@class="product-detail__description__80"]/p/text()', 'nodeValue');
      //     if ( description != null){
      //       description = description.trim();
      //     addElementToDocument('description', description);
      //     }
      //   }
      // }

      //sec image total
      var res = getAllXpath('//ul[@class="carousel-thumbnails small-12 large-2 columns"]/li/img/@src', 'nodeValue');
      var cnt = res.length - 1;
      if(cnt > 0){
        addElementToDocument('cnt', cnt);
      }

      //alternate image
      var altimg = getAllXpath('//ul[@class="carousel-thumbnails small-12 large-2 columns"]/li/img/@src', 'nodeValue');
      if ( altimg != null){
        for (var i=1; i < altimg.length; i++){
          var ext = "https://pacson.se"
          altimg[i]= ext+altimg[i];
          addElementToDocument('altimg', altimg[i]);
        }
      }

      var availability = getXpath('//a[@class="button buy-button product-detail__buy-button disabled"]/text()', 'nodeValue');
      if (availability != null){
        availability = "In stock";
      } else {
        availability = "Out of stock";
      }
      addElementToDocument('availability', availability);

      var spec = getAllXpath('//div[@class="product-detail__specification"]/table/tbody/tr', 'nodeValue');
      var specification = "";

      var val1 = getAllXpath('//div[@class="product-detail__specification"]/table/tbody/tr[1]/th/text()', 'nodeValue');

      if( val1 != null){
        var val = val1.join(": ");
        specification = specification + val;
      }
      
      var val2;
      val2 = getAllXpath('//div[@class="product-detail__specification"]/table/tbody/tr[position()>1 and position()<= last()]/td/text()', 'nodeValue');
      var s = ""
      for ( let i =0 ; i< val2.length; i=i+2){
        s = s + " " +val2[i]+": "+val2[i+1]+" || ";
      }
      if(s!=null){
        specification = specification+" || "+s;
        specification = specification.slice(0,-3);
        addElementToDocument('specification', specification);
      }
      
    });
    await context.extract(productDetails);
  },
};