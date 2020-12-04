
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
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(':', '.').trim();
        });
      }
      if (row.image) {
        var tempImage = row.image[0].text;
        var arrVal = tempImage.split(',');
        if (arrVal.length === 2) {
          tempImage = arrVal[1];
        }
        if (arrVal.length === 1) {
          tempImage = arrVal[0];
        }
        tempImage = tempImage.replace('2x', '');
        tempImage = tempImage.trim();
        if (tempImage) {
          row.image = [{ text: tempImage }];
        }
      }
      if (row.description) {
        var arrBullets = [];
        row.description.forEach(item => {
          arrBullets.push(item.text);
        });
        if (arrBullets.length) {
          row.description = [{ text: arrBullets.join(' ') }];
        }
      }
      if (row.sku) {
        var scriptJSON = JSON.parse(row.sku[0].text);
        if (scriptJSON.id) {
          row.variantId = row.sku = [{ text: scriptJSON.id }];
        }
      }
      if (row.nutrients) {
        row.nutrients.forEach(item => {
          var match = item.text.match(/Energie\s*([\d|\.]+)(.+?),/);
          if (match) {
            row.caloriesPerServing = [{ text: match[1].trim() }];
            // row.caloriesPerServingUOM = [{ text: match[2].trim() }];
          }
          match = item.text.match(/Vetten\s*([\d|\.]+)(.+?),/);
          if (match) {
            row.totalFatPerServing = [{ text: match[1].trim() }];
            row.totalFatPerServingUom = [{ text: match[2].trim() }];
          }
          match = item.text.match(/Koolhydraten\s*([\d|\.]+)(.+?),/);
          if (match) {
            row.totalCarbPerServing = [{ text: match[1].trim() }];
            row.totalCarbPerServingUom = [{ text: match[2].trim() }];
          }
          match = item.text.match(/Eiwitten\s*([\d|\.]+)(.+?),/);
          if (match) {
            row.proteinPerServing = [{ text: match[1].trim() }];
            row.proteinPerServingUom = [{ text: match[2].trim() }];
          }
          match = item.text.match(/Suikers\s*([\d|\.]+)(.+?),/);
          if (match) {
            row.totalSugarPerServing = [{ text: match[1].trim() }];
            row.totalSugarPerServingUom = [{ text: match[2].trim() }];
          }
          match = item.text.match(/Zout\s*([\d|\.]+)(.+?),/);
          if (match) {
            row.saltPerServing = [{ text: match[1].trim() }];
            row.saltPerServingUom = [{ text: match[2].trim() }];
          }
          match = item.text.match(/Voedingsvezel\s*([\d|\.]+)(.+?),/);
          if (match) {
            row.dietaryFibrePerServing = [{ text: match[1] }];
            row.dietaryFibrePerServingUom = [{ text: match[2] }];
          }
        });
        delete row.nutrients;
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
