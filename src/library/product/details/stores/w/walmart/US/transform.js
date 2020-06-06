
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      try {
        if (row.nutritionInfo) {
          const jsonStr = `{${row.nutritionInfo[0].text}}`;
          console.log(JSON.stringify(jsonStr));
          if (jsonStr) {
            const info = JSON.parse(jsonStr);
            const servingSize = info.nutritionFacts.servingInfo.values[0].value;
            row.servingSize = [{ text: servingSize.split(' ')[0] }];
            row.servingSizeUom = [{ text: servingSize.split(' ')[1] }];

            row.numberOfServingsInPackage = [{ text: info.nutritionFacts.servingInfo.values[1].value }];
            row.caloriesPerServing = [{ text: info.nutritionFacts.calorieInfo.mainNutrient.amount.split(' ')[0] }];
            row.caloriesFromFatPerServing = [{ text: info.nutritionFacts.calorieInfo.childNutrients[0].amount.split(' ')[0] }];

            const totalFatPerServing = info.nutritionFacts.servingInfo.values[0].value;
            row.totalFatPerServing = [{ text: totalFatPerServing.split(' ')[0] }];
            row.totalFatPerServingUom = [{ text: totalFatPerServing.split(' ')[1] }];

            const saturatedFatPerServing = info.nutritionFacts.keyNutrients.values[0].childNutrients[0].amount;
            row.saturatedFatPerServing = [{ text: saturatedFatPerServing.split(' ')[0] }];
            row.saturatedFatPerServingUom = [{ text: saturatedFatPerServing.split(' ')[1] }];

            const transFatPerServing = info.nutritionFacts.keyNutrients.values[0].childNutrients[0].amount;
            row.transFatPerServing = [{ text: transFatPerServing.split(' ')[0] }];
            row.transFatPerServingUom = [{ text: transFatPerServing.split(' ')[1] }];

            const cholesterolPerServing = info.nutritionFacts.keyNutrients.values[0].childNutrients[0].amount;
            row.cholesterolPerServing = [{ text: cholesterolPerServing.split(' ')[0] }];
            row.cholesterolPerServingUom = [{ text: cholesterolPerServing.split(' ')[0] }];

            const sodiumPerServing = info.nutritionFacts.keyNutrients.values[0].childNutrients[0].amount;
            row.sodiumPerServing = [{ text: sodiumPerServing.split(' ')[0] }];
            row.sodiumPerServingUom = [{ text: sodiumPerServing.split(' ')[1] }];

            const totalCarbPerServing = info.nutritionFacts.keyNutrients.values[0].childNutrients[0].amount;
            row.totalCarbPerServing = [{ text: totalCarbPerServing.split(' ')[0] }];
            row.totalCarbPerServingUom = [{ text: totalCarbPerServing.split(' ')[1] }];

            const dietaryFibrePerServing = info.nutritionFacts.keyNutrients.values[0].childNutrients[0].amount;
            row.dietaryFibrePerServing = [{ text: dietaryFibrePerServing.split(' ')[0] }];
            row.dietaryFibrePerServingUom = [{ text: dietaryFibrePerServing.split(' ')[1] }];

            const totalSugarsPerServing = info.nutritionFacts.keyNutrients.values[0].childNutrients[0].amount;
            row.totalSugarsPerServing = [{ text: totalSugarsPerServing.split(' ')[0] }];
            row.totalSugarsPerServingUom = [{ text: totalSugarsPerServing.split(' ')[1] }];

            const proteinPerServing = info.nutritionFacts.keyNutrients.values[0].childNutrients[0].amount;
            row.proteinPerServing = [{ text: proteinPerServing.split(' ')[0] }];
            row.proteinPerServingUom = [{ text: proteinPerServing.split(' ')[1] }];

            row.vitaminAPerServing = [{ text: info.nutritionFacts.vitaminMinerals.childNutrients[0].dvp }];
            row.vitaminCPerServing = [{ text: info.nutritionFacts.vitaminMinerals.childNutrients[1].dvp }];
            row.calciumPerServing = [{ text: info.nutritionFacts.vitaminMinerals.childNutrients[2].dvp }];
            row.ironPerServing = [{ text: info.nutritionFacts.vitaminMinerals.childNutrients[3].dvp }];
          }
        }
      } finally {}
    }
  }
  return data;
};

module.exports = { transform };
