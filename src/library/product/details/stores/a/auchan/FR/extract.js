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
      var el = document.querySelector('div.journey-reminder-header span');
      console.log('window.product', window.product);
      if (window.product)
        return undefined;
      else if (el && el.innerText === "Aubagne-En-Provence")
        return undefined;
      else
        return document.URL;
    });
    console.log('mainUrl', mainUrl)
    if (mainUrl) {
      await context.goto('https://www.auchan.fr/magasins/drive/aubagne-en-provence/s-684734ad-027c-3eff-0e83-4f44aec5e0b8#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_all_resources":true}[/!opt!]', {
        timeout: 10000000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
      await context.waitForSelector('button.journeyChoicePlace')
      await context.click('button.journeyChoicePlace')
      await context.stop();
      await context.goto(mainUrl, { timeout: 1000000, waitUntil: 'networkidle0', checkBlocked: true });
    }
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
          try {
            var description = "";
            console.log('nilesh');
            var dINode = document.evaluate("//main[contains(@class, 'product-aside--container')]//text()", document, null, XPathResult.ANY_TYPE);
            console.log('dINode', dINode);
            do {
              var descriptionData = dINode.iterateNext();

              if (descriptionData) {
                description += descriptionData.data + ' ';
              }

            } while (descriptionData)
            description = description.trim().split('\n')[0];
            addHiddenDiv('custom-product-description', description);
          } catch (err) {
            console.log('nilesh', err)
          }

          try {
            var enhancedContent = "";
            var dINode = document.evaluate("//div[contains(@class, 'flix-Text-block') and not(contains(@class, 'inpage_selector_specification'))]//div//text()", document, null, XPathResult.ANY_TYPE);
            do {
              var directionData = dINode.iterateNext();

              if (directionData)
                enhancedContent += directionData.data + ' ';
            } while (directionData)
            var dINode = document.evaluate("//div[contains(@class, 'flix-std-featureslist')]", document, null, XPathResult.ANY_TYPE);
            do {
              var directionData = dINode.iterateNext();
              console.log(directionData)
              if (directionData)
                enhancedContent += directionData.innerText + ' ';
            } while (directionData)

            var dINode = document.evaluate("//div[contains(@class, 'inpage_selector_InTheBox')]//div//text()", document, null, XPathResult.ANY_TYPE);
            do {
              var directionData = dINode.iterateNext();

              if (directionData)
                enhancedContent += directionData.data + ' ';
            } while (directionData)
            console.log('enhancedContent', enhancedContent)
            addHiddenDiv('custom-product-enhanced-content', enhancedContent);
          } catch (err) { }

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
                addHiddenDiv('custom-product-id', "Ref:" + arr[0]);
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
                  if (topIndex === 0) {
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

            var filteredValue = nutriData.filter((item) => { return item.key.indexOf('Vitamine A') > -1 });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-vitaminAPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-vitaminAPerServingUom', 'µg');
            }

            var filteredValue = nutriData.filter((item) => { return item.key.indexOf('Vitamine C (en mg)') > -1 });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-vitaminCPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-vitaminCPerServingUom', 'mg');
            }

            var filteredValue = nutriData.filter((item) => { return item.key.indexOf('Calcium (en mg)') > -1 });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-calciumPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-calciumPerServingUom', 'mg');
            }

            var filteredValue = nutriData.filter((item) => { return item.key.indexOf('Fer (en mg)') > -1 });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-ironPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-ironPerServingUom', 'mg');
            }

            var filteredValue = nutriData.filter((item) => { return item.key.indexOf('Magnésium (en mg)') > -1 });
            if (filteredValue && filteredValue.length) {
              addHiddenDiv('custom-product-magnesiumPerServing', filteredValue[0].value);
              addHiddenDiv('custom-product-magnesiumPerServingUom', 'mg');
            }

          } catch (err) { }
          try {
            const btnImageZoom = document.querySelector('button.product-gallery__img-btn');
            console.log('btnImageZoom', btnImageZoom)
            if (btnImageZoom) {
              btnImageZoom.click();
              await new Promise((resolve, reject) => setTimeout(resolve, 2000));
              var nodeImage = document.evaluate("//div[contains(@class, 'product-zoom__item')]//img", document, null, XPathResult.ANY_TYPE);
              data = nodeImage.iterateNext();
              if (data) {
                addHiddenDiv('custom-product-main-image', data.src);
              }
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
