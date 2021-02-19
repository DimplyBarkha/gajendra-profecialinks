
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'iceland',
    transform: null,
    domain: 'iceland.co.uk',
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
      var avl = getXpath('//button[@class="button details-delivery-add-to-cart"]/text()', 'nodeValue');
      if (avl != null) {
        avl = "In Stock"
        addElementToDocument('avl', avl);
      } else {
        avl = "Out Of Stock"
        addElementToDocument('avl', avl);
      }
      var abc = getAllXpath('//div[@class="product-header d-none d-md-block clearfix"]//div[@class="pdp-review-summary"]//div[@class="rating"]/div/child::*/@class', 'nodeValue');
      if (abc.length >= 1) {
        abc.pop();
        var cnt = 0;
        for (var j = 0; j < 5; j++) {
          if (abc[j].includes("fill")) {
            cnt = cnt + 1;
          }
          else if (abc[j].includes("half")) {
            cnt = cnt + 0.5;
          } else {
            cnt = cnt + 0;
          }
        }
        addElementToDocument('agg', cnt);
      }

      //calaries

      var calaries = getAllXpath('//td[contains(text(), "Energy")]/following::td[1]/text()', 'nodeValue');
      if (calaries.length >= 1) {
        if (calaries.length >= 2) {
          var cal = calaries[0] + "/" + calaries[1];
          addElementToDocument('cal', cal);
        } else {
          var cal1 = calaries[0];
          addElementToDocument('cal', cal1);

        }
        var uom = "g";
        addElementToDocument('uom', uom);
      }
      
      //manufacturer name

      var manufact = getXpath('//*[@id="reviews-tab-content"]/div[2]/div/div[1]/p[4]/text()', 'nodeValue');
      if(manufact != null){
        if(manufact.includes(",")){
            manufact=manufact.split(",")[0];
        }
        addElementToDocument('manufact', manufact);
    }

    //price_per_unit

    var data = getXpath('//div[@class="product-pricing-info"]/text()', 'nodeValue');
    if(data != null){
      if(data.includes(" ")){
      var arr = data.split(" ");
      if(arr.length >= 2){
      var priceuom = arr[arr.length-2] + " "+ arr[arr.length-1];
      addElementToDocument('priceuom', priceuom);
      }
      }
      }

      //mpc
      var mpc = getXpath('//script[@type="application/ld+json"][3]/text()', 'nodeValue');
      if(mpc.includes("mpn")){
        var mp = mpc.split('mpn": "')[1];
        mp = mp.split('"')[0];
        addElementToDocument('mp', mp);
        }

    });
    await context.extract(productDetails);
  },
};
