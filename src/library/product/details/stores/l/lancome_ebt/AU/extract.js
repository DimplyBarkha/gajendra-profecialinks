module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'lancome_ebt',
    transform: null,
    domain: 'lancome.com.au',
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

      // Method to Retrieve Xpath content of a Multiple Nodes

      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };


      // Product Name 
      var pname = getAllXpath('(//div[@class="product_detail pdp__detail small-12 medium-6 large-5 columns"]//span[@class="product_name"])/text()', 'nodeValue');
      var pn = [];
      for (var i = 0; i < pname.length; i++) {
        pn += pname[i];
      }
      var pq = getAllXpath('((//div[contains(@class,"product_detail pdp__detail")][2])/div[1]/*[(self::h2)])/text()', 'nodeValue');
      addElementToDocument('name', pn + ' | ' + pq);

      //Name extended
      var selectedBySize = getXpath('//div[contains(@class,"product-variation-size__item")]//div[contains(@class,"selected")]/text()', 'nodeValue');
      var selectedByColor = getXpath('//div[contains(@class,"selected")]//span[contains(@class,"swatch_text_color product-variation-shade__textcolor hidden")]/text()', 'nodeValue');
      var qty = getAllXpath('(//span[@id="quantitySelectBoxItText"]/text())[2]', 'nodeValue');
      var ab;
      // First Variant  color,ml
      var firstVar;
      var fVarBySize = getAllXpath('(//div[contains(@class,"product-variation-size__inner product-variation-size--change")]/text())[1]', 'nodeValue');
      var fVarByColor = getAllXpath('(//div[contains(@class,"product-variation-shade__item")]/a/@title)[1]', 'nodeValue');

      if (fVarBySize.length > 0) {
        // fVarBySize = fVarBySize[0].trim();
        firstVar = fVarBySize;
        ab = pn + ' | ' + selectedBySize;
        addElementToDocument('ab', ab);
        addElementToDocument('fvar', firstVar);
        addElementToDocument('varInfo', selectedBySize);
      } else if (fVarByColor.length > 0) {
        firstVar = fVarByColor;
        ab = pn + ' | ' + selectedByColor;
        addElementToDocument('ab', ab);
        addElementToDocument('fvar', firstVar);
        addElementToDocument('varInfo', selectedByColor);
      } else {
        ab = pn;
        addElementToDocument('ab', ab);
      }

      // Code for variants
      var varBy;
      var variantBySize = getAllXpath('(//div[contains(@class,"product-variation-size__inner product-variation-size--change")]/parent::div/@data-productid)', 'nodeValue');
      var variantByColor = getAllXpath('(//div[contains(@class,"product-variation-shade__item")]/a/@data-pid)', 'nodeValue');
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

      // Ingredient List
      const getIngredientList = (d) => {
        var arr = "";
        var ingList;
        for (var i = 0; i < d.length; i++) {
          arr += d[i];
        }
        var ingList1 = arr.replace('Print', '').trim();
        if (ingList1.match('●') != null) {
          ingList = ingList1.replaceAll('●', ' || ');
        } else if (ingList1.match('•') != null) {
          ingList = ingList1.replaceAll('•', ' || ');
        } else if (ingList1.match(',') != null) {
          ingList = ingList1.replaceAll(',', ' || ');
        } else {
          ingList = ingList1;
        }

        addElementToDocument('ingList', ingList);
      }
      var ingredientList = getAllXpath('//div[@id="tab_ingredients"]/descendant::text()[position()<last()]', 'nodeValue');
      getIngredientList(ingredientList);

      // Product Description 
      const getDescription = (d) => {
        var arr = "";
        for (var i = 0; i < d.length; i++) {
          arr += d[i];
        }
        var rmP = arr.replace('Print', '');
        var specs = rmP.trim().replaceAll('\n', '||');
        addElementToDocument('specs', specs);
      }
      var description = getAllXpath('(//div[@id="tab_description"])/descendant::text()', 'nodeValue');
      getDescription(description);

      // Directions 
      var directions = getAllXpath('(//div[@id="tab_productvideo"]//p)/text()', 'nodeValue');
      var dir = directions.toString().replace('\n', ' || ');
      addElementToDocument('dir', dir);

      // Product url generater
      var url = "";
      var urlBySize = getXpath('//div[contains(@class,"selected")]/parent::div[contains(@class,"product-variation-size__item")]/@value', 'nodeValue');
      var sizeVal = getXpath('//input[@id="product_selectedsize"]/@value', 'nodeValue');
      var urlByColor = getXpath('(//div[contains(@class,"selected")]//span[contains(@class,"swatch_text_color product-variation-shade__textcolor hidden")])/parent::a/@href', 'nodeValue');
      var colorVal = getXpath('(//div[contains(@class,"selected")]//span[contains(@class,"swatch_text_color product-variation-shade__textcolor hidden")])/parent::a/@data-id', 'nodeValue');
      if (urlBySize != null) {
        url = urlBySize + sizeVal;
        addElementToDocument('url', url);
      } else if (urlByColor != null) {
        url = urlByColor + colorVal;
        addElementToDocument('url', url);
      }

      var aval = getXpath('(//p[contains(@class,"availability_value")])//text()', 'nodeValue');
      if (aval != null) {
        if (aval.includes('Out of Stock')) {
          aval = 'Out Of Stock';
          addElementToDocument('aval', aval);
        } else if (aval.includes('In Stock')) {
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
