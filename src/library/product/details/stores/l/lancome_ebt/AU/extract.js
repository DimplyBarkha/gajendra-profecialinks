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


      // Product Name 
      var pn = getAllXpath('(//div[@class="product_detail pdp__detail small-12 medium-6 large-5 columns"]//span[@class="product_name"])/text()', 'nodeValue');
      var pq = getAllXpath('((//div[contains(@class,"product_detail pdp__detail")][2])/div[1]/*[(self::h2)])/text()', 'nodeValue');
      var qty = getAllXpath('(//span[@id="quantitySelectBoxItText"]/text())[2]', 'nodeValue');
      var ab;
      // First Variant  color,ml
      var firstVar;
      var fVarBySize = getAllXpath('(//div[contains(@class,"product-variation-size__inner product-variation-size--change")]/text())[1]', 'nodeValue');
      var fVarByColor = getAllXpath('(//div[contains(@class,"product-variation-shade__item")]/a/@title)[1]', 'nodeValue');

      if (fVarBySize.length > 0) {
        // fVarBySize = fVarBySize[0].trim();
        firstVar = fVarBySize;
        ab = pn + ' | ' + firstVar;
        addElementToDocument('ab', ab);
        addElementToDocument('fvar', firstVar);
      } else if (fVarByColor.length > 0) {
        firstVar = fVarByColor;
        ab = pn + ' | ' + firstVar;
        addElementToDocument('ab', ab);
        addElementToDocument('fvar', firstVar);
      }else{
        ab = pn + ' | ' + qty;
        addElementToDocument('ab', ab);
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

      // Ingredient List
      // function getIngredientList(ingredient) {
      //   var ingList1 = ingredient.toString();
      //   var ingList = "";
      //   if (ingList1.match('•') != null) {
      //     ingList = ingList1.replaceAll('•', ' || ');
      //   } else if (ingList1.match('●') != null) {
      //     ingList = ingList1.replaceAll('●', ' || ');
      //   } else if (ingList1.match(',') != null) {
      //     ingList = ingList1.replaceAll(',', ' || ');
      //   }
      //   addElementToDocument('ingList', ingList);
      // }
      
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
      // var ingredientListP = getAllXpath('//div[@id="tab_ingredients"]//p/text()[2]', 'nodeValue');
      // if (ingredientList.length > 1) {
      //   getIngredientList(ingredientList);
      // } else if (ingredientListP.length > 0) {
      //   getIngredientList(ingredientListP);
      // }
      getIngredientList(ingredientList);

      // Product Description 
      // const getDescription = (desc) => {
      //   var specs = desc.join(' || ');
      //   addElementToDocument('specs', specs);
      // }
      // var descriptionP = getAllXpath('//div[@id="tab_description"]//p/text()', 'nodeValue');
      // var description = getAllXpath('(//div[@id="tab_description"])//text()', 'nodeValue');
      // if (descriptionP.length > 1) {
      //   getDescription(descriptionP);
      // } else if (description.length > 1) {
      //   var descrip = "";
      //   for (var i = 0; i < description.length; i++) {
      //     descrip += description[i];
      //   }
      //   var specs1 = descrip.replace('Print','');
      //   var specs = specs1.trim().replaceAll('\n',' || ');
      //   addElementToDocument('specs', specs);
      // }
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

      // Method to Retrieve Xpath content of a Multiple Nodes

      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      var aval = getXpath('//span[@class="b-availability-label-message js-availability-label-message"]/text()[1]', 'nodeValue');
      if (aval != null) {
        if (aval.includes('Dieser Artikel ist online leider nicht mehr verfügbar.')) {
          aval = 'Out of stock';
          addElementToDocument('aval', aval);
        } else {
          aval = 'In stock';
          addElementToDocument('aval', aval);
        }
      } else {
        aval = 'In stock';
        addElementToDocument('aval', aval);
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
