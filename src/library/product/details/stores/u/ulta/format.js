
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variants) {
        // row.variantCount = [{
        //   text: row.variants.length,
        // }];
        // row.variantInformation = [{
        //   text: row.variantInformation.reduce((item, currentitem) => {
        //     return `${item} | ${currentitem.text}`;
        //   }, '').slice(3),
        // }];
        row.variants = [{
          text: row.variants.reduce((item, currentitem) => {
            return `${item} | ${currentitem.text}`;
          }, '').slice(3),
        }];
      }
      if (row.color){
        row.color = [{ text: row.color[0].text.replace('selected','') }];
      }

      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          if (item.text === 'In Stock') {
            item.text = 'In stock';
          } else if (item.text === 'Out of Stock') {
            item.text = 'Out of stock';
          }
        });
      }
      if (row.specifications) {
        row.specifications = [{
          text: row.specifications.reduce((item, currentitem) => {
            return `${item} || ${currentitem.text}`;
          }, '').slice(4),
        }];
      }
      if (row.manufacturerImages) {
        const uniqueImgs = Array.from(new Set(row.manufacturerImages.map(img => img.text)))
          .map(Text => {
            return row.manufacturerImages.find(img => img.text === Text);
          });
        row.manufacturerImages = uniqueImgs;
      }
      if (row.additionalDescBulletInfo) {
        row.descriptionBullets = [{
          text: row.additionalDescBulletInfo.length,
        }];
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace('$', ' ').trim();
          // console.log("test",item.text);
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace('$', ' ').trim();
        });
      }
      if (row.variantInformation) {
        row.variantInformation.forEach(item => {
          item.text = item.text.replace(' selected', '');
        });
      }
      // if (row.nameExtended) {
      //   row.nameExtended.forEach(item => {
      //     if (item.text.includes('|')) {
      //       item.text = item.text.replace(/(.*?)\s*\|.*/, '$1');
      //     }
      //     if (row.variantInformation) {
      //       if (row.variantInformation[0].text != '') {
      //         item.text = item.text + ' - ' + row.variantInformation[0].text;
      //       }
      //     }
      //   });
      // }
      if (row.quantity) {
        row.quantity.forEach(item => {
          if (item.text.includes(':')) {
            item.text = item.text.slice(6);
          } else {
            item.text = item.text.slice(5);
          }
        });
      }
      if (row.description) {
        let text = '';
        if (row.description[0].text.includes('Key Benefits')) {
          text = row.description[0].text.split('Key Benefits');
          text = text[0].replace(/(\s*\n\s*)+/g, ' ') + 'Key Benefits' + text[1].replace(/(\s*\n\s*)+/g, ' || ');
        } else {
          text = row.description[0].text.replace(/(\s*\n\s*)+/g, ' ');
        }
        row.description = [{
          text: text,
        }];
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
