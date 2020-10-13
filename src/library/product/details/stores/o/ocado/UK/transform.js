/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.aggregateRating) {
        let text = '';
        row.aggregateRating.forEach(item => {
          item.text = item.raw;
        });
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.description = [{ text }];
      }
      if (row.directions) {
        let text = '';
        row.directions.forEach(item => {
          text = text + (text ? ' || ' : '') + item.text;
        });
        text = text.replace(/:/g, '');
        row.directions = [{ text }];
      }
      if (row.allergyAdvice) {
        let text = '';
        row.allergyAdvice.forEach(item => {
          text = text + (text ? ', ' : '') + item.text;
        });
        text = text.replace(/:/g, '');
        row.allergyAdvice = [{ text }];
      }
      if (row.manufacturer) {
        let text = '';
        row.manufacturer.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        text = text.replace(/\,/g, ' ');
        row.manufacturer = [{ text }];
      }
      if (row.caloriesPerServing) {
        let text = '';
        row.caloriesPerServing.forEach(item => {
          const num = Boolean(item.text.match(/\d+/));
          if (!num) {
            item.text = '';
          }
        });
        row.caloriesPerServing.forEach(item => {
          if (item.text !== '') {
            text = text + (text ? '/' : '') + item.text;
          }
        });
        const values = text.replace(/\/\//g, '/');
        const value = values.split('/');
          if (value[1]) {
            text = value.join('/');
          } else {
            text = value[0];
          }
        row.caloriesPerServing = [{ text }];
      }
      if (!row.sku) {
        row.availabilityText.forEach(item => {
          item.text = '';
        });
        row.metaKeywords.forEach(item => {
          item.text = '';
        });
      }
      const fieldsValue = ['servingSize', 'totalFatPerServing', 'saturatedFatPerServing', 'sodiumPerServing', 'totalCarbPerServing', 'dietaryFibrePerServing', 'totalSugarsPerServing', 'proteinPerServing', 'vitaminAPerServing', 'vitaminCPerServing', 'calciumPerServing', 'ironPerServing', 'magnesiumPerServing', 'saltPerServing'];
      fieldsValue.forEach(item => {
        if (row[item]) {
          let text = '';
          text = text + row[item][0].text;
          row[item] = [{ text }];
        }
      });
      const fieldsUnits = ['servingSizeUom', 'totalFatPerServingUom', 'saturatedFatPerServingUom', 'sodiumPerServingUom', 'totalCarbPerServingUom', 'dietaryFibrePerServingUom', 'totalSugarsPerServingUom', 'proteinPerServingUom', 'vitaminAPerServingUom', 'vitaminCPerServingUom', 'calciumPerServingUom', 'ironPerServingUom', 'magnesiumPerServingUom', 'saltPerServingUom'];
      fieldsUnits.forEach(item => {
        if (row[item]) {
          let text = '';
          const values = row[item][0].text;
          const value = values.split('/');
          if (value[1]) {
            text = value.join('/');
          } else {
            text = value[0];
          }
          row[item] = [{ text }];
        }
      });
      if (row.warnings) {
        let text = '';
        row.warnings.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.warnings = [{ text }];
      }
      if (row.storage) {
        let text = '';
        row.storage.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        const store1 = text.split(':')[0].split('.');
        let value = '';
        for(let i=0; i<store1.length-1; i++){
          value = value + (value ? '. ' : '') + store1[i];
        }
        value += '.';
        row.storage = [{ text: value }];
      }
    }
  }

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
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
