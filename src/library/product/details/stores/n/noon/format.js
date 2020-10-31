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
    for (let row of group) {
      if (row.sku) {
        row.sku.forEach(item => {
          var myRegexp = /.+\/(.+?)_.+/g;
          var match = myRegexp.exec(item.text);
          if (match.length) {
            item.text = match[1].trim();
          } else {
            delete row.sku;
          }
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          var myRegexp = /.+\/(.+?)_.+/g;
          var match = myRegexp.exec(item.text);
          if (match.length) {
            item.text = match[1].trim();
          } else {
            delete row.variantId;
          }
        });
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          var brandText = '';
          row.brandText.forEach(item => {
            brandText = item.text;
          });
          item.text = brandText + ' - ' + item.text;
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
        var additional_desc_b_info = [];
        row.additionalDescBulletInfo.forEach(item => {
          additional_desc_b_info.push(item.text);
        });
        if (additional_desc_b_info.length) {
          row.additionalDescBulletInfo = [{ "text": "|| " + additional_desc_b_info.join(" || ") }];
        }
      }
      if (row.manufacturerImages) {
        var m_images = [];
        row.manufacturerImages.forEach(item => {
          m_images.push(item.text);
        });
        if (m_images.length) {
          row.manufacturerImages = [{ "text": m_images.join(" | ") }];
        }
      }      
      if (row.mpc) {
        row.mpc.forEach(item => {
          item.text = item.text.replace('Model Number: ', '');
        });
      }
      if (row.alternateImages) {
        if (row.alternateImages.length > 1) {
          row.alternateImages.splice(0, 1);
        } else {
          delete row.alternateImages;
        }
      }
      if (row.variantCount) {
        row.variantCount = [{ "text": row.variantCount.length }];
      }
      if (row.variants) {
        var allvariantsArr = [];
        row.variants.forEach(item => {
          var myRegexp = /.+\/(.+?)_.+/g;
          var match = myRegexp.exec(item.text);
          if (match.length) {
            allvariantsArr.push(match[1].trim());
          }
        });
        if (allvariantsArr.length) {
          row.variants = [{ "text": allvariantsArr.join(' | ') }];
          row.firstVariant = [{"text": row.variantId[0]["text"]}];
        }
      }
    }
  }
  cleanUp(data);
  return data;
};

module.exports = { transform };