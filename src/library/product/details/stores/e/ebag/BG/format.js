// @ts-nocheck
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          item.text = item.text.includes('Не е наличен') ? 'Out Of Stock' : 'In Stock';
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/.{3}$/, '800');
        });
      }
      if (row.ingredientsList) {
        row.ingredientsList.forEach(item => {
          item.text = item.text.replace(/^Съставки: (.+)/g, '$1').replace(/\n/g, '');
        });
      }
      if (row.directions) {
        row.directions.forEach(item => {
          item.text = item.text.replace(/Начин на приготвяне:/, '').trim();
        });
      }
      if (!row.allergyAdvice) {
        if (row.allergyAdvice1) {
          row.allergyAdvice1[0].text = row.allergyAdvice1[0].text.replace(/Информация за алергени:/, '').trim();
          row.allergyAdvice = row.allergyAdvice1;
        }
      }
      if (row.additives) {
        row.additives.forEach(item => {
          item.text = item.text.replace(/Добавки:/g, '').trim();
        });
      }
      if (!row.caloriesPerServing) {
        if (row.nutritionValues1) {
          let calorie = row.nutritionValues1[0].text.replace(/\n/g, '').replace(/.*Енергийност: (.*)/, '$1').replace(/^((?:\S+\s+){2}\S+).*/, '$1');
          calorie = calorie.split('Мазнини:')[0];
          row.caloriesPerServing = [{ text: calorie }];

          let fat = row.nutritionValues1[0].text.replace(/\n/g, '').replace(/.*Мазнини: (.*)/, '$1').replace(/^((?:\S+\s+){1}\S+).*/, '$1');
          fat = fat.split('От')[0];
          row.totalFatPerServing = [{ text: fat }];
          const fatUom = fat.split(' ')[1];
          row.totalFatPerServingUom = [{ text: fatUom }];

          let carb = row.nutritionValues1[0].text.replace(/\n/g, '').replace(/.*Въглехидрати: (.*)/, '$1').replace(/^((?:\S+\s+){1}\S+).*/, '$1');
          carb = carb.split('От')[0];
          row.totalCarbPerServing = [{ text: carb }];
          const carbUom = carb.split(' ')[1];
          row.totalCarbPerServingUom = [{ text: carbUom }];

          let protein = row.nutritionValues1[0].text.replace(/\n/g, '').replace(/.*Протеини: (.*)/, '$1').replace(/^((?:\S+\s+){1}\S+).*/, '$1');
          protein = protein.split('Сол:')[0];
          row.proteinPerServing = [{ text: protein }];
          const proteinUom = carb.split(' ')[1];
          row.proteinPerServingUom = [{ text: proteinUom }];

          let salt = row.nutritionValues1[0].text.replace(/\n/g, '').replace(/.*Сол: (.*)/, '$1').replace(/^((?:\S+\s+){1}\S+).*/, '$1');
          salt = salt.split('Съдържанието')[0];
          row.saltPerServing = [{ text: salt }];
          const saltUom = carb.split(' ')[1];
          row.saltPerServingUom = [{ text: saltUom }];
        } else if (row.nutritionValues2) {
          let calorie = row.nutritionValues2[0].text.replace(/\n/g, '').replace(/.*енергия - (.*)/, '$1').replace(/^((?:\S+\s+){4}\S+).*/, '$1');
          calorie = calorie.split(';')[0];
          row.caloriesPerServing = [{ text: calorie }];

          let carb = row.nutritionValues2[0].text.replace(/\n/g, '').replace(/.*въглехидрати – (.*)/, '$1').replace(/^((?:\S+\s+){1}\S+).*/, '$1');
          carb = carb.split(', от')[0];
          row.totalCarbPerServing = [{ text: carb }];
          row.totalCarbPerServingUom = [{ text: 'g' }];

          let sugar = row.nutritionValues2[0].text.replace(/\n/g, '').replace(/.*които захари - (.*)/, '$1').replace(/^((?:\S+\s+){1}\S+).*/, '$1');
          sugar = sugar.split('; фибри')[0];
          row.totalSugarsPerServing = [{ text: sugar }];
          row.totalCarbPerServingUom = [{ text: 'g' }];

          let protein = row.nutritionValues2[0].text.replace(/\n/g, '').replace(/.* фибри – (.*)/, '$1').replace(/^((?:\S+\s+){1}\S+).*/, '$1');
          protein = protein.split('; белтъчини')[0];
          row.proteinPerServing = [{ text: protein }];
          row.proteinPerServingUom = [{ text: 'g' }];

          let salt = row.nutritionValues2[0].text.replace(/\n/g, '').replace(/.* фибри – (.*)/, '$1').replace(/^((?:\S+\s+){1}\S+).*/, '$1');
          salt = salt.split('; белтъчини')[0];
          row.saltPerServing = [{ text: salt }];
          row.saltPerServingUom = [{ text: 'g' }];
        }
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
