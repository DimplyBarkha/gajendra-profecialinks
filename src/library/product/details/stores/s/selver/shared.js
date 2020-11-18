/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.image) {
        let text = '';
        row.image.forEach((item, index) => {
          text = item.text.replace('?$prod_all4one$', '');
          row.image[index].text = text;
        });
      }
      if (row.alternateImages) {
        let text = '';
        row.alternateImages.forEach((item, index) => {
          text = item.text.replace('?$prod_all4one$', '');
          row.alternateImages[index].text = text;
        });
      }

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.description = [
          {
            text: text.slice(0, -4),
          },
        ];
      }

      if (row.variantUrl) {
        const variantUrls = [];
        let dupUrl = '';
        let urls = [];
        row.variantUrl.forEach(item => {
          console.log('item:: ', item.text);
          urls = row.variantUrl.filter(it => item.text === it.text);
          if (urls && urls.length === 1) {
            variantUrls.push(item);
          } else {
            if (dupUrl !== item.text) {
              dupUrl = item.text;
              variantUrls.push(item);
            }
          }
        });
        row.variantUrl = variantUrls;
      }

      if (row.variantId) {
        const variantIds = [];
        let dup = '';
        let urls = [];
        row.variantId.forEach(item => {
          // console.log('item:: ', item.text);
          urls = row.variantId.filter(it => item.text === it.text);
          if (urls && urls.length === 1) {
            variantIds.push(item);
          } else {
            if (dup !== item.text) {
              dup = item.text;
              variantIds.push(item);
            }
          }
        });
        row.variantId = variantIds;
      }

      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.price && row.price[0]) {
        row.price[0].text = row.price[0].text.replace(',', '.');
      }
      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ' ')} | `;
        });
        row.variants = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      // if (row.price && row.price[0]) {
      //   row.price[0].text = row.price[0].text.replace(',', '.');
      // }
      if (row.manufacturerImages) {
        let text = '';
        row.manufacturerImages.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} | `;
        });
        row.manufacturerImages = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
