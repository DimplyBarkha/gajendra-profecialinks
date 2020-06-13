/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  function cleanUp (data) {
    let dataStr = JSON.stringify(data);
    dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[^\x00-\x7F]/g, '');
    return JSON.parse(dataStr);
  }
  const regexp = '(?:([\\d\\.]+)\\s?(\\w+))';
  function getSplitValue (inputStr, count) {
    if (inputStr) {
      const result = inputStr.match(regexp);
      return result[count];
    }
  }
  function getValue (name, obj) {
    if (obj.values && obj.values.length > 0) {
      for (let i = 0; i < obj.values.length; i++) {
        if (obj.values[i].mainNutrient && obj.values[i].mainNutrient.name && obj.values[i].mainNutrient.name.includes(name)) {
          console.log(obj.values[i]);
          return obj.values[i];
        }
      }
    }
  }
  
  for (const { group } of data) {
    for (let row of group) {
      try {
        if (row.asin) {
          row.asin = [{ text: row.asin[0].text.replace('Walmart', '').replace('#', '').trim() }];
        }
        if (row.alternateImages) {
          row.alternateImages.forEach(item => {
            if (!item.text.match('https://') && item.text.startsWith('//')) {
              item.text = `https:${item.text}`;
            }
          });
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

              const saturatedFatPerServing = (valueNode && valueNode.childNutrients[0]) ? valueNode.childNutrients[0].amount : '';
              row.saturatedFatPerServing = [{ text: getSplitValue(saturatedFatPerServing, 1) }];
              row.saturatedFatPerServingUom = [{ text: getSplitValue(saturatedFatPerServing, 2) }];

              const transFatPerServing = (valueNode && valueNode.childNutrients[1]) ? valueNode.childNutrients[1].amount : '';
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
              row.vitaminAPerServing = [{ text: info.nutritionFacts.vitaminMinerals.childNutrients[0].dvp }];
              row.vitaminCPerServing = [{ text: info.nutritionFacts.vitaminMinerals.childNutrients[1].dvp }];
              row.calciumPerServing = [{ text: info.nutritionFacts.vitaminMinerals.childNutrients[2].dvp }];
              row.ironPerServing = [{ text: info.nutritionFacts.vitaminMinerals.childNutrients[3].dvp }];
            }
          }
        }
        row = cleanUp(row);
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };
