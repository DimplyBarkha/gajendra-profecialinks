
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
        const TotalFatPerServing = nutritionDetails[4].replace(/[^\d.-]/g, '');
        const TotalFatPerServingUOM = nutritionDetails[4].replace(/[^a-zA-Z%]/g, '');
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
        const CholesterolPerServing = nutritionDetails[7].replace(/[^\d.-]/g, '');
        const CholesterolPerServingUOM = nutritionDetails[7].replace(/[^a-zA-Z%]/g, '');
        addElementToDocument('added_cholesterol_per_serving', CholesterolPerServing);
        addElementToDocument('added_cholesterol_per_serving_uom', CholesterolPerServingUOM);
      }
      if (nutritionDetails[8] !== 'null' && nutritionDetails[8] !== null && nutritionDetails[8] !== '') {
        // added_sodium_per_serving
        const SodiumPerServing = nutritionDetails[8].replace(/[^\d.-]/g, '');
        const SodiumPerServingUOM = nutritionDetails[8].replace(/[^a-zA-Z%]/g, '');
        addElementToDocument('added_sodium_per_serving', SodiumPerServing);
        addElementToDocument('added_sodium_per_serving_uom', SodiumPerServingUOM);
      }
      if (nutritionDetails[9] !== 'null' && nutritionDetails[9] !== null && nutritionDetails[9] !== '') {
        // added_total_carb_per_serving
        const TotalCarbPerServing = nutritionDetails[9].replace(/[^\d.-]/g, '');
        const TotalCarbPerServingUOM = nutritionDetails[9].replace(/[^a-zA-Z%]/g, '');
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
        const TotalSugarsPerServing = nutritionDetails[11].replace(/[^\d.-]/g, '');
        const TotalSugarsPerServingUOM = nutritionDetails[11].replace(/[^a-zA-Z%]/g, '');
        addElementToDocument('added_total_sugars_per_serving', TotalSugarsPerServing);
        addElementToDocument('added_total_sugars_per_serving_uom', TotalSugarsPerServingUOM);
      }
      if (nutritionDetails[12] !== 'null' && nutritionDetails[12] !== null && nutritionDetails[12] !== '') {
        // added_protein_per_serving
        const ProteinPerServing = nutritionDetails[12].replace(/[^\d.-]/g, '');
        const ProteinPerServingUOM = nutritionDetails[12].replace(/[^a-zA-Z%]/g, '');
        addElementToDocument('added_protein_per_serving', ProteinPerServing);
        addElementToDocument('added_protein_per_serving_uom', ProteinPerServingUOM);
      }
      // if (nutritionDetails[13] !== 'null' && nutritionDetails[13] !== null && nutritionDetails[13] !== '') {
      //   // added_vitamin_a_per_serving
      //   const VitaminAPerServing = nutritionDetails[13].replace(/[^\d.-]/g, '');
      //   const VitaminAPerServingUOM = nutritionDetails[13].replace(/[^a-zA-Z%]/g, '');
      //   addElementToDocument('added_vitamin_a_per_serving', VitaminAPerServing);
      //   addElementToDocument('added_vitamin_a_per_serving_uom', VitaminAPerServingUOM);
      // }
      // if (nutritionDetails[14] !== 'null' && nutritionDetails[14] !== null && nutritionDetails[14] !== '') {
      //   // added_vitamin_c_per_serving
      //   const VitaminCPerServing = nutritionDetails[14].replace(/[^\d.-]/g, '');
      //   const VitaminCPerServingUOM = nutritionDetails[14].replace(/[^a-zA-Z%]/g, '');
      //   addElementToDocument('added_vitamin_c_per_serving', VitaminCPerServing);
      //   addElementToDocument('added_vitamin_c_per_serving_uom', VitaminCPerServingUOM);
      // }
      // if (nutritionDetails[15] !== 'null' && nutritionDetails[15] !== null && nutritionDetails[15] !== '') {
      //   // added_calcium_per_serving
      //   const CalciumPerServing = nutritionDetails[15].replace(/[^\d.-]/g, '');
      //   const CalciumPerServingUOM = nutritionDetails[15].replace(/[^a-zA-Z%]/g, '');
      //   addElementToDocument('added_calcium_per_serving', CalciumPerServing);
      //   addElementToDocument('added_calcium_per_serving_uom', CalciumPerServingUOM);
      // }
      // if (nutritionDetails[16] !== 'null' && nutritionDetails[16] !== null && nutritionDetails[16] !== '') {
      //   // added_iron_per_serving
      //   const IronPerServing = nutritionDetails[16].replace(/[^\d.-]/g, '');
      //   const IronPerServingUOM = nutritionDetails[16].replace(/[^a-zA-Z%]/g, '');
      //   addElementToDocument('added_iron_per_serving', IronPerServing);
      //   addElementToDocument('added_iron_per_serving_uom', IronPerServingUOM);
      // }
    }
  });
  await context.extract(productDetails, { transform: transformParam });
};
