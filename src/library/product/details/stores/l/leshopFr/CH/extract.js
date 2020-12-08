
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'leshopFr',
    transform: null,
    domain: 'leshop.ch',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.waitForFunction(function () {
      return Boolean(document.querySelector('aside[class="product-detail-image"]>div>div') || document.evaluate('//aside[@class="product-detail-image"]/div/div', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 90000 });
    await context.evaluate(async () => {
      // @ts-ignore
      const productID = document.querySelector('dd[class="pid"]').innerText;
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      // Method to Retrieve Xpath content of a Single Node
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      // @ts-ignore
      const image = document.querySelectorAll('aside[class="product-detail-image"]>div>div')[0].style.backgroundImage;
      addHiddenDiv('image', image.split('"')[1]);
      try {
        const priceID = productID + "-current-price";
        // @ts-ignore
        addHiddenDiv('price', document.querySelector('span[id="' + priceID + '"]').innerText);
      } catch (error) {
      }
      try {
        const quantity = productID + "-weight";
        let checkSplit;
        // @ts-ignore
        const rawquantity = document.querySelector('span[id="' + quantity + '"]').innerText;
        checkSplit = rawquantity.split('x');
        if (checkSplit.length == 1) {
          addHiddenDiv('quantity', rawquantity.split('x')[0]);
        }
        else {
          addHiddenDiv('quantity', rawquantity.split('x')[1]);
          addHiddenDiv('packSize', rawquantity.split('x')[0]);
        }
        addHiddenDiv('variantId', productID);
        addHiddenDiv('image', image.split('"')[1]);
      } catch (error) {

      }
      try {
        const directions = "product-detail-" + productID + "-usage";
        // @ts-ignore
        addHiddenDiv('directions', document.querySelector('dd[id="' + directions + '"]').innerText);
      } catch (error) {

      }
      try {
        const ingredientsList = "product-detail-" + productID + "-ingredients";
        // @ts-ignore
        addHiddenDiv('ingredientsList', document.querySelector('dd[id="' + ingredientsList + '"]').innerText);
      } catch (error) {

      }
      try {
        const servingSize = "product-detail-" + productID + "-nutrients";
        var rawservingSize;
        rawservingSize = getXpath("//dd[@id='" + servingSize + "']/table/thead/tr/th[2]/text()", 'nodeValue');
        if (rawservingSize != null) {
          addHiddenDiv('servingSize', rawservingSize);
          addHiddenDiv('rawservingSizeUom', rawservingSize.replace(/[0-9]/g, ""));
        }
        else {
          // @ts-ignore
          rawservingSize = document.querySelector('dd[id="' + servingSize + '"]').innerText;
          var finalservingSize = rawservingSize.split(':')[0];
          if (finalservingSize.length < 15) {
            try {
              finalservingSize = finalservingSize.replace('enhalten', '');
            } catch (error) {
            }
            try {
              finalservingSize = finalservingSize.replace('contain', '');
            } catch (error) {
            }
            addHiddenDiv('servingSize', finalservingSize);
            addHiddenDiv('rawservingSizeUom', finalservingSize.replace(/[0-9]/g, ""));
          }
        }

      } catch (error) {

      }
      try {
        const servingSizeUom = "product-detail-" + productID + "-nutrients";
        // @ts-ignore
        var rawservingSizeUom = document.querySelector('dd[id="' + servingSizeUom + '"]>table>thead>tr>th[class="mat-header-cell cdk-header-cell cdk-column-STANDARD mat-column-STANDARD ng-star-inserted"]').innerText;
        rawservingSizeUom = rawservingSizeUom.replace(/[0-9]/g, "")
        addHiddenDiv('rawservingSizeUom', rawservingSizeUom);
      } catch (error) {

      }

      try {
        const caloriesPerServing = "product-detail-" + productID + "-nutrients";
        // @ts-ignore
        var rawcaloriesPerServing = document.querySelector('dd[id="' + caloriesPerServing + '"]').innerText;
        if (rawcaloriesPerServing.includes('Energiewert')) {
          rawcaloriesPerServing = rawcaloriesPerServing.substring(rawcaloriesPerServing.indexOf('Energiewert ') + 12, rawcaloriesPerServing.indexOf(','));
          addHiddenDiv('rawcaloriesPerServing', rawcaloriesPerServing);
        }
        else {
          const rawcaloriesPerServing = getXpath("//dd[@id='" + caloriesPerServing + "']/table/tbody/tr/td[contains(text(),'Energie')]/following-sibling::td/text()", 'nodeValue');
          addHiddenDiv('rawcaloriesPerServing', rawcaloriesPerServing);
        }
      } catch (error) {

      }
      try {
        const totalFatPerServing = "product-detail-" + productID + "-nutrients";
        var rawtotalFatPerServing, rawtotalFatPerServingMeasure;
        var rawtotalFatPerServing = getXpath("//dd[@id='" + totalFatPerServing + "']/table/tbody/tr/td[contains(text(),'Fett')]/following-sibling::td/text()", 'nodeValue');

        if (rawtotalFatPerServing != null) {
          addHiddenDiv('rawtotalFatPerServing', rawtotalFatPerServing);
          rawtotalFatPerServingMeasure = rawtotalFatPerServing.replace(/[^\w\s]/gi, '');
          rawtotalFatPerServingMeasure = rawtotalFatPerServingMeasure.replace(/[0-9]/g, '');
          addHiddenDiv('rawtotalFatPerServingMeasure', rawtotalFatPerServingMeasure);
        }
        else {
          try {
            // @ts-ignore
            rawtotalFatPerServing = document.querySelector('dd[id="' + totalFatPerServing + '"]').innerText;
            if (rawtotalFatPerServing.indexOf('Fett ') != -1) {
              rawtotalFatPerServing = rawtotalFatPerServing.slice(rawtotalFatPerServing.indexOf('Fett '));
              rawtotalFatPerServing = rawtotalFatPerServing.substring(4, rawtotalFatPerServing.indexOf(','));
              addHiddenDiv('rawtotalFatPerServing', rawtotalFatPerServing);
              rawtotalFatPerServingMeasure = rawtotalFatPerServing.replace(/[^\w\s]/gi, '');
              rawtotalFatPerServingMeasure = rawtotalFatPerServingMeasure.replace(/[0-9]/g, '');
              addHiddenDiv('rawtotalFatPerServingMeasure', rawtotalFatPerServingMeasure);
            }
          } catch (error) {

          }
        }
      } catch (error) {

      }

      try {
        var rawsaturatedFatPerServingMeasure;
        const saturatedFatPerServing = "product-detail-" + productID + "-nutrients";
        var rawsaturatedFatPerServing = getXpath("//dd[@id='" + saturatedFatPerServing + "']/table/tbody/tr/td[contains(text(),'davon gesättigte Fettsäure')]/following-sibling::td/text()", 'nodeValue');
        addHiddenDiv('rawsaturatedFatPerServing', rawsaturatedFatPerServing);
        rawsaturatedFatPerServingMeasure = rawsaturatedFatPerServing.replace(/[^\w\s]/gi, '');
        rawsaturatedFatPerServingMeasure = rawsaturatedFatPerServingMeasure.replace(/[0-9]/g, '');
        addHiddenDiv('rawsaturatedFatPerServingMeasure', rawsaturatedFatPerServingMeasure);
      } catch (error) {

      }

      try {
        const sodiumPerServing = "product-detail-" + productID + "-nutrients";
        var rawsodiumPerServing, rawsodiumPerServingMeasure;
        var rawsodiumPerServing = getXpath("//dd[@id='" + sodiumPerServing + "']/table/tbody/tr/td[contains(text(),'Sodium')]/following-sibling::td/text()", 'nodeValue');

        if (rawsodiumPerServing != null) {
          addHiddenDiv('rawsodiumPerServing', rawsodiumPerServing);
          rawsodiumPerServingMeasure = rawsodiumPerServing.replace(/[^\w\s]/gi, '');
          rawsodiumPerServingMeasure = rawsodiumPerServingMeasure.replace(/[0-9]/g, '');
          addHiddenDiv('rawsodiumPerServingMeasure', rawsodiumPerServingMeasure);
        }
        else {
          try {
            // @ts-ignore
            rawsodiumPerServing = document.querySelector('dd[id="' + sodiumPerServing + '"]').innerText;
            if (rawsodiumPerServing.indexOf('Natrium') != -1) {
              rawsodiumPerServing = rawsodiumPerServing.slice(rawsodiumPerServing.indexOf('Natrium'));
              rawsodiumPerServing = rawsodiumPerServing.substring(rawsodiumPerServing.indexOf(':'), rawsodiumPerServing.indexOf(','));
              addHiddenDiv('rawsodiumPerServing', rawsodiumPerServing);
              rawsodiumPerServingMeasure = rawsodiumPerServing.replace(/[^\w\s]/gi, '');
              rawsodiumPerServingMeasure = rawsodiumPerServingMeasure.replace(/[0-9]/g, '');
              addHiddenDiv('rawsodiumPerServingMeasure', rawsodiumPerServingMeasure);
            }
          } catch (error) {

          }
        }
      } catch (error) {

      }

      try {
        const totalCarbPerServing = "product-detail-" + productID + "-nutrients";
        var rawtotalCarbPerServing, rawtotalCarbPerServingMeasure;
        var rawtotalCarbPerServing = getXpath("//dd[@id='" + totalCarbPerServing + "']/table/tbody/tr/td[contains(text(),'Kohlenhydrate')]/following-sibling::td/text()", 'nodeValue');

        if (rawtotalCarbPerServing != null) {
          addHiddenDiv('rawtotalCarbPerServing', rawtotalCarbPerServing);
          rawtotalCarbPerServingMeasure = rawtotalCarbPerServing.replace(/[^\w\s]/gi, '');
          rawtotalCarbPerServingMeasure = rawtotalCarbPerServingMeasure.replace(/[0-9]/g, '');
          addHiddenDiv('rawtotalCarbPerServingMeasure', rawtotalCarbPerServingMeasure);
        }
        else {
          try {
            // @ts-ignore
            rawtotalCarbPerServing = document.querySelector('dd[id="' + totalCarbPerServing + '"]').innerText;
            if (rawtotalCarbPerServing.indexOf('Kohlenhydrate ') != -1) {
              rawtotalCarbPerServing = rawtotalCarbPerServing.slice(rawtotalCarbPerServing.indexOf('Kohlenhydrate '));
              rawtotalCarbPerServing = rawtotalCarbPerServing.substring(rawtotalCarbPerServing.indexOf(' '), rawtotalCarbPerServing.indexOf(','));
              addHiddenDiv('rawtotalCarbPerServing', rawtotalCarbPerServing);
              rawtotalCarbPerServingMeasure = rawtotalCarbPerServing.replace(/[^\w\s]/gi, '');
              rawtotalCarbPerServingMeasure = rawtotalCarbPerServingMeasure.replace(/[0-9]/g, '');
              addHiddenDiv('rawtotalCarbPerServingMeasure', rawtotalCarbPerServingMeasure);
            }
          } catch (error) {

          }
        }
      } catch (error) {

      }

      try {
        const dietaryFibrePerServing = "product-detail-" + productID + "-nutrients";
        var rawdietaryFibrePerServing, rawdietaryFibrePerServingMeasure;
        var rawdietaryFibrePerServing = getXpath("//dd[@id='" + dietaryFibrePerServing + "']/table/tbody/tr/td[contains(text(),'Ballaststoffe')]/following-sibling::td/text()", 'nodeValue');
        if (rawdietaryFibrePerServing == null) {
          rawdietaryFibrePerServing = getXpath("//dd[@id='" + dietaryFibrePerServing + "']/table/tbody/tr/td[contains(text(),'Dietary')]/following-sibling::td/text()", 'nodeValue');
        }
        if (rawdietaryFibrePerServing != null) {
          addHiddenDiv('rawdietaryFibrePerServing', rawdietaryFibrePerServing);
          rawdietaryFibrePerServingMeasure = rawdietaryFibrePerServing.replace(/[^\w\s]/gi, '');
          rawdietaryFibrePerServingMeasure = rawdietaryFibrePerServingMeasure.replace(/[0-9]/g, '');
          addHiddenDiv('rawdietaryFibrePerServingMeasure', rawdietaryFibrePerServingMeasure);
        }
        else {
          try {
            // @ts-ignore
            rawdietaryFibrePerServing = document.querySelector('dd[id="' + dietaryFibrePerServing + '"]').innerText;
            if (rawdietaryFibrePerServing.indexOf('Ballaststoffe') != -1) {
              rawdietaryFibrePerServing = rawdietaryFibrePerServing.slice(rawdietaryFibrePerServing.indexOf('Ballaststoffe'));
              rawdietaryFibrePerServing = rawdietaryFibrePerServing.substring(rawdietaryFibrePerServing.indexOf(' '), rawdietaryFibrePerServing.indexOf(','));
              addHiddenDiv('rawdietaryFibrePerServing', rawdietaryFibrePerServing);
              rawdietaryFibrePerServingMeasure = rawdietaryFibrePerServing.replace(/[^\w\s]/gi, '');
              rawdietaryFibrePerServingMeasure = rawdietaryFibrePerServingMeasure.replace(/[0-9]/g, '');
              addHiddenDiv('rawdietaryFibrePerServingMeasure', rawdietaryFibrePerServingMeasure);
            }
          } catch (error) {

          }
        }
      } catch (error) {

      }
      try {
        const proteinPerServing = "product-detail-" + productID + "-nutrients";
        var rawproteinPerServing = getXpath("//dd[@id='" + proteinPerServing + "']/table/tbody/tr/td[contains(text(),'Protein')]/following-sibling::td/text()", 'nodeValue');
        addHiddenDiv('rawproteinPerServing', rawproteinPerServing);
        rawproteinPerServingMeasure = rawproteinPerServing.replace(/[^\w\s]/gi, '');
        rawproteinPerServingMeasure = rawproteinPerServingMeasure.replace(/[0-9]/g, '');
        addHiddenDiv('rawproteinPerServingMeasure', rawproteinPerServingMeasure);
      } catch (error) {

      }
      try {
        const totalSugarsPerServing = "product-detail-" + productID + "-nutrients";
        var rawtotalSugarsPerServing, rawtotalSugarsPerServingMeasure;
        var rawtotalSugarsPerServing = getXpath("//dd[@id='" + totalSugarsPerServing + "']/table/tbody/tr/td[contains(text(),'davon Zucker')]/following-sibling::td/text()", 'nodeValue');
        if (rawtotalSugarsPerServing == null) {
          var rawtotalSugarsPerServing = getXpath("//dd[@id='" + totalSugarsPerServing + "']/table/tbody/tr/td[contains(text(),'sugar')]/following-sibling::td/text()", 'nodeValue');
        }
        if (rawtotalSugarsPerServing != null) {
          addHiddenDiv('rawtotalSugarsPerServing', rawtotalSugarsPerServing);
          rawtotalSugarsPerServingMeasure = rawtotalSugarsPerServing.replace(/[^\w\s]/gi, '');
          rawtotalSugarsPerServingMeasure = rawtotalSugarsPerServingMeasure.replace(/[0-9]/g, '');
          addHiddenDiv('rawtotalSugarsPerServingMeasure', rawtotalSugarsPerServingMeasure);
        }
        else {
          try {
            // @ts-ignore
            rawtotalSugarsPerServing = document.querySelector('dd[id="' + totalSugarsPerServing + '"]').innerText;
            if (rawtotalSugarsPerServing.indexOf('davon Zucker') != -1) {
              rawtotalSugarsPerServing = rawtotalSugarsPerServing.slice(rawtotalSugarsPerServing.indexOf('davon Zucker'));
              rawtotalSugarsPerServing = rawtotalSugarsPerServing.substring(rawtotalSugarsPerServing.indexOf('<'), rawtotalSugarsPerServing.indexOf(','));
              addHiddenDiv('rawtotalSugarsPerServing', rawtotalSugarsPerServing);
              rawtotalSugarsPerServingMeasure = rawtotalSugarsPerServing.replace(/[^\w\s]/gi, '');
              rawtotalSugarsPerServingMeasure = rawtotalSugarsPerServingMeasure.replace(/[0-9]/g, '');
              addHiddenDiv('rawtotalSugarsPerServingMeasure', rawtotalSugarsPerServingMeasure);
            }
          } catch (error) {

          }
        }
      } catch (error) {

      }
      try {
        const proteinPerServing = "product-detail-" + productID + "-nutrients";
        var rawproteinPerServing, rawproteinPerServingMeasure;
        var rawproteinPerServing = getXpath("//dd[@id='" + proteinPerServing + "']/table/tbody/tr/td[contains(text(),'Eiweiss')]/following-sibling::td/text()", 'nodeValue');

        if (rawproteinPerServing != null) {
          addHiddenDiv('rawproteinPerServing', rawproteinPerServing);
          rawproteinPerServingMeasure = rawproteinPerServing.replace(/[^\w\s]/gi, '');
          rawproteinPerServingMeasure = rawproteinPerServingMeasure.replace(/[0-9]/g, '');
          addHiddenDiv('rawproteinPerServingMeasure', rawproteinPerServingMeasure);
        }
        else {
          try {
            // @ts-ignore
            rawproteinPerServing = document.querySelector('dd[id="' + proteinPerServing + '"]').innerText;
            if (rawproteinPerServing.indexOf('Eiweiss') != -1) {
              rawproteinPerServing = rawproteinPerServing.slice(rawproteinPerServing.indexOf('Eiweiss'));
              rawproteinPerServing = rawproteinPerServing.substring(rawproteinPerServing.indexOf(' '), rawproteinPerServing.indexOf(','));
              addHiddenDiv('rawproteinPerServing', rawproteinPerServing);
              rawproteinPerServingMeasure = rawproteinPerServing.replace(/[^\w\s]/gi, '');
              rawproteinPerServingMeasure = rawproteinPerServingMeasure.replace(/[0-9]/g, '');
              addHiddenDiv('rawproteinPerServingMeasure', rawproteinPerServingMeasure);
            }
          } catch (error) {

          }
        }
      } catch (error) {

      }
      try {
        const vitaminAPerServing = "product-detail-" + productID + "-nutrients";
        var rawvitaminAPerServing, rawvitaminAPerServingMeasure;
        var rawvitaminAPerServing = getXpath("//dd[@id='" + vitaminAPerServing + "']/table/tbody/tr/td[contains(text(),'Vitamin A')]/following-sibling::td/text()", 'nodeValue');

        if (rawvitaminAPerServing != null) {
          addHiddenDiv('rawvitaminAPerServing', rawvitaminAPerServing);
          rawvitaminAPerServingMeasure = rawvitaminAPerServing.replace(/[0-9]/g, '');
          addHiddenDiv('rawvitaminAPerServingMeasure', rawvitaminAPerServingMeasure);
        }
        else {
          try {
            // @ts-ignore
            rawvitaminAPerServing = document.querySelector('dd[id="' + vitaminAPerServing + '"]').innerText;
            if (rawvitaminAPerServing.indexOf('Vit A') != -1) {
              rawvitaminAPerServing = rawvitaminAPerServing.slice(rawvitaminAPerServing.indexOf('Vit A'));
              rawvitaminAPerServing = rawvitaminAPerServing.substring(rawvitaminAPerServing.indexOf(':'), rawvitaminAPerServing.indexOf(';'));
              addHiddenDiv('rawvitaminAPerServing', rawvitaminAPerServing);
              rawvitaminAPerServingMeasure = rawvitaminAPerServing.replace(/[0-9]/g, '');
              rawvitaminAPerServingMeasure = rawvitaminAPerServingMeasure.replace(':', '');
              addHiddenDiv('rawvitaminAPerServingMeasure', rawvitaminAPerServingMeasure);
            }
          } catch (error) {

          }
        }
      } catch (error) {

      }
      try {
        const vitaminCPerServing = "product-detail-" + productID + "-nutrients";
        var rawvitaminCPerServing, rawvitaminCPerServingMeasure;
        var rawvitaminCPerServing = getXpath("//dd[@id='" + vitaminCPerServing + "']/table/tbody/tr/td[contains(text(),'Vitamin C')]/following-sibling::td/text()", 'nodeValue');

        if (rawvitaminCPerServing != null) {
          addHiddenDiv('rawvitaminCPerServing', rawvitaminCPerServing);
          rawvitaminCPerServingMeasure = rawvitaminCPerServing.replace(/[0-9]/g, '');
          addHiddenDiv('rawvitaminCPerServingMeasure', rawvitaminCPerServingMeasure);
        }
        else {
          try {
            // @ts-ignore
            rawvitaminCPerServing = document.querySelector('dd[id="' + vitaminCPerServing + '"]').innerText;
            if (rawvitaminCPerServing.indexOf('Vitamin C') != -1) {
              rawvitaminCPerServing = rawvitaminCPerServing.slice(rawvitaminCPerServing.indexOf('Vitamin C'));
              rawvitaminCPerServing = rawvitaminCPerServing.substring(rawvitaminCPerServing.indexOf(':'), rawvitaminCPerServing.indexOf(','));
              addHiddenDiv('rawvitaminCPerServing', rawvitaminCPerServing);
              rawvitaminCPerServingMeasure = rawvitaminCPerServing.replace(/[0-9]/g, '');
              addHiddenDiv('rawvitaminCPerServingMeasure', rawvitaminCPerServingMeasure);
            }
          } catch (error) {

          }
        }
      } catch (error) {

      }
      try {
        const calciumPerServing = "product-detail-" + productID + "-nutrients";
        var rawcalciumPerServing, rawcalciumPerServingMeasure;
        var rawcalciumPerServing = getXpath("//dd[@id='" + calciumPerServing + "']/table/tbody/tr/td[contains(text(),'Calcium')]/following-sibling::td/text()", 'nodeValue');

        if (rawcalciumPerServing != null) {

          addHiddenDiv('rawcalciumPerServing', rawcalciumPerServing);
          rawcalciumPerServingMeasure = rawcalciumPerServing.replace(/[0-9]/g, '');
          addHiddenDiv('rawcalciumPerServingMeasure', rawcalciumPerServingMeasure);
        }
        else {
          try {
            // @ts-ignore
            rawcalciumPerServing = document.querySelector('dd[id="' + calciumPerServing + '"]').innerText;
            if (rawcalciumPerServing.indexOf('Calcium') != -1) {
              rawcalciumPerServing = rawcalciumPerServing.slice(rawcalciumPerServing.indexOf('Calcium'));
              rawcalciumPerServing = rawcalciumPerServing.substring(rawcalciumPerServing.indexOf(':'), rawcalciumPerServing.indexOf(';'));
              rawcalciumPerServing = rawcalciumPerServing.replace(',', '.');
              addHiddenDiv('rawcalciumPerServing', rawcalciumPerServing);
            }
          } catch (error) {

          }
        }
      } catch (error) {

      }
      try {
        const ironPerServing = "product-detail-" + productID + "-nutrients";
        var rawironPerServing, rawironPerServingMeasure;
        var rawironPerServing = getXpath("//dd[@id='" + ironPerServing + "']/table/tbody/tr/td[contains(text(),'Eisen')]/following-sibling::td/text()", 'nodeValue');

        if (rawironPerServing != null) {
          addHiddenDiv('rawironPerServing', rawironPerServing);
          rawironPerServingMeasure = rawironPerServing.replace(/[^\w\s]/gi, '');
          rawironPerServingMeasure = rawironPerServingMeasure.replace(/[0-9]/g, '');
          addHiddenDiv('rawironPerServingMeasure', rawironPerServingMeasure);
        }
        else {
          try {
            // @ts-ignore
            rawironPerServing = document.querySelector('dd[id="' + ironPerServing + '"]').innerText;
            if (rawironPerServing.indexOf('Eisen') != -1) {
              rawironPerServing = rawironPerServing.slice(rawironPerServing.indexOf('Eisen'));
              rawironPerServing = rawironPerServing.substring(rawironPerServing.indexOf(':'), rawironPerServing.indexOf(','));
              addHiddenDiv('rawironPerServing', rawironPerServing);
              rawironPerServingMeasure = rawironPerServing.replace(/[^\w\s]/gi, '');
              rawironPerServingMeasure = rawironPerServingMeasure.replace(/[0-9]/g, '');
              addHiddenDiv('rawironPerServingMeasure', rawironPerServingMeasure);
            }
          } catch (error) {

          }
        }
      } catch (error) {

      }
      try {
        const magnesiumPerServing = "product-detail-" + productID + "-nutrients";
        var rawmagnesiumPerServing, rawmagnesiumPerServingMeasure;
        var rawmagnesiumPerServing = getXpath("//dd[@id='" + magnesiumPerServing + "']/table/tbody/tr/td[contains(text(),'Magnesium')]/following-sibling::td/text()", 'nodeValue');

        if (rawmagnesiumPerServing != null) {
          addHiddenDiv('rawmagnesiumPerServing', rawmagnesiumPerServing);
          rawmagnesiumPerServingMeasure = rawmagnesiumPerServing.replace(/[^\w\s]/gi, '');
          rawmagnesiumPerServingMeasure = rawmagnesiumPerServingMeasure.replace(/[0-9]/g, '');
          addHiddenDiv('rawmagnesiumPerServingMeasure', rawmagnesiumPerServingMeasure);
        }
        else {
          try {
            // @ts-ignore
            rawmagnesiumPerServing = document.querySelector('dd[id="' + magnesiumPerServing + '"]').innerText;
            if (rawmagnesiumPerServing.indexOf('Magnesium') != -1) {
              rawmagnesiumPerServing = rawmagnesiumPerServing.slice(rawmagnesiumPerServing.indexOf('Magnesium') + 10);
              rawmagnesiumPerServing = rawmagnesiumPerServing.split(' ');
              addHiddenDiv('rawmagnesiumPerServing', rawmagnesiumPerServing[1]);
              rawmagnesiumPerServingMeasure = rawmagnesiumPerServing[1].replace(/[^\w\s]/gi, '');
              rawmagnesiumPerServingMeasure = rawmagnesiumPerServingMeasure.replace(/[0-9]/g, '');
              addHiddenDiv('rawmagnesiumPerServingMeasure', rawmagnesiumPerServingMeasure);
            }
          } catch (error) {

          }
        }
      } catch (error) {

      }
      try {
        const saltPerServing = "product-detail-" + productID + "-nutrients";
        var rawsaltPerServing, rawsaltPerServingMeasure;
        var rawsaltPerServing = getXpath("//dd[@id='" + saltPerServing + "']/table/tbody/tr/td[contains(text(),'Salz')]/following-sibling::td/text()", 'nodeValue');
        if (rawsaltPerServing == null) {
          var rawsaltPerServing = getXpath("//dd[@id='" + saltPerServing + "']/table/tbody/tr/td[contains(text(),'Salt')]/following-sibling::td/text()", 'nodeValue');
        }
        if (rawsaltPerServing != null) {
          addHiddenDiv('rawsaltPerServing', rawsaltPerServing);
          rawsaltPerServingMeasure = rawsaltPerServing.replace(/[^\w\s]/gi, '');
          rawsaltPerServingMeasure = rawsaltPerServingMeasure.replace(/[0-9]/g, '');
          addHiddenDiv('rawsaltPerServingMeasure', rawsaltPerServingMeasure);
        }
        else {
          try {
            // @ts-ignore
            rawsaltPerServing = document.querySelector('dd[id="' + saltPerServing + '"]').innerText;
            if (rawsaltPerServing.indexOf('Salz') != -1) {
              rawsaltPerServing = rawsaltPerServing.slice(rawsaltPerServing.indexOf('Salz'));
              rawsaltPerServing = rawsaltPerServing.split(' ');
              addHiddenDiv('rawsaltPerServing', rawsaltPerServing[1]);
              rawsaltPerServingMeasure = rawsaltPerServing[1].replace(/[^\w\s]/gi, '');
              rawsaltPerServingMeasure = rawsaltPerServingMeasure.replace(/[0-9]/g, '');
              addHiddenDiv('rawsaltPerServingMeasure', rawsaltPerServingMeasure);
            }
          } catch (error) {

          }
        }
      } catch (error) {

      }
      try {
        const storage = "product-detail-" + productID + "-conservation";
        // @ts-ignore
        const rawstorage = document.querySelector('dd[id="' + storage + '"]').innerText;
        addHiddenDiv('rawstorage', rawstorage);
      } catch (error) {

      }
      try {
        const pricePerUnit = productID + "-price-unit";
        // @ts-ignore
        const rawpricePerUnit = document.querySelector('span[id="' + pricePerUnit + '"]').innerText;
        addHiddenDiv('rawpricePerUnit', rawpricePerUnit);
        var rawpricePerUnitMeasure = rawpricePerUnit.replace(/[^\w\s]/gi, '');
        rawpricePerUnitMeasure = rawpricePerUnitMeasure.replace(/[0-9]/g, '');
        addHiddenDiv('rawpricePerUnitMeasure', rawpricePerUnitMeasure);
      } catch (error) {

      }
      try {
        const description = "product-detail-" + productID + "-benefits";
        // @ts-ignore
        const rawdescription = document.querySelector('dd[id="' + description + '"]').innerText;
        addHiddenDiv('rawdescription', rawdescription);
      } catch (error) {

      }
      try {
        const name = "product-detail-" + productID + "-description";
        // @ts-ignore
        const rawname = document.querySelector('h2[id="' + name + '"]').innerText;
        addHiddenDiv('rawname', rawname);
      } catch (error) {

      }
    });
    return await context.extract(productDetails, { transform });
  },
};
