/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const cleanUp = (data) => {
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

  const tmp_desc = '';
  const state = context.getState();
  let index = state.index || 0;
  for (const { group } of data) {
    for (const row of group) {
      if (row.ratingCount) {
        let rating_count = [];
        row.ratingCount.forEach(item => {
          rating_count = item.text.split(' ');
        });

        row.ratingCount = [{ text: rating_count[0], xpath: row.ratingCount[0].xpath }];
      }
      if (row.description) {
        const description_ar = [];
        row.description.forEach(item => {
          item.text = item.text.replace(/Style Code.*/g, '').trim();
          description_ar.push(item.text);
        });
        if (description_ar.length) {
          row.description = [{ text: description_ar.join(), xpath: row.description[0].xpath }];
        }
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          item.text = item.text.replace(/(\s*)+/g, '').trim();
          item.text = item.text.replace('StyleCode:', '').trim();
        });
      }
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace(/op_usm=0.9.*/g, '').trim();
          item.text = item.text + 'op_usm=0.9';
        });
      }

      if (row.sku) {
        row.sku.forEach(item => {
          item.text = item.text.replace(/(\s*)+/g, '').trim();
          item.text = item.text.replace('StyleCode:', '').trim();
        });
      }

      if (row.aggregateRating) {
        let counter = 0;
        row.aggregateRating.forEach(item => {
          if (item.text.trim() == 'TTteaser__icon--full') {
            counter = counter + 1;
          } else if (item.text.trim() == 'TTteaser__icon--half') {
            counter = counter + 0.5;
          }
        });
        row.aggregateRating = [{ text: counter.toFixed(1), xpath: row.aggregateRating[0].xpath }];
      }
      if (row.nameExtended) {
        const info = [];
        row.nameExtended.forEach(item => {
          item.text = item.text;
          info.push(item.text);
        });
        row.nameExtended = [{ text: info.join(' '), xpath: row.nameExtended[0].xpath }];
      }
      if (row.variantInformation) {
        const info = [];
        row.variantInformation.forEach(item => {
          item.text = item.text.replace(/[_]+/g, ' ');
          info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
        });
        if (tmp_desc != '') {
          info.push(tmp_desc);
        }
        row.variantInformation = [{ text: info.join(' | '), xpath: row.variantInformation[0].xpath }];
      }
      if (row.additionaldescbulletinfo) {
        const info = [];
        row.additionaldescbulletinfo.forEach(item => {
          info.push(item.text.replace(/(\s*\n\s*)+/g, ' || ').trim());
        });
        if (tmp_desc != '') {
          info.push(tmp_desc);
        }
        row.additionaldescbulletinfo = [{ text: info.join(' || '), xpath: row.additionaldescbulletinfo[0].xpath }];
      }
      if (row.gtin) {
        let productId = [];
        let formattedString = '';
        row.gtin.forEach(item => {
          formattedString = /[^/]*$/.exec(item.text)[0];
          productId = formattedString.split('?');
          productId[0] = productId[0].replace('_main', '');
        });
        row.gtin = [{ text: productId[0], xpath: row.gtin[0].xpath }];
      }
      if (row.eangtin) {
        let productId = [];
        let formattedString = '';
        row.eangtin.forEach(item => {
          formattedString = /[^/]*$/.exec(item.text)[0];
          productId = formattedString.split('?');
          productId[0] = productId[0].replace('_main', '');
        });
        row.eangtin = [{ text: productId[0], xpath: row.eangtin[0].xpath }];
      }
      if (row.videoLength) {
        let productId = [];
        let formattedString = '';
        row.videoLength.forEach(item => {
          formattedString = /[^/]*$/.exec(item.text)[0];
          productId = formattedString.split('/');
          productId[0] = (productId[0]).trim();
        });
        row.videoLength = [{ text: productId[0], xpath: row.videoLength[0].xpath }];
      }
      if (row.video) {
        row.video.forEach(item => {
          item.text = item.text.replace('blob:', '');
        });
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          if (item.text.trim().includes('Add to Bag')) {
            item.text = 'In Stock';
          } else {
            item.text = 'Out of Stock';
          }
        });
      }

      if (row.firstVariant) {
        let data = [];
        row.firstVariant.forEach(item => {
          data = item.text.split('= ');
          item.text = data[1].replace(';', '').trim();
          const data1 = JSON.parse(item.text);
          if (data1.products) {
            if (data1.products[0].skus[index]) {
              item.text = data1.products[0].skus[index].sku;
              row.variantId = row.firstVariant;
            } else {
              item.text = '';
            }
          } else {
            item.text = '';
          }
        });
      }
      if (row.variants) {
        let data = [];
        const info = [];
        row.variants.forEach(item => {
          data = item.text.split('= ');
          item.text = data[1].replace(';', '').trim();
          const data1 = JSON.parse(item.text);
          if (data1.products[0].skus[1]) {
            data1.products[0].skus.forEach(product => {
              item.text = product.sku;
              info.push(item.text.trim());
            });
          } else {
            item.text = '';
          }
        });
        row.variants = [{ text: info.join(' | '), xpath: row.variants[0].xpath }];
      }
      if (row.mpc) {
        row.mpc.forEach(item => {
          const data = item.text.split('\n');
          const data1 = JSON.parse(data[0]);
          if (data1.mpn) {
            item.text = data1.mpn;
          } else {
            item.text = '';
          }
        });
      }
      index++;
    }
  }
  context.setState({ index });
  return cleanUp(data);
};

module.exports = { transform };
