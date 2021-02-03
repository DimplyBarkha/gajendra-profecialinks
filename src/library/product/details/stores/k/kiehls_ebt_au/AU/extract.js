
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'kiehls_ebt_au',
    transform: null,
    domain: 'kiehls.com.au',
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
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      //name
      var pn = getAllXpath('(//div/h1[@class="product_name"]/span[1])/text()', 'nodeValue');
      var pq = getAllXpath('//div[@class="hidden-mobile b-product_name"]/h2/text()', 'nodeValue');
      if (pn != null && pq != null) {
        var ab = pn + ' | ' + pq;
        addElementToDocument('ab', ab);
      }

      //nameExtended
      var x = getAllXpath('(//div/h1[@class="product_name"]/span[1])/text()', 'nodeValue');
      var y = getAllXpath('//div[@id="product_content"]/div[1]/ul[1]/li[1]/div/ul/li[@class="selected"]/a/@title ', 'nodeValue');
      if (x != null && y != null) {
        var xy = x + ' | ' + y;
        addElementToDocument('xy', xy);
      }

      //variants
      var var1 = getAllXpath('//div/ul/li/a/@data-variantid','nodeValue');
      var var2 = var1.join(' | ');
      addElementToDocument('var2', var2);

      //alternate image
      var img1 = getAllXpath('//div/ul[@class="carousel_navigation_items"]/li[position()>1 and position() <= last()]/span/img/@src','nodeValue');
      var img = img1.join(' | ');
      addElementToDocument('img',img);

      //quantity
      var qty = getAllXpath('//div[@id="product_content"]/div[1]/ul[2]/li[1]/div/ul/li/a/span/text()','nodeValue');
      var qty1 = getAllXpath('//div[@id="product_content"]/div[1]/ul[1]/li[1]/div/ul/li[1]/a/span/text()','nodeValue');
      if(qty!=null)
      {
        var qty2 = qty.toString();
        addElementToDocument('qty2',qty2);
      }
      else if(qty1!=null)
      {
        var qty2 = qty1.toString();
        addElementToDocument('qty2',qty2);
      }

        //IngredientList
      const getIngredients = (ingre) => {
      var arr = "";
      for (var i = 0; i < ingre.length; i++) {
      arr += ingre[i];
      }
      var rmP = arr.replace('Print', '');
      var spec = rmP.trim().replaceAll('\n', '||');
      var spe = spec.trim().replaceAll('-', '');
      var specs = spe.trim().replaceAll('•'||'●', '');
      addElementToDocument('ing', ing);
      }
      var ingre = getAllXpath('//div[@class="ingredient"]/descendant::text()', 'nodeValue');
      var ingred = getAllXpath('//div[contains(@id,"ing-copy")]/descendant::text()', 'nodeValue');
      if(ingre==null||ingre.toString() == " ")
      getIngredients(ingred);
      else
      getIngredients(ingre);

          // Direction
      const getDirection = (d) => {
      var arr = "";
      for (var i = 0; i < d.length; i++) {
      arr += d[i];
      }
      var rmP = arr.replace('Print', '');
      var spec = rmP.trim().replaceAll('\n', '||');
      var spe = spec.trim().replaceAll('-', '');
      var specs = spe.trim().replaceAll('•'||'●', '');
      addElementToDocument('specs', specs);
      }
      var direction = getAllXpath('(//div[@id="tab_tips"])/descendant::text()', 'nodeValue');
      getDirection(direction);

    //Product Description
    const getDescription = (d) => {
    var arr = "";
    for (var i = 0; i < d.length; i++) {
    arr += d[i];
    }
    var rmP = arr.replace('Print', '');
    var descr = rmP.trim().replaceAll('\n', '||');
    var des = descr.trim().replaceAll('-', '');
    var descrip = des.trim().replaceAll('•', '');
    addElementToDocument('descrip', descrip);
    }
    var description = getAllXpath('//div[@id="tab_details"]/descendant::text()', 'nodeValue');
    getDescription(description);

      // Method to Retrieve Xpath content of a Multiple Nodes
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      var aval = getXpath('//div[contains(@class,"availability")]/p[2]/span/text()', 'nodeValue');
      if (aval != null) {
        if (aval.includes('Out of stock')) {
            aval = 'Out Of Stock';
            addElementToDocument('aval', aval);
          } else if (aval.includes('In Stock')) 
          {
            aval = 'In Stock';
            addElementToDocument('aval', aval);
          }
      }
    });
    await context.extract(productDetails);
  },
};