/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
  for (const { group } of data) {
    for (const row of group) {
      // if (row.totalCarbPerServing) {
      //   row.totalCarbPerServing.forEach(item => {
      //     item.text = item.text.replace(',', '.');
      //   });
      // }
      // if (row.saturatedFatPerServing) {
      //   row.saturatedFatPerServing.forEach(item => {
      //     item.text = item.text.replace(',', '.');
      //   });
      // }
      // if (row.proteinPerServing) {
      //   row.proteinPerServing.forEach(item => {
      //     item.text = item.text.replace(',', '.');
      //   });
      // }
      // if (row.totalFatPerServing) {
      //   row.totalFatPerServing.forEach(item => {
      //     item.text = item.text.replace(',', '.');
      //   });
      // }
      // if (row.calciumPerServing) {
      //   row.calciumPerServing.forEach(item => {
      //     item.text = item.text.replace(',', '.');
      //   });
      // }
      // if (row.caloriesPerServing) {
      //   row.caloriesPerServing.forEach(item => {
      //     item.text = item.text.replace(',', '.');
      //   });
      // }
      // if (row.saltPerServing) {
      //   row.saltPerServing.forEach(item => {
      //     item.text = item.text.replace(',', '.');
      //   });
      // }
      // if (row.totalSugarsPerServing) {
      //   row.totalSugarsPerServing.forEach(item => {
      //     item.text = item.text.replace(',', '.');
      //   });
      // }
      // if (row.dietaryFibrePerServing) {
      //   row.dietaryFibrePerServing.forEach(item => {
      //     item.text = item.text.replace(',', '.');
      //   });
      // }
      if (!row.image) {
        if (row.image2) {
          row.image = [{ text: row.image2[0].text }];
          delete row.image2;
        }
        if (row.imageAlt2) {
          row.imageAlt = [{ text: row.imageAlt2[0].text }];
          delete row.imageAlt2;
        }
      }
      if (row.description) {
        var arrDesc = [];
        row.description.forEach(item => {
          arrDesc.push(item.text);
        });
        row.description = [{ text: arrDesc.join(' ') }];
      }
      if (row.sku) {
        row.sku.forEach(item => {
          item.text = item.text.replace('id=', '');
          item.text = item.text.trim();
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          item.text = item.text.replace('id=', '');
          item.text = item.text.trim();
        });
      }
      if (row.pricePerUnit) {
        row.pricePerUnit.forEach(item => {
          item.text = item.text.replace('(', '');
          item.text = item.text.replace(')', '');
          item.text = item.text.trim();
        });
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };