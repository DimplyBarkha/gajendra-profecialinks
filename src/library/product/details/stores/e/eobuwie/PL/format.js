
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
          arrSpec.push(item.text);
          item.text = item.text.replace(/\n\s*\n\s*\n\s*\n\s*/g, ' || ').trim();
          item.text = item.text.replace(/\n\s*\n\s*/g, ' : ').trim();
          item.text = item.text.replace(/\s*:\s*/g, ' : ').trim();
        });
        row.specifications = [{ text: arrSpec.join(' || ') }];
      }
      // if (row.additionalDescBulletInfo) {
      //   let bullet_info = [];
      //   row.additionalDescBulletInfo.forEach(item => {
      //     bullet_info.push(item.text);
      //   });
      //   if (bullet_info.length) {
      //     row.additionalDescBulletInfo = [{ "text": "| " + bullet_info.join(" | ") }];
      //   }
      // }
      // if (row.category) {
      //   var category_arr = [];
      //   row.category.forEach(item => {
      //     var category = item.text.replace(/\s*\n\s*\n\s*/g, '').trim();
      //     category_arr = category.split(" >");
      //     category_arr.splice(0, 1);
      //     category_arr.splice(category_arr.length - 1, 1);
      //   });
      //   if (category_arr.length) {
      //     row.category = [];
      //     category_arr.forEach(item => {
      //       row.category.push({ "text": item });
      //     });
      //   }
      // }
      if (row.image) {
        row.image.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'http' + item.text;
          }
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'http' + item.text;
          }
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
      //   if (color) {
      //     row.color = [{ "text": color }];
      //   }
      //   if (variations.length) {
      //     row.variantCount = [{ "text": variations.length }];
      //     row.variants = [{ "text": variations.join(' | ') }];
      //   } else {
      //     delete row.variants;
      //     row.variantCount = [{ "text": 0 }];
      //   }
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