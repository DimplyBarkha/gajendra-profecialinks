/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const clean = text => text && text.toString()
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

  console.log('transform called now');
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        console.log('transform specs now');
        let text = '';
        row.specifications.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n{1,}/g, ' ').trim() + ' ';
        });
        row.specifications = [
          {
            text: text.trim(),
          },
        ];
      }
      if (row.manufacturerImages) {
        const variantIds = [];
        let dup = '';
        let urls = [];
        row.manufacturerImages.forEach(item => {
          urls = row.manufacturerImages.filter(it => item.text === it.text);
          if (urls && urls.length === 1) {
            variantIds.push(item);
          } else {
            if (dup !== item.text) {
              dup = item.text;
              variantIds.push(item);
            }
          }
        });
        row.manufacturerImages = variantIds;
      }
      if (row.allergyAdvice) {
        let text = '';
        row.allergyAdvice.forEach(item => {
          text += item.text.replace(/\n/g, '');
        });
        row.allergyAdvice = [
          {
            text: text,
          },
        ];
      }

      if (row.videos) {
        row.videos.forEach(item => {
          if (item.text.includes('.hls.m3u8')) {
            item.text = item.text.replace('.hls.m3u8', '.mp4.480.mp4');
          }
        });
      }

      let myDesc = '';
      if (row.myDescription) {
        for (const item of row.myDescription) {
          myDesc += clean(item.text);
        }
      }

      if (row.variantId) {
        for (const item of row.variantId) {
          const arr = item.text.split(' ');
          if (arr.length > 1) {
            item.text = arr[1];
          }
        }
      }

      if (row.variantInformation) {
        let text = '';
        if (row.variantInformation.length > 1) {
          row.variantInformation.forEach(item => {
            item.text = item.text.replace(/[0-9]\s/g, ' ').trim();
            text += `${item.text} | `;
          });
          row.variantInformation = [{ text: text.slice(0, -3) }];
        } else {
          row.variantInformation = [{ text: '' }];
        }
        row.variants = [
          {
            text: row.variantId[0].text,
          },
        ];
      }

      if (row.sku) {
        for (const item of row.sku) {
          item.text = item.text.replace('Model ', '');
        }
      }
      if (row.mpc) {
        for (const item of row.mpc) {
          item.text = item.text.replace('Model ', '');
        }
      }

      if (row.myPrice) {
        row.price = row.myPrice;
      } else {
        if (row.price && row.price.length) {
          let text = '';
          row.price.forEach(item => {
            text = text + item.text;
          });
          row.price = [{ text: text }];
        }
      }

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += item.text.replace(/\n \n/g, ' || ');
        });
        row.description = [
          {
            text: text + ' ' + myDesc,
          },
        ];
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = text + ' ' + item.text.replace(/\s{2,}/g, ' ').replace(/\n \n \n/g, ' ').replace(/\n \n/g, ' ').trim();
          // text = text + (text ? ' ' : '') + item.text;
        });
        row.manufacturerDescription = [{ text: text.trim() }];
      }
      if (row.specifications) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.specifications.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + ' ';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.specifications = nDesc;
      }
      if (row.listPrice && row.listPrice.length) {
        let text = '';
        row.listPrice.forEach(item => {
          text += item.text;
        });
        row.listPrice = [{ text }];
        if (row.listPrice && row.listPrice.length && row.price && row.price.length) {
          if (row.listPrice[0].text === row.price[0].text) {
            row.listPrice.pop();
          }
        }
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };
