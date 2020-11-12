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
    .replace(/[^\x00-\x7F]/g, '');

  const regexp = '(?:([\\d\\.]+)\\s?(\\w+))';
  function getSplitValue (inputStr, count) {
    if (inputStr) {
      const result = inputStr.match(regexp);
      return result[count];
    }
  }
  for (const { group } of data) {
    for (const row of group) {
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
            if (info && info.nutritionFacts && info.nutritionFacts.servingInfo) {
              const servingSize = (info.nutritionFacts.servingInfo.values[0]) ? info.nutritionFacts.servingInfo.values[0].value : '';
              row.servingSize = [{ text: getSplitValue(servingSize, 1) }];
              row.servingSizeUom = [{ text: getSplitValue(servingSize, 2) }];
              row.numberOfServingsInPackage = [{ text: (info.nutritionFacts.servingInfo.values[1]) ? info.nutritionFacts.servingInfo.values[1].value : '' }];
            }
            if (info && info.nutritionFacts && info.nutritionFacts.calorieInfo) {
              row.caloriesPerServing = [{ text: (info.nutritionFacts.calorieInfo.mainNutrient && info.nutritionFacts.calorieInfo.mainNutrient.amount) ? info.nutritionFacts.calorieInfo.mainNutrient.amount.split(' ')[0].replace('cal', '') : '' }];
              row.caloriesFromFatPerServing = [{ text: (info.nutritionFacts.calorieInfo.childNutrients[0] && info.nutritionFacts.calorieInfo.childNutrients[0].amount) ? info.nutritionFacts.calorieInfo.childNutrients[0].amount.split(' ')[0].replace('cal', '') : '' }];
            }
            if (info && info.nutritionFacts && info.nutritionFacts.keyNutrients) {
              const totalFatPerServing = (info.nutritionFacts.keyNutrients.values[0] && info.nutritionFacts.keyNutrients.values[0].mainNutrient) ? info.nutritionFacts.keyNutrients.values[0].mainNutrient.amount : '';
              row.totalFatPerServing = [{ text: getSplitValue(totalFatPerServing, 1) }];
              row.totalFatPerServingUom = [{ text: getSplitValue(totalFatPerServing, 2) }];

              const saturatedFatPerServing = (info.nutritionFacts.keyNutrients.values[0] && info.nutritionFacts.keyNutrients.values[0].childNutrients[0]) ? info.nutritionFacts.keyNutrients.values[0].childNutrients[0].amount : '';
              row.saturatedFatPerServing = [{ text: getSplitValue(saturatedFatPerServing, 1) }];
              row.saturatedFatPerServingUom = [{ text: getSplitValue(saturatedFatPerServing, 2) }];

              const transFatPerServing = (info.nutritionFacts.keyNutrients.values[0] && info.nutritionFacts.keyNutrients.values[0].childNutrients[1]) ? info.nutritionFacts.keyNutrients.values[0].childNutrients[1].amount : '';
              row.transFatPerServing = [{ text: getSplitValue(transFatPerServing, 1) }];
              row.transFatPerServingUom = [{ text: getSplitValue(transFatPerServing, 2) }];

              const cholesterolPerServing = (info.nutritionFacts.keyNutrients.values[1] && info.nutritionFacts.keyNutrients.values[1].mainNutrient) ? info.nutritionFacts.keyNutrients.values[1].mainNutrient.amount : '';
              row.cholesterolPerServing = [{ text: getSplitValue(cholesterolPerServing, 1) }];
              row.cholesterolPerServingUom = [{ text: getSplitValue(cholesterolPerServing, 2) }];

              const sodiumPerServing = (info.nutritionFacts.keyNutrients.values[2] && info.nutritionFacts.keyNutrients.values[2].mainNutrient) ? info.nutritionFacts.keyNutrients.values[2].mainNutrient.amount : '';
              row.sodiumPerServing = [{ text: getSplitValue(sodiumPerServing, 1) }];
              row.sodiumPerServingUom = [{ text: getSplitValue(sodiumPerServing, 2) }];

              const totalCarbPerServing = (info.nutritionFacts.keyNutrients.values[3] && info.nutritionFacts.keyNutrients.values[3].mainNutrient) ? info.nutritionFacts.keyNutrients.values[3].mainNutrient.amount : '';
              row.totalCarbPerServing = [{ text: getSplitValue(totalCarbPerServing, 1) }];
              row.totalCarbPerServingUom = [{ text: getSplitValue(totalCarbPerServing, 2) }];

              const dietaryFibrePerServing = (info.nutritionFacts.keyNutrients.values[3] && info.nutritionFacts.keyNutrients.values[3].childNutrients[0]) ? info.nutritionFacts.keyNutrients.values[3].childNutrients[0].amount : '';
              row.dietaryFibrePerServing = [{ text: getSplitValue(dietaryFibrePerServing, 1) }];
              row.dietaryFibrePerServingUom = [{ text: getSplitValue(dietaryFibrePerServing, 2) }];

              const totalSugarsPerServing = (info.nutritionFacts.keyNutrients.values[3] && info.nutritionFacts.keyNutrients.values[3].childNutrients[1]) ? info.nutritionFacts.keyNutrients.values[3].childNutrients[1].amount : '';
              row.totalSugarsPerServing = [{ text: getSplitValue(totalSugarsPerServing, 1) }];
              row.totalSugarsPerServingUom = [{ text: getSplitValue(totalSugarsPerServing, 2) }];

              const proteinPerServing = (info.nutritionFacts.keyNutrients.values[4] && info.nutritionFacts.keyNutrients.values[4].mainNutrient) ? info.nutritionFacts.keyNutrients.values[4].mainNutrient.amount : '';
              row.proteinPerServing = [{ text: getSplitValue(proteinPerServing, 1) }];
              row.proteinPerServingUom = [{ text: getSplitValue(proteinPerServing, 2) }];
            }
            if (info && info.nutritionFacts && info.nutritionFacts.vitaminMinerals) {
              row.vitaminAPerServing = [{ text: info.nutritionFacts.vitaminMinerals.childNutrients[0].dvp }];
              row.vitaminCPerServing = [{ text: info.nutritionFacts.vitaminMinerals.childNutrients[1].dvp }];
              row.calciumPerServing = [{ text: info.nutritionFacts.vitaminMinerals.childNutrients[2].dvp }];
              row.ironPerServing = [{ text: info.nutritionFacts.vitaminMinerals.childNutrients[3].dvp }];
            }
          }
        }
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };
