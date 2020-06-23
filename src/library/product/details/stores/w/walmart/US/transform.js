/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const clean = text => text.toString().replace(/\r\n|\r|\n/gm, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
  // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/(<([^>]+)>)/ig, '');

  const regexp = '(?:([\\d\\.]+)\\s?(\\w+))';
  function getSplitValue (inputStr, count) {
    if (inputStr) {
      const result = inputStr.match(regexp);
      if (result && count <= result.length) { return result[count]; } else { return inputStr; }
    }
  }
  function getValue (name, obj) {
    if (obj.values && obj.values.length > 0) {
      for (let i = 0; i < obj.values.length; i++) {
        if (obj.values[i].mainNutrient && obj.values[i].mainNutrient.name && obj.values[i].mainNutrient.name.includes(name)) {
          return obj.values[i];
        }
      }
    }
  }

  for (const { group } of data) {
    for (const row of group) {
      try {
        if (row.variantId) {
          row.productUrl = [{ text: `https://www.walmart.com/ip/${row.variantId[0].text}` }];
        }

        if (row.lbb && row.lbb[0].text.includes('Yes') && row.price) {
          row.lbbPrice = [{ text: row.price[0].text.trim() }];
        }

        if (row.shippingInfo) {
          if (row.shippingInfo[0].text.includes('Walmart')) {
            row.lbb = [{ text: 'No' }];
          }
        }
        if (row.shippingInfo && (!row.otherSellersName || (row.otherSellersName && row.otherSellersName[0].text != 'Walmart' && !row.otherSellersName[0].text.includes(row.shippingInfo[0].text)))) {
          if (row.otherSellersName && row.otherSellersName.length > 0) {
            row.otherSellersName.unshift({ text: row.shippingInfo[0].text.trim() });
          } else {
            row.otherSellersName = [{ text: row.shippingInfo[0].text.trim() }];
          }
          if (row.price) {
            if (row.otherSellersPrice && row.otherSellersPrice.length > 0) {
              row.otherSellersPrice.unshift({ text: row.price[0].text.trim() });
            } else {
              row.otherSellersPrice = [{ text: row.price[0].text.trim() }];
            }
          }
          if (row.shippingPrice) {
            if (row.otherSellersShipping2 && row.otherSellersShipping2.length > 0) {
              row.otherSellersShipping2.unshift({ text: row.shippingPrice[0].text.trim() });
            } else {
              row.otherSellersShipping2 = [{ text: row.shippingPrice[0].text.trim() }];
            }
          }
          if (row.otherSellersShipping2) {
            row.otherSellersShipping2.forEach(item => {
              item.text = item.text.replace('0.00', '0').replace('0', '0.00');
            });
          }
        }
        if (row.availabilityText) {
          row.availabilityText = [{ text: row.availabilityText[0].text.replace('IN_STOCK', 'In Stock').replace('OUT_OF_STOCK', 'Out of stock') }];
        } else if (row.availabilityMessage) {
          row.availabilityText = [{ text: row.availabilityMessage[0].text }];
        }
        if (row.variantInformation) {
          let text = '';
          row.variantInformation.forEach(item => {
            const splits = item.text.replace(/\"/g, '').replace('}', '').split(':');
            text += `${splits[splits.length - 1].replace('actual_color-', '')} | `;
          });
          row.variantInformation = [
            {
              text: text.slice(0, -3),
            },
          ];
        }
        if (row.firstVariant) {
          row.firstVariant = [{ text: row.firstVariant[0].text.replace('"primaryProductId":"', '').replace('","primary', '') }];
        }
        if (row.directions) {
          row.directions = [{ text: row.directions[0].text.replace(/\"/g, '') }];
        }
        if (row.ingredientsList) {
          if(row.ingredientsList[0].includes("[{")) {
            let list = JSON.parse(row.ingredientsList[0].text);
            if(list && list.length > 0) {
              row.ingredientsList =[]
            list.foreach(item => row.ingredientsList.push(`${item.name}: ${item.value}`));
            }
          }
        }
        if (row.alternateImages) {
          row.alternateImages.forEach(item => {
            const obj = JSON.parse(item.text);
            item.text = obj.url;
          });
          row.image = [{ text: row.alternateImages[0].text }];
          row.alternateImages.shift();
        }
        if (row.category) {
          row.category.forEach(item => {
            const obj = JSON.parse(item.text);
            item.text = obj.name;
          });
        }
        if (row.description) {
          row.description = [{ text: row.description[0].text.replace(/<li>/g, '||') }];
        }
        if (row.additionalDescBulletInfo) {
          row.additionalDescBulletInfo = [{ text: row.additionalDescBulletInfo[0].text.replace(/<li>/g, '|') }];
          row.descriptionBullets = [{ text: row.additionalDescBulletInfo[0].text.split('|').length }];
        }

        if (row.nutritionInfo) {
          const jsonStr = `{${row.nutritionInfo[0].text}}`;
          if (jsonStr) {
            const info = JSON.parse(jsonStr);
            console.log(JSON.stringify(info));
            if (info && info.nutritionFacts && info.nutritionFacts.servingInfo && info.nutritionFacts.servingInfo.values) {
              const servingSize = (info.nutritionFacts.servingInfo.values[0]) ? info.nutritionFacts.servingInfo.values[0].value : '';
              row.servingSize = [{ text: getSplitValue(servingSize, 1) }];
              row.servingSizeUom = [{ text: getSplitValue(servingSize, 2) }];
              row.numberOfServingsInPackage = [{ text: (info.nutritionFacts.servingInfo.values[1]) ? info.nutritionFacts.servingInfo.values[1].value : '' }];
            }
            if (info && info.nutritionFacts && info.nutritionFacts.calorieInfo) {
              row.caloriesPerServing = [{ text: (info.nutritionFacts.calorieInfo.mainNutrient && info.nutritionFacts.calorieInfo.mainNutrient.amount) ? info.nutritionFacts.calorieInfo.mainNutrient.amount.split(' ')[0].replace('cal', '') : '' }];
              row.caloriesFromFatPerServing = [{ text: (info.nutritionFacts.calorieInfo.childNutrients && info.nutritionFacts.calorieInfo.childNutrients[0] && info.nutritionFacts.calorieInfo.childNutrients[0].amount) ? info.nutritionFacts.calorieInfo.childNutrients[0].amount.split(' ')[0].replace('cal', '') : '' }];
            }
            if (info && info.nutritionFacts && info.nutritionFacts.keyNutrients && info.nutritionFacts.keyNutrients.values) {
              let valueNode = getValue('Total Fat', info.nutritionFacts.keyNutrients);
              const totalFatPerServing = valueNode ? valueNode.mainNutrient.amount : '';
              row.totalFatPerServing = [{ text: getSplitValue(totalFatPerServing, 1) }];
              row.totalFatPerServingUom = [{ text: getSplitValue(totalFatPerServing, 2) }];

              const saturatedFatPerServing = (valueNode && valueNode.childNutrients) ? valueNode.childNutrients[0].amount : '';
              row.saturatedFatPerServing = [{ text: getSplitValue(saturatedFatPerServing, 1) }];
              row.saturatedFatPerServingUom = [{ text: getSplitValue(saturatedFatPerServing, 2) }];

              const transFatPerServing = (valueNode && valueNode.childNutrients && valueNode.childNutrients.length > 1) ? valueNode.childNutrients[1].amount : '';
              row.transFatPerServing = [{ text: getSplitValue(transFatPerServing, 1) }];
              row.transFatPerServingUom = [{ text: getSplitValue(transFatPerServing, 2) }];

              valueNode = getValue('Cholesterol', info.nutritionFacts.keyNutrients);
              const cholesterolPerServing = (valueNode && valueNode.mainNutrient) ? valueNode.mainNutrient.amount : '';
              row.cholesterolPerServing = [{ text: getSplitValue(cholesterolPerServing, 1) }];
              row.cholesterolPerServingUom = [{ text: getSplitValue(cholesterolPerServing, 2) }];

              valueNode = getValue('Sodium', info.nutritionFacts.keyNutrients);
              const sodiumPerServing = (valueNode && valueNode.mainNutrient) ? valueNode.mainNutrient.amount : '';
              row.sodiumPerServing = [{ text: getSplitValue(sodiumPerServing, 1) }];
              row.sodiumPerServingUom = [{ text: getSplitValue(sodiumPerServing, 2) }];

              valueNode = getValue('Carbohydrate', info.nutritionFacts.keyNutrients);
              const totalCarbPerServing = (valueNode && valueNode.mainNutrient) ? valueNode.mainNutrient.amount : '';
              row.totalCarbPerServing = [{ text: getSplitValue(totalCarbPerServing, 1) }];
              row.totalCarbPerServingUom = [{ text: getSplitValue(totalCarbPerServing, 2) }];

              const dietaryFibrePerServing = (valueNode && valueNode.childNutrients) ? valueNode.childNutrients[0].amount : '';
              row.dietaryFibrePerServing = [{ text: getSplitValue(dietaryFibrePerServing, 1) }];
              row.dietaryFibrePerServingUom = [{ text: getSplitValue(dietaryFibrePerServing, 2) }];

              const totalSugarsPerServing = (valueNode && valueNode.childNutrients && valueNode.childNutrients.length > 1) ? valueNode.childNutrients[1].amount : '';
              row.totalSugarsPerServing = [{ text: getSplitValue(totalSugarsPerServing, 1) }];
              row.totalSugarsPerServingUom = [{ text: getSplitValue(totalSugarsPerServing, 2) }];

              valueNode = getValue('Protein', info.nutritionFacts.keyNutrients);
              const proteinPerServing = (valueNode && valueNode.mainNutrient) ? valueNode.mainNutrient.amount : '';
              row.proteinPerServing = [{ text: getSplitValue(proteinPerServing, 1) }];
              row.proteinPerServingUom = [{ text: getSplitValue(proteinPerServing, 2) }];
            }
            if (info && info.nutritionFacts && info.nutritionFacts.vitaminMinerals && info.nutritionFacts.vitaminMinerals.childNutrients) {
              row.vitaminAPerServing = [{ text: info.nutritionFacts.vitaminMinerals.childNutrients[0] ? info.nutritionFacts.vitaminMinerals.childNutrients[2].dvp : '' }];
              row.vitaminCPerServing = [{ text: info.nutritionFacts.vitaminMinerals.childNutrients[1] ? info.nutritionFacts.vitaminMinerals.childNutrients[2].dvp : '' }];
              row.calciumPerServing = [{ text: info.nutritionFacts.vitaminMinerals.childNutrients[2] ? info.nutritionFacts.vitaminMinerals.childNutrients[2].dvp : '' }];
              row.ironPerServing = [{ text: info.nutritionFacts.vitaminMinerals.childNutrients[3] ? info.nutritionFacts.vitaminMinerals.childNutrients[3].dvp : '' }];
            }
          }
        }
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = el.text ? clean(el.text) : el.text;
        }));
      } catch (exception) { console.log('Error in transform', exception); }
      try {
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = el.text ? clean(el.text) : el.text;
        }));
      } catch (exception) { console.log('Error in cleanup transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };
