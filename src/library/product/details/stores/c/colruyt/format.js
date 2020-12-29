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
      if (row.price) {
        row.price.forEach((priceItem) => {
          priceItem.text = priceItem.text.replace('/pc.', '').replace(',', '.');
        });
      }
      if (row.servingSize) {
        row.servingSize.forEach((servingSizeItem) => {
          servingSizeItem.text = servingSizeItem.text.replace('Quantité moyenne de minéraux par 100g/100ml', '100ml').replace(/[^\d]/gm, '').trim();
        });
      }
      if (row.servingSizeUom) {
        row.servingSizeUom.forEach((servingSizeUomItem) => {
          servingSizeUomItem.text = servingSizeUomItem.text.replace('Valeur nutritive moyenne par', '').replace('Quantité moyenne de minéraux par 100g/100ml', '100ml').replace(/[\d.]/gm, '').trim();
        });
      }
      if (row.sodiumPerServing) {
        row.sodiumPerServing.forEach((sodiumPerServingItem) => {
          sodiumPerServingItem.text = sodiumPerServingItem.text.replace(/[A-Za-z]/gm, '').trim();
        });
      }
      if (row.sodiumPerServingUom) {
        row.sodiumPerServingUom.forEach((sodiumPerServingUomItem) => {
          sodiumPerServingUomItem.text = sodiumPerServingUomItem.text.replace(/[\d.]/gm, '').trim();
        });
      }
      if (row.sku) {
        row.sku.forEach((skuItem) => {
          skuItem.text = skuItem.text.replace(/[^\d]/gm, '');
        });
      }
      if (row.variantId) {
        row.variantId.forEach((variantIdItem) => {
          variantIdItem.text = variantIdItem.text.replace(/[^\d]/gm, '');
        });
      }
      if (row.caloriesPerServing) {
        row.caloriesPerServing.forEach((caloriesPerServingItem) => {
          caloriesPerServingItem.text = caloriesPerServingItem.text.replace(/[A-Za-z]/gm, '').replace('<', '').trim();
        });
      }
      if (row.caloriesPerServingUom) {
        row.caloriesPerServingUom.forEach((caloriesPerServingUomItem) => {
          caloriesPerServingUomItem.text = caloriesPerServingUomItem.text.replace(/[\d.]/gm, '').replace('<', '').trim();
        });
      }
      if (row.calciumPerServing) {
        row.calciumPerServing.forEach((calciumPerServingItem) => {
          calciumPerServingItem.text = calciumPerServingItem.text.replace(/[A-Za-z]/gm, '').replace('<', '').trim();
        });
      }
      if (row.calciumPerServingUom) {
        row.calciumPerServingUom.forEach((calciumPerServingUomItem) => {
          calciumPerServingUomItem.text = calciumPerServingUomItem.text.replace(/[\d.]/gm, '').replace('<', '').trim();
        });
      }
      if (row.totalFatPerServing) {
        row.totalFatPerServing.forEach((totalFatPerServingItem) => {
          totalFatPerServingItem.text = totalFatPerServingItem.text.replace(/[A-Za-z]/gm, '').replace('<', '').trim();
        });
      }
      if (row.totalFatPerServingUom) {
        row.totalFatPerServingUom.forEach((totalFatPerServingUomItem) => {
          totalFatPerServingUomItem.text = totalFatPerServingUomItem.text.replace(/[\d.]/gm, '').replace('<', '').trim();
        });
      }
      if (row.saturatedFatPerServing) {
        row.saturatedFatPerServing.forEach((saturatedFatPerServingItem) => {
          saturatedFatPerServingItem.text = saturatedFatPerServingItem.text.replace(/[A-Za-z]/gm, '').replace('<', '').trim();
        });
      }
      if (row.saturatedFatPerServingUom) {
        row.saturatedFatPerServingUom.forEach((saturatedFatPerServingUomItem) => {
          saturatedFatPerServingUomItem.text = saturatedFatPerServingUomItem.text.replace(/[\d.]/gm, '').replace('<', '').trim();
        });
      }
      if (row.totalCarbPerServing) {
        row.totalCarbPerServing.forEach((totalCarbPerServingItem) => {
          totalCarbPerServingItem.text = totalCarbPerServingItem.text.replace(/[A-Za-z]/gm, '').replace('<', '').trim();
        });
      }
      if (row.totalCarbPerServingUom) {
        row.totalCarbPerServingUom.forEach((totalCarbPerServingUomItem) => {
          totalCarbPerServingUomItem.text = totalCarbPerServingUomItem.text.replace(/[\d.]/gm, '').replace('<', '').trim();
        });
      }
      if (row.totalSugarsPerServing) {
        row.totalSugarsPerServing.forEach((totalSugarsPerServingItem) => {
          totalSugarsPerServingItem.text = totalSugarsPerServingItem.text.replace(/[A-Za-z]/gm, '').replace('<', '').trim();
        });
      }
      if (row.totalSugarsPerServingUom) {
        row.totalSugarsPerServingUom.forEach((totalSugarsPerServingUomItem) => {
          totalSugarsPerServingUomItem.text = totalSugarsPerServingUomItem.text.replace(/[\d.]/gm, '').replace('<', '').trim();
        });
      }
      if (row.proteinPerServing) {
        row.proteinPerServing.forEach((proteinPerServingItem) => {
          proteinPerServingItem.text = proteinPerServingItem.text.replace(/[A-Za-z]/gm, '').replace('<', '').trim();
        });
      }
      if (row.proteinPerServingUom) {
        row.proteinPerServingUom.forEach((proteinPerServingUomItem) => {
          proteinPerServingUomItem.text = proteinPerServingUomItem.text.replace(/[\d.]/gm, '').replace('<', '').trim();
        });
      }
      if (row.saltPerServing) {
        row.saltPerServing.forEach((saltPerServingItem) => {
          saltPerServingItem.text = saltPerServingItem.text.replace(/[A-Za-z]/gm, '').replace('<', '').trim();
        });
      }
      if (row.saltPerServingUom) {
        row.saltPerServingUom.forEach((saltPerServingUomItem) => {
          saltPerServingUomItem.text = saltPerServingUomItem.text.replace(/[\d.]/gm, '').replace('<', '').trim();
        });
      }
      if (row.magnesiumPerServing) {
        row.magnesiumPerServing.forEach((magnesiumPerServingItem) => {
          magnesiumPerServingItem.text = magnesiumPerServingItem.text.replace(/[A-Za-z]/gm, '').replace('<', '').trim();
        });
      }
      if (row.magnesiumPerServingUom) {
        row.magnesiumPerServingUom.forEach((magnesiumPerServingUomItem) => {
          magnesiumPerServingUomItem.text = magnesiumPerServingUomItem.text.replace(/[\d.]/gm, '').replace('<', '').trim();
        });
      }
      if (row.image) {
        row.image.forEach((imageItem) => {
          imageItem.text = imageItem.text.includes('http') ? imageItem.text : 'https:' + imageItem.text;
        });
      }
      if (row.pricePerUnitUom) {
        row.pricePerUnitUom.forEach((pricePerUnitUomItem) => {
          pricePerUnitUomItem.text = pricePerUnitUomItem.text.replace('/pc.', '/pc');
        });
      }
      if (row.pricePerUnit) {
        row.pricePerUnit.forEach((pricePerUnitItem) => {
          pricePerUnitItem.text = pricePerUnitItem.text.replace('/pc.', '').replace(',', '.');
        });
      }
      if (row.description) {
        row.description.forEach((descriptionItem) => {
          descriptionItem.text = descriptionItem.text.replace(/\s+$/, '').trim();
        });
      }
      data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }))));
    }
  }
  return data;
};
module.exports = { transform };
