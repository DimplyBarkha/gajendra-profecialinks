const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ae',
    store: 'choithrams',
    transform: transform,
    domain: 'choithrams.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        // catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      const avaiableText = getXpath("(//p[@class='outofstock']/text())[1]", 'nodeValue');
      console.log('my availability', avaiableText);
      if (avaiableText === 'Out of stock') {
        addElementToDocument('availableText', 'Out of stock');
      } else addElementToDocument('availableText', 'In stock');

      // const idPath = getXpath("//div[@class='details']//script/text()", 'nodeValue');
      // if (idPath) {
      //   const idObj = JSON.stringify(idPath);
      //   var myIdArr = idObj.split(':');
      //   var myIdValue = myIdArr[2].match(/'(.*?)'/);
      //   addElementToDocument('variantId', myIdValue[1]);
      // }

      const brand = getXpath("//div[@class='details']//h1//text()", 'nodeValue');
      console.log('i am in my brand ', brand);
      if (brand) {
        // const idObj = JSON.stringify(idPath);
        var brandTextVar = brand + '';
        var brandText = brandTextVar.split(' ');
        addElementToDocument('name', brand);

        console.log('i am in my brand length', brand.length);

        addElementToDocument('quantity', brandText[brandText.length - 1]);

        addElementToDocument('brandText', brandText[0]);
      }

      const macros = getAllXpath("//div[@class='nutrition']//div[@class='macros']", 'innerText').join('|');
      var myMacrosArr = macros.split('\n');
      console.log('myIdArrmyIdArr', myMacrosArr.length);
      console.log('myIdArrmyIdArr', myMacrosArr);
      for (var i = 0; i <= myMacrosArr.length; i++) {
        if (myMacrosArr[i] === 'Carbs') {
          addElementToDocument('totalCarbPerServing', myMacrosArr[i + 1].replace(/[^\d.-]/g, ''));
          addElementToDocument('totalCarbPerServingUom', myMacrosArr[i + 1].replace(/[^A-Za-z]+/g, ''));
        }
        if (myMacrosArr[i] === 'Fat') {
          addElementToDocument('caloriesFromFatPerServing', myMacrosArr[i + 1].replace(/[^\d.-]/g, ''));
          addElementToDocument('totalFatPerServingUom', myMacrosArr[i + 1].replace(/[^A-Za-z]+/g, ''));
        }
        if (myMacrosArr[i] === 'Fiber') {
          addElementToDocument('dietaryFibrePerServing', myMacrosArr[i + 1].replace(/[^\d.-]/g, ''));
          addElementToDocument('dietaryFibrePerServingUom', myMacrosArr[i + 1].replace(/[^A-Za-z]+/g, ''));
        }
        if (myMacrosArr[i] === 'Protein') {
          addElementToDocument('proteinPerServing', myMacrosArr[i + 1].replace(/[^\d.-]/g, ''));
          addElementToDocument('proteinPerServingUom', myMacrosArr[i + 1].replace(/[^A-Za-z]+/g, ''));
        }
        if (myMacrosArr[i] === 'Salt') {
          addElementToDocument('saltPerServing', myMacrosArr[i + 1].replace(/[^\d.-]/g, ''));
          addElementToDocument('saltPerServingUom', myMacrosArr[i + 1].replace(/[^A-Za-z]+/g, ''));
        }
        if (myMacrosArr[i] === 'Saturates') {
          addElementToDocument('saturatedFatPerServing', myMacrosArr[i + 1].replace(/[^\d.-]/g, ''));
          addElementToDocument('saturatedFatPerServingUom', myMacrosArr[i + 1].replace(/[^A-Za-z]+/g, ''));
        }
        if (myMacrosArr[i] === 'Sugar') {
          addElementToDocument('totalSugarsPerServing', myMacrosArr[i + 1].replace(/[^\d.-]/g, ''));
          addElementToDocument('totalSugarsPerServingUom', myMacrosArr[i + 1].replace(/[^A-Za-z]+/g, ''));
        }
        if (myMacrosArr[i] === 'Kcal') {
          addElementToDocument('caloriesPerServing', myMacrosArr[i + 1]);
          // addElementToDocument('totalSugarsPerServingUom', myMacrosArr[i + 1] + myMacrosArr[i + 1]);
        }
      }

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }
    });
    await context.extract(productDetails);
  },
};
