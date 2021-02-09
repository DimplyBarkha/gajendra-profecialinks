
module.exports.implementation = async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
  await context.evaluate(async function () {
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
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

    const promotionText = getAllXpath('//div[@class="productPage__price"]//p[@class="productPriceInfo__saleInfo"] | //div[@class="productPage__price"]//p[@class="productPriceInfo__details"]', 'innerText');
    if (promotionText && promotionText.length > 0) {
      addElementToDocument('added_promotion', promotionText.join(' '));
    }
    const ServingSize = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Serving Size")]/following-sibling::span', 'innerText');
    const ServingPerContainer = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Per Container")]/following-sibling::span | //div[@id="nutrionFacts"]//div//label[contains(text(),"Per Container")]/preceding-sibling::span', 'innerText');
    const Calories = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Calories")]/following-sibling::span[1]', 'innerText');
    const CaloriesFromFat = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Calories from Fat")]/following-sibling::span[1]', 'innerText');
    const TotalFat = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Total Fat")]/following-sibling::span[1]', 'innerText');
    const SaturatedFat = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Saturated Fat")]/following-sibling::span[1]', 'innerText');
    const TransFat = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Trans Fat")]/following-sibling::span[1]', 'innerText');
    const Cholestrol = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Cholesterol")]/following-sibling::span[1]', 'innerText');
    const Sodium = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Sodium")]/following-sibling::span[1]', 'innerText');
    const Carbohydrate = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Total Carbohydrate")]/following-sibling::span[1]', 'innerText');
    const DieteryFiber = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Dietary Fiber")]/following-sibling::span[1]', 'innerText');
    const TotalSugar = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Sugars")]/following-sibling::span[1]', 'innerText');
    const Protein = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Protein")]/following-sibling::span[1]', 'innerText');
    const VitaminA = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Vitamin A")]/following-sibling::span[1]', 'innerText');
    const VitaminC = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Vitamin C")]/following-sibling::span[1]', 'innerText');
    const Calcium = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Calcium")]/following-sibling::span[1]', 'innerText');
    const Iron = getXpath('//div[@id="nutrionFacts"]//div//label[contains(text(),"Iron")]/following-sibling::span[1]', 'innerText');
    const NutritionString = ServingSize + '|' + ServingPerContainer + '|' + Calories + ' |' + CaloriesFromFat + ' |' + TotalFat + '|' + SaturatedFat + '|' + TransFat + '|' + Cholestrol + '|' + Sodium + '|' + Carbohydrate + '|' + DieteryFiber + '|' + TotalSugar + '|' + Protein + '|' + VitaminA + '|' + VitaminC + '|' + Calcium + '|' + Iron;
    console.log(NutritionString);
    const nutritionDetails = NutritionString.split('|');
    // Nutrition
    if (typeof nutritionDetails !== 'undefined') {
      if (nutritionDetails[1] !== 'null') {
        // added_number_of_servings
        addElementToDocument('added_number_of_servings', nutritionDetails[1].replace(/[^\d.-]/g, ''));
      }
      if (nutritionDetails[2] !== 'null ') {
        // added_calories_per_serving
        addElementToDocument('added_calories_per_serving', nutritionDetails[2].replace(/[^\d.-]/g, ''));
      }
      if (nutritionDetails[3] !== 'null ') {
        // added_calories_from_fat_per_serving
        addElementToDocument('added_calories_from_fat_per_serving', nutritionDetails[3].replace(/[^\d.-]/g, ''));
      }
      if (nutritionDetails[0] !== 'null' && nutritionDetails[0] !== null && nutritionDetails[0] !== '') {
        const servingSize = nutritionDetails[0].replace(/[^\d.-]/g, '');
        const servingSizeUOM = nutritionDetails[0].replace(/[^a-zA-Z%]/g, '');
        addElementToDocument('added_serving_size', servingSize);
        addElementToDocument('added_serving_size_uom', servingSizeUOM);
      }
      if (nutritionDetails[4] !== 'null' && nutritionDetails[4] !== null && nutritionDetails[4] !== '') {
        // added_total_fat_per_serving
        const totalFatArray = [];
        const totalFatNumber = nutritionDetails[4].replace(/[^<\d.-]/g, '');
        const totalFatUnit = nutritionDetails[4].replace(/[^a-zA-Z%]/g, '');
        totalFatArray.push(totalFatNumber, totalFatUnit);
        const TotalFatPerServing = (totalFatArray[1] === 'MG' || totalFatArray[1] === 'G') ? totalFatArray[0] + totalFatArray[1] : totalFatArray[0];
        const TotalFatPerServingUOM = (totalFatArray[1] === 'MG' || totalFatArray[1] === 'G') ? '' : totalFatArray[1];
        addElementToDocument('added_total_fat_per_serving', TotalFatPerServing);
        addElementToDocument('added_total_fat_per_serving_uom', TotalFatPerServingUOM);
      }
      if (nutritionDetails[5] !== 'null' && nutritionDetails[5] !== null && nutritionDetails[5] !== '') {
        // added_saturated_fat_per_serving
        const SaturatedFatPerServing = nutritionDetails[5].replace(/[^\d.-]/g, '');
        const SaturatedFatPerServingUOM = nutritionDetails[5].replace(/[^a-zA-Z%]/g, '');
        addElementToDocument('added_saturated_fat_per_serving', SaturatedFatPerServing);
        addElementToDocument('added_saturated_fat_per_serving_uom', SaturatedFatPerServingUOM);
      }
      if (nutritionDetails[6] !== 'null' && nutritionDetails[6] !== null && nutritionDetails[6] !== '') {
        // added_trans_fat_per_serving
        const TransFatPerServing = nutritionDetails[6].replace(/[^\d.-]/g, '');
        const TransFatPerServingUOM = nutritionDetails[6].replace(/[^a-zA-Z%]/g, '');
        addElementToDocument('added_trans_fat_per_serving', TransFatPerServing);
        addElementToDocument('added_trans_fat_per_serving_uom', TransFatPerServingUOM);
      }
      if (nutritionDetails[7] !== 'null' && nutritionDetails[7] !== null && nutritionDetails[7] !== '') {
        // added_cholesterol_per_serving
        const cholesterolArray = [];
        const cholesterolNumber = nutritionDetails[7].replace(/[^<\d.-]/g, '');
        const cholesterolUnit = nutritionDetails[7].replace(/[^a-zA-Z%]/g, '');
        cholesterolArray.push(cholesterolNumber, cholesterolUnit);
        const CholesterolPerServing = (cholesterolArray[1] === 'MG' || cholesterolArray[1] === 'G') ? cholesterolArray[0] + cholesterolArray[1] : cholesterolArray[0];
        const CholesterolPerServingUOM = (cholesterolArray[1] === 'MG' || cholesterolArray[1] === 'G') ? '' : cholesterolArray[1];
        addElementToDocument('added_cholesterol_per_serving', CholesterolPerServing);
        addElementToDocument('added_cholesterol_per_serving_uom', CholesterolPerServingUOM);
      }
      if (nutritionDetails[8] !== 'null' && nutritionDetails[8] !== null && nutritionDetails[8] !== '') {
        // added_sodium_per_serving
        const sodiumArray = [];
        const sodiumNumber = nutritionDetails[8].replace(/[^<\d.-]/g, '');
        const sodiumUnit = nutritionDetails[8].replace(/[^a-zA-Z%]/g, '');
        sodiumArray.push(sodiumNumber, sodiumUnit);
        const SodiumPerServing = (sodiumArray[1] === 'MG' || sodiumArray[1] === 'G') ? sodiumArray[0] + sodiumArray[1] : sodiumArray[0];
        const SodiumPerServingUOM = (sodiumArray[1] === 'MG' || sodiumArray[1] === 'G') ? '' : sodiumArray[1];
        addElementToDocument('added_sodium_per_serving', SodiumPerServing);
        addElementToDocument('added_sodium_per_serving_uom', SodiumPerServingUOM);
      }
      if (nutritionDetails[9] !== 'null' && nutritionDetails[9] !== null && nutritionDetails[9] !== '') {
        // added_total_carb_per_serving
        const totalCarbArray = [];
        const totalCarbNumber = nutritionDetails[9].replace(/[^<\d.-]/g, '');
        const totalCarbUnit = nutritionDetails[9].replace(/[^a-zA-Z%]/g, '');
        totalCarbArray.push(totalCarbNumber, totalCarbUnit);
        const TotalCarbPerServing = (totalCarbArray[1] === 'MG' || totalCarbArray[1] === 'G') ? totalCarbArray[0] + totalCarbArray[1] : totalCarbArray[0];
        const TotalCarbPerServingUOM = (totalCarbArray[1] === 'MG' || totalCarbArray[1] === 'G') ? '' : totalCarbArray[1];
        addElementToDocument('added_total_carb_per_serving', TotalCarbPerServing);
        addElementToDocument('added_total_carb_per_serving_uom', TotalCarbPerServingUOM);
      }
      if (nutritionDetails[10] !== 'null' && nutritionDetails[10] !== null && nutritionDetails[10] !== '') {
        // added_dietary_fibre_per_serving
        const DietaryFibrePerServing = nutritionDetails[10].replace(/[^\d.-]/g, '');
        const DietaryFibrePerServingUOM = nutritionDetails[10].replace(/[^a-zA-Z%]/g, '');
        addElementToDocument('added_dietary_fibre_per_serving', DietaryFibrePerServing);
        addElementToDocument('added_dietary_fibre_per_serving_uom', DietaryFibrePerServingUOM);
      }
      if (nutritionDetails[11] !== 'null' && nutritionDetails[11] !== null && nutritionDetails[11] !== '') {
        // added_total_sugars_per_serving
        const totalSugarsArray = [];
        const totalSugarsNumber = nutritionDetails[11].replace(/[^<\d.-]/g, '');
        const totalSugarsUnit = nutritionDetails[11].replace(/[^a-zA-Z%]/g, '');
        totalSugarsArray.push(totalSugarsNumber, totalSugarsUnit);
        const TotalSugarsPerServing = (totalSugarsArray[1] === 'MG' || totalSugarsArray[1] === 'G') ? totalSugarsArray[0] + totalSugarsArray[1] : totalSugarsArray[0];
        const TotalSugarsPerServingUOM = (totalSugarsArray[1] === 'MG' || totalSugarsArray[1] === 'G') ? '' : totalSugarsArray[1];
        addElementToDocument('added_total_sugars_per_serving', TotalSugarsPerServing);
        addElementToDocument('added_total_sugars_per_serving_uom', TotalSugarsPerServingUOM);
      }
      if (nutritionDetails[12] !== 'null' && nutritionDetails[12] !== null && nutritionDetails[12] !== '') {
        // added_protein_per_serving
        const proteinArray = [];
        const proteinNumber = nutritionDetails[12].replace(/[^<\d.-]/g, '');
        const proteinUnit = nutritionDetails[12].replace(/[^a-zA-Z%]/g, '');
        proteinArray.push(proteinNumber, proteinUnit);
        const ProteinPerServing = (proteinArray[1] === 'MG' || proteinArray[1] === 'G') ? proteinArray[0] + proteinArray[1] : proteinArray[0];
        const ProteinPerServingUOM = (proteinArray[1] === 'MG' || proteinArray[1] === 'G') ? '' : proteinArray[1];
        addElementToDocument('added_protein_per_serving', ProteinPerServing);
        addElementToDocument('added_protein_per_serving_uom', ProteinPerServingUOM);
      }
    }
  });
  await context.extract(productDetails, { transform: transformParam });
};
