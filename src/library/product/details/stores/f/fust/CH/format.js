
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
      if (row.specifications) {
        var arrSpec = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n\s*\n\s*/g, ' : ').trim();
          arrSpec.push(item.text);
        });
        row.specifications = [{ text: arrSpec.join(' || ') }];
      }
      if (row.image) {
        row.image.forEach(item => {
          item.text = 'https://www.fust.ch' + item.text;
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(',', '');
          item.text = item.text.replace('.–', '');
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(',', '');
          item.text = item.text.replace('.–', '');
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = 'https://www.fust.ch' + item.text;
        });
      }
      // if (row.variants) {
      //   let variations = [];
      //   let v_info = [];
      //   let color = null;
      //   row.variants.forEach(item => {
      //     let data = JSON.parse(item.text);
      //     if (data['variations']) {
      //       data['variations'].forEach(variation => {
      //         variations.push(variation['sku']);
      //         v_info.push(variation['color']);
      //         if (variation['sku'] == row.sku[0]['text']) {
      //           row.firstVariant = [{ "text": variation['sku'] }];
      //         }
      //       });
      //     }
      //     color = data['attributes']['color'];
      //   });
      //   if (v_info.length) {
      //     row.variantInformation = [{ "text": v_info.join(' | ') }];
      //   }
      // }
      // if (row.nameExtended) {
      //   row.nameExtended.forEach(item => {
      //     item.text = item.text + " - " + row.name[0]["text"];
      //   });
      // }
      // if (row.description) {
      //   let description_ar = [];
      //   row.description.forEach(item => {
      //     description_ar.push(item.text);
      //   });
      //   if (description_ar.length) {
      //     row.description = [{ "text": description_ar.join(" | ") }];
      //   }
      // }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };