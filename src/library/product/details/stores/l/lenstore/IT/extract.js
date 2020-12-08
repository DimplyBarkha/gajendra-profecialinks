
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'lenstore',
    transform: null,
    domain: 'lenstore.it',
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

      //availability
      var script = getXpath('//form[@class="js-add-to-basket-form"]/following::script[2]/text()', 'nodeValue');
      
      if(script != null){
        var data = JSON.parse(script);
        var gtin = data.gtin13;
        if(gtin != null){
          addElementToDocument('gtin', gtin);
        }
      }

      if(script != null){
        var data1 = JSON.parse(script);
        var rpc = data.productID;
        if(rpc != null){
          addElementToDocument('rpc', rpc);
        }
      }
      
      
      // if(script != null){
      //   var zz =  script.split('availability": "')[1];
      //   zz = zz.split(",")[0];
      //   var arr = zz.split("/");
      //   zz = arr[arr.length-1];
      //   if(zz.includes("In")){
      //     zz = "In Stock"
      //   }else{
      //     zz = "Out of Stock"
      //   }
      //   if(zz != null){
      //     addElementToDocument('zz', zz);
      //   }
      // }

      //gtin
      // if(script != null){
      //   var gt = script.split('gtin13": "')[1];
      //   gt = gt.split(",")[0];
      //   gt = gt.slice(0,-1);
      //   if(gt != null){
      //     addElementToDocument('gt', gt);
      //   }
      // }

      // //rpc
      // if(script != null){
      //   var rpc = script.split('productID": "')[1];
      //   rpc = rpc.split(",")[0];
      //   rpc = rpc.slice(0,-1);
      //   if(rpc != null){
      //     addElementToDocument('rpc', rpc);
      //   }
      // }

      //description
      // var ab = document.querySelectorAll('#relatedShift');
      var desc = getAllXpath('//div[@class="c-product__related-content"]/p/text()', 'nodeValue');
      if(desc != null){
        var str = "";
        for(var i=0; i< desc.length; i++){
          str = str + desc[i] + " ";
        }
        addElementToDocument('str', str);
      }
      




    });
    await context.extract(productDetails);
  },
};