
const { transform } = require('../../colesonline/AU/shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    function findXpathArr (xpath) {
      const element = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
      let node = element.iterateNext();
      const value = [];
      while (node) {
        value.push(node.textContent);
        node = element.iterateNext();
      }
      return value;
    }
    function findXpath (xpath) {
      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const productDetails = element && element.textContent ? element.textContent : '';
      return productDetails;
    }
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    function energyCalculation (value, name, name2) {
      const arr = value.match(/([\d]+(?:.[\d]+)?)(?:\s*)([a-zA-Z]*)\s{0,1}/);
      arr && arr[1] && name && addHiddenDiv('ii_' + name, arr[1]);
      arr && arr[2] && name2 && addHiddenDiv('ii_' + name2, arr[2]);
    }
    const totalFatPerServing = findXpath("//tr[contains(. , 'Total Fat')]//td");
    energyCalculation(totalFatPerServing, 'totalFatPerServing', 'totalFatPerServingUom');
    const saturatedFatPerServing = findXpath("//tr[contains(. , 'Saturated Fat')]//td");
    energyCalculation(saturatedFatPerServing, 'saturatedFatPerServing', 'saturatedFatPerServingUom');
    const sodiumPerServing = findXpath("//tr[contains(. , 'Sodium')]//td");
    energyCalculation(sodiumPerServing, 'sodiumPerServing', 'sodiumPerServingUom');
    const totalCarbPerServing = findXpath("//tr[contains(. , 'Carbohydrate')]//td");
    energyCalculation(totalCarbPerServing, 'totalCarbPerServing', 'totalCarbPerServingUom');
    const totalSugarsPerServing = findXpath("//tr[contains(. , 'Sugar')]//td");
    energyCalculation(totalSugarsPerServing, 'totalSugarsPerServing', 'totalSugarsPerServingUom');
    const proteinPerServing = findXpath("//tr[contains(. , 'Protein')]//td");
    energyCalculation(proteinPerServing, 'proteinPerServing', 'proteinPerServingUom');
    const dietaryFibrePerServing = findXpath("//tr[contains(. , 'Dietary Fibre Total')]//td");
    energyCalculation(dietaryFibrePerServing, 'dietaryFibrePerServing', 'dietaryFibrePerServingUom');
    const transFatPerServing = findXpath("//tr[contains(. , 'Trans')]//td");
    energyCalculation(transFatPerServing, 'transFatPerServing', 'transFatPerServingUom');
    const vitaminAPerServing = findXpath("//tr[contains(. , 'Vitamin A')]//td");
    energyCalculation(vitaminAPerServing, 'vitaminAPerServing', 'vitaminAPerServingUom');
    const vitaminCPerServing = findXpath("//tr[contains(. , 'Vitamin C')]//td");
    energyCalculation(vitaminCPerServing, 'vitaminCPerServing', 'vitaminCPerServingUom');
    const calciumPerServing = findXpath("//tr[contains(. , 'Calcium')]//td");
    energyCalculation(calciumPerServing, 'calciumPerServing', 'calciumPerServingUom');
    const ironPerServing = findXpath("//tr[contains(. , 'Iron')]//td");
    energyCalculation(ironPerServing, 'ironPerServing', 'ironPerServingUom');
    const magnesiumPerServing = findXpath("//tr[contains(. , 'Magnesium')]//td");
    energyCalculation(magnesiumPerServing, 'magnesiumPerServing', 'magnesiumPerServingUom');
    const script = findXpath("//script[contains(@type,'application/ld+json')]") && JSON.parse(findXpath("//script[contains(@type,'application/ld+json')]")) ? JSON.parse(findXpath("//script[contains(@type,'application/ld+json')]")) : '';
    if (script) {
      const avail = script.offers && script.offers.availability ? script.offers.availability : '';
      avail.includes('InStock') && addHiddenDiv('ii_avail', 'In Stock');
      !avail.includes('InStock') && addHiddenDiv('ii_avail', 'Out of stock');
      const sku = script.sku ? script.sku : '';
      addHiddenDiv('ii_sku', sku);
      const variantId = findXpath("//li[contains(.,'Code:')]//span[contains(@class,'accessibility')]");
      addHiddenDiv('ii_variantId', variantId.replace(/ /gm, ''));
      const additionalProperty = script.additionalProperty ? script.additionalProperty : '';
      additionalProperty.forEach(element => {
        element.name === 'Warning' && element.text && addHiddenDiv('ii_warning', element.text);
        element.name === 'Warning' && element.value && addHiddenDiv('ii_warning', element.value);
      });
    }
    let servingSize = findXpath("//*[@class='nutritional-table-intro']");
    servingSize = servingSize.split('=')[1] ? servingSize.split('=')[1] : servingSize;
    addHiddenDiv('ii_servingSize', servingSize);
    energyCalculation(servingSize, null, 'servingSizeUom');
    let name = findXpathArr("//h1[@class='product-title']//span[@class='product-brand'] | //h1[@class='product-title']//span[@class='product-name']");
    // @ts-ignore
    name = name.join(' ');
    addHiddenDiv('ii_name', name);
    let specifications = findXpath("//div[contains(@class,'product-specific')]");
    specifications = specifications.replace(/\n|\t|\s{2,}/gm, ' ').trim().indexOf('Details') === 0 ? specifications.replace(/Details/, '') : specifications;
    addHiddenDiv('ii_specifications', specifications);
    const direction = findXpathArr("//h3[contains(@class,'product-specific-heading') and contains(.,'Usage Instructions:')]//following-sibling::span[contains(@data-ng-bind-html,'product')] | //div[contains(@data-ng-repeat,'product.getPreparation')]/*[not(self::h3)]");
    addHiddenDiv('ii_direction', direction.join(' '));
    let pricePerUnit = findXpath("//div[contains(@class,'product-information')]//span[contains(@class,'package-price')]");
    const val = pricePerUnit.split('per');
    let pricePerUnitUom = '';
    if (val[1] && val[1].match(/([\d]+)/)) {
      pricePerUnit = val[0].trim() + ' per ' + val[1].match(/([\d]{1,})/)[0].trim();
      pricePerUnitUom = val[1].replace(/.*(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1');
    }
    let ii_desc = document.querySelector('div.long-desc-container') && document.querySelector('div.long-desc-container').innerText;
    addHiddenDiv('ii_desc', ii_desc);
    addHiddenDiv('ii_pricePerUnit', pricePerUnit);
    addHiddenDiv('ii_pricePerUnitUom', pricePerUnitUom);
  });
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'colesonline_burwoodEast',
    transform,
    domain: 'shop.coles.com.au',
    zipcode: '',
  },
  implementation,
};
