
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
          item.text = item.text.replace(/\n\s*\n\s*\n\s*\n\s*/g, ' || ').trim();
          item.text = item.text.replace(/\n\s*\n\s*/g, ' : ').trim();
          item.text = item.text.replace(/\s*:\s*/g, ' : ').trim();
          arrSpec.push(item.text);
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
            item.text = 'https:' + item.text;
          }
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'https:' + item.text;
          }
        });
      }
      if (row.brandLink) {
        row.brandLink.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'https:' + item.text;
          }
        });
      }
      if (row.variants) {
        var arrVariants = [];
        row.variants.forEach(item => {
          var data = JSON.parse(item.text);
          data.forEach(variation => {
            var tempSrc = variation.src;
            tempSrc = tempSrc.replace(/.+75x75\/\d+\/\d+\//g, '');
            tempSrc = tempSrc.replace(/_.+/g, '');
            arrVariants.push(tempSrc);
            if (variation.active) {
              row.variantInformation = [{ text: variation.alt }];
            }
          });
        });
        row.variants = [{ text: arrVariants.join(' | ') }];
        row.variantCount = [{ text: arrVariants.length }];
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };