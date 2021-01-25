
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

      /*//Ingredient List
      var ingre = getAllXpath('', 'nodeValue');
      var ing = ingre.toString()
      addElementToDocument('ing', ing);*/

     /* //Directions
      var directions = getAllXpath('//div[@id="tab_tips"]/p','nodeValue');
      var direction = getAllXpath('//div[@id="tab_tips"]/ul/li/text()','nodeValue');
      var abc1 = direction.join(' || ').replaceAll('•','');
      if (directions != null && direction == null) {
        var abc1 = directions;
        addElementToDocument('abc1', abc1);
      }
      else if (direction != null && directions == null) {
        var abc1 = direction.join(' || ').replaceAll('•','');
        addElementToDocument('abc1', abc1);
      }
      else if (desc != null && desc1 != null) {
        var abc2 = directions;
        var abc3 = direction.join(' || ').replaceAll('•','');
        var abc1 = abc2 + ' || ' + abc3;
        addElementToDocument('abc1', abc1);
      }*/
      
    /*  //directions
      var direct = getAllXpath('(//div[@id="tab_tips"])/descendant::text()', 'nodeValue');
      var arr = ""
      for(var i = 0;i<direct.length;i++)
      {
        arr =+direct[i];
      }
      var dir = arr.toString().replace("\n\n","").replaceAll("\n","||")
      addElementToDocument('dir', dir);*/

      // Direction
  const getDirection = (d) => {
  var arr = "";
  for (var i = 0; i < d.length; i++) {
  arr += d[i];
  }
  var rmP = arr.replace('Print', '');
  var spec = rmP.trim().replaceAll('\n', '||');
  var spe = spec.trim().replaceAll('-', '');
  var specs = spe.trim().replaceAll('•', '');
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



      // First Variant color,ml
      var firstVar;
      var fVarBySize = getAllXpath('(//div[contains(@class,"product-variation-size__inner product-variation-size--change")]/text())[1]', 'nodeValue');
      var fVarByColor = getAllXpath('(//div[contains(@class,"product-variation-shade__item")]/a/@title)[1]', 'nodeValue');
      if (fVarBySize.length > 0) {
        // fVarBySize = fVarBySize[0].trim();
        firstVar = fVarBySize;
        addElementToDocument('fvar', firstVar);
      } else if (fVarByColor.length > 0) {
        firstVar = fVarByColor;
        addElementToDocument('fvar', firstVar);
      }
      // Code for variant piping {ml , gm , color}
      var varBy;
      var variantBySize = getAllXpath('(//div[contains(@class,"product-variation-size__inner product-variation-size--change")]/text())', 'nodeValue');
      var variantByColor = getAllXpath('(//div[contains(@class,"product-variation-shade__item")]/a/@title)', 'nodeValue');
      if (variantBySize.length > 0) {
        varBy = variantBySize.join(' | ');
        addElementToDocument('varBy', varBy);
      } else if (variantByColor.length > 0) {
        varBy = variantByColor.join(' | ');
        addElementToDocument('varBy', varBy);
      }
      // Variant Count
      var varCount;
      var variantBySizeCount = getAllXpath('(//div[contains(@class,"product-variation-size__inner product-variation-size--change")]/text())', 'nodeValue');
      var variantByColorCount = getAllXpath('(//div[contains(@class,"product-variation-shade__item")]/a/@title)', 'nodeValue');
      if (variantBySizeCount.length > 0) {
        varCount = variantBySizeCount.length;
        addElementToDocument('varCount', varCount);
      } else if (variantByColorCount.length > 0) {
        varCount = variantByColorCount.length;
        addElementToDocument('varCount', varCount);
      } else {
        varCount = variantByColorCount.length;
        addElementToDocument('varCount', varCount);
      }

      //Description
      var desc = getAllXpath('//div[@id="tab_details"]/div/ul/li/text()', 'nodeValue');
      var desc1 = getAllXpath('//div[@id="tab_details"]/div/p/text()', 'nodeValue');
      if (desc != null && desc1 == null) {
        var xy1 = desc.join(' || ').replaceAll('•','');
        addElementToDocument('xyz', xyz);
      }
      else if (desc1 != null && desc == null) {
        var xyz = desc1.join(' || ').replaceAll('•','');
        addElementToDocument('xyz', xyz);
      }
      else if (desc != null && desc1 != null) {
        var xyz1 = desc.join(' || ').replaceAll('•','');
        var xyz2 = desc1.join(' || ').replaceAll('•','');
        var xyz = xyz2 + ' || ' + xyz1;
        addElementToDocument('xyz', xyz);
      }


      // Method to Retrieve Xpath content of a Multiple Nodes
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      /*var description = getXpath('//div[@class="js-target"]/a/text()', 'nodeValue');
      var description1 = getXpath("(//div[@class='b-pdp-carousel-item']/picture/img/@alt)[1]", 'nodeValue');
      description = description + ' ' + description1;
      addElementToDocument('description', description);*/
      
      /*//Availability
      var aval = getXpath('//div[@class="availability wrapper-in_stock "]/p[2]/span/text()', 'nodeValue');
      if (aval != null) {
        aval = 'In stock';
        addElementToDocument('aval', aval);
      } else {
        aval = 'Out Of Stock'
        addElementToDocument('aval', aval);
      }*/

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
      
      
      var str = getXpath('(//div[@class="product_detail pdp__detail small-12 medium-6 large-5 columns"]//span[@class="bv-rating_value "]/@style)[1]', 'nodeValue');
      if (str != null) {
        // for (var i = 0; i < str.length; i++) {
        var abc = str.split(':')[1];
        abc = abc.slice(0, -1);
        abc = (abc) / 20;
        addElementToDocument('agg', abc);
        // }
      }
    });
    await context.extract(productDetails);
  },
};