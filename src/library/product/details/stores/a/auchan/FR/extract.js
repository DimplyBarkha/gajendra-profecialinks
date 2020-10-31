const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'auchan',
    transform: transform,
    domain: 'auchan.fr',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productDetails: data }) => {
    const { transform } = parameters;
    const mainUrl = await context.evaluate(async function () {
      return document.URL;
    });
    const needToReload = await context.evaluate(async function () {
      function getCookie(c_name) {
        if (document.cookie.length > 0) {
          var c_start = document.cookie.indexOf(c_name + "=");
          if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
              c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
          }
        }
        return "";
      }
      function createCookie(name, value, days) {
        if (days) {
          var date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          var expires = "; expires=" + date.toGMTString();
        } else {
          var expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
      }
      if (getCookie('lark-journey') === "7731184e-ecf8-49a4-a64a-3777e7f30a7f") {
        return false;
      } else {
        createCookie('lark-journey', "7731184e-ecf8-49a4-a64a-3777e7f30a7f", 100000)
      }
      return true;
    })
    console.log('needToReload', needToReload);
    if (needToReload)
      await context.goto(mainUrl, { timeout: 1000000, waitUntil: 'load', checkBlocked: true });
    await context.evaluate(async function () {
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      try {
        if (window.product) {
          addHiddenDiv('custom-product-info-availablityText', window.product.stock.stockLevelStatus.code);
          addHiddenDiv('custom-product-ean', window.product.ean);
          var weight = '';
          var node = document.evaluate("(//div[contains(@class,'product-aside--textBlock')]//ul[contains(@class, 'product-aside--list')]//li[contains(translate(string(), 'POIDS', 'poids'), 'poids')]//div//span)[position()=1]", document, null, XPathResult.ANY_TYPE);
          data = node.iterateNext();
          if (data) {
            weight = data.innerText;
          } else {
            var node = document.evaluate("//td[contains(translate(string(), 'POIDS', 'poids'), 'poids')]/following-sibling::td", document, null, XPathResult.ANY_TYPE);
            data = node.iterateNext();
            if (data) {
              weight = data.innerText;
            }
          }
          addHiddenDiv('custom-product-info-weight', weight)
        } else {
          try {
            const isNull = document.querySelector('div.product-unavailable__message') == null;
            addHiddenDiv('custom-product-info-availablityText', !isNull ? 'Out Of Stock' : 'In Stock');
          } catch (e1) { }
          try {
            var node = document.evaluate("(//div[@class ='product-description__feature-group-wrapper']//span//following-sibling::*)[last()]", document, null, XPathResult.ANY_TYPE);
            var data = node.iterateNext();
            if (data) {
              var arr = data.innerText.split('/');
              if (arr.length) {
                addHiddenDiv('custom-product-ean', arr[1]);
                addHiddenDiv('custom-product-id', arr[0]);
              }
            }
          } catch (err) { }
          try {
            var dINode = document.evaluate("(//h5[contains(@class, 'product-description__feature-title') and contains(text(),'Informations pratiques')]//following-sibling::*)", document, null, XPathResult.ANY_TYPE);
            var direction = "";
            do {
              var directionData = dINode.iterateNext();
              if (directionData)
                direction += directionData.innerText + ' ';
            } while (directionData)
            addHiddenDiv('custom-product-direction', direction);
          }
          catch (err) { }
          try {
            var dINode = document.evaluate("//div[contains(@class,'nutritional__table')]//div[contains(@class,'nutritional__column')]", document, null, XPathResult.ANY_TYPE);

            var nutriData = [];
            var topIndex = 0;
            do {
              var nutData = dINode.iterateNext();
              if (nutData) {
                const arr = nutData.getElementsByClassName('nutritional__cell');
                var index = 0;
                for (var item of arr) {
                  if (topIndex ===0) {
                    nutriData.push({ key: item.innerText, value: '' });
                  } else if (topIndex === 1) {
                    nutriData[index].value = item.innerText;
                    index++;
                  }
                }
              }
              topIndex++;
            } while (nutData)

            var filteredValue = nutriData.filter((item) => { return item.key === "Valeurs Energétiques en Kj" });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-caloriesPerServing', filteredValue[0].value);
            }

            var filteredValue = nutriData.filter((item) => { return item.key === "Matières grasses (en g)" });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-totalFatPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-totalFatPerServingUom', 'g');
            }

            var filteredValue = nutriData.filter((item) => { return item.key === "dont acides gras saturés (en g)" });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-saturatedFatPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-saturatedFatPerServingUom', 'g');
            }

            var filteredValue = nutriData.filter((item) => { return item.key === "Glucides (en g)" });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-totalCarbPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-totalCarbPerServingUom', 'g');
            }

            var filteredValue = nutriData.filter((item) => { return item.key === "Fibres alimentaires (en g)" });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-dietaryFibrePerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-dietaryFibrePerServingUom', 'g');
            }

            var filteredValue = nutriData.filter((item) => { return item.key === "dont sucres (en g)" });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-totalSugarsPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-totalSugarsPerServingUom', 'g');
            }

            var filteredValue = nutriData.filter((item) => { return item.key === "Protéines (en g)" });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-proteinPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-proteinPerServingUom', 'g');
            }

            var filteredValue = nutriData.filter((item) => { return item.key === "Sel (en g)" });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-saltPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-saltPerServingUom', 'g');
            }
          } catch (err) { }
        }
      } catch (error) {
        console.log('Error: ', error);
      }
    })
    return await context.extract(data, { transform });
  }
};
