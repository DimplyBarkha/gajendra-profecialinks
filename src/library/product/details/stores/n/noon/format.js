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
      if (row.sku) {
        row.sku.forEach(item => {
          item.text = item.text.replace(/.+\/(.+?)_.+/g, '$1').trim();
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          item.text = item.text.replace(/.+\/(.+?)_.+/g, '$1').trim();
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          var matches = /\s*(\d+)/isg.exec(item.text);
          if (matches) {
            item.text = matches[1]
          } else {
            delete row.ratingCount;
          }
        });
      }
      if (row.specifications) {
        let info = [];
        row.specifications.forEach(item => {
          info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());
        });
        row.specifications = [{ 'text': info.join(' || '), 'xpath': row.specifications[0].xpath }];
      }
      if (row.additionalDescBulletInfo) {
        var add_desc_bullet_info = [];
        row.additionalDescBulletInfo.forEach(item => {
          add_desc_bullet_info.push(item.text);
        });
        if (add_desc_bullet_info.length) {
          row.additionalDescBulletInfo = [{ "text": "|| " + add_desc_bullet_info.join(" || ") }];
        }
      }
      if (row.mpc) {
        row.mpc.forEach(item => {
          item.text = item.text.replace('Model Number: ', '');
        });
      }
      if (row.variants) {
        var arr_info = [];
        row.variants.forEach(item => {
          item.text = item.text.replace(/.+\/(.+?)_.+/g, '$1').trim();
          arr_info.push(item.text)
        });
        if (arr_info.length) {
          row.variants = [{ text: arr_info.join(' | ') }];
          row.firstVariant = row.variantId;
          row.variantCount = [{ text: arr_info.length }];
        }
      }
      if (row.variantInformation) {
        var arr_info = [];
        row.variantInformation.forEach(item => {
          arr_info.push(item.text)
        });
        row.variantInformation = [{ text: arr_info.join(' | ') }];
      }
      if (row.nameExtended) {
        var temp_brand = ''
        if (row.brandText) (
          row.nameExtended[0].text = row.brandText[0].text + ' - ' + row.nameExtended[0].text
        )
      }
      if (row.alternateImages) {
        if (row.alternateImages.length > 1) {
          row.alternateImages.splice(0, 1);
        } else {
          delete row.alternateImages;
        }
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };