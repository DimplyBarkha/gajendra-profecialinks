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

  console.log('transform called now');
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        console.log('transform specs now');
        let text = '';
        row.specifications.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n{1,}/g, ' ').trim() + ' || ';
        });
        row.specifications = [
          {
            text: text,
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
        // row.variantId = variantIds;
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
        for (const item of row.videos) {
          if (item.text.includes('.hls.m3u8')) {
            item.text = item.text.replace('.hls.m3u8', '.mp4.480.mp4');
          }
        }
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

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += item.text.replace(/\n \n/g, ' || ');
        });
        row.description = [
          {
            text: text + '  ' + myDesc,
          },
        ];
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = text + ' ' + item.text.replace(/\s{2,}/g, ' ').replace(/\n \n \n/g, ' ').replace(/\n \n/g, ' ').trim();
          // text = text + (text ? ' ' : '') + item.text;
        });
        row.manufacturerDescription = [{ text }];
      }
      if (row.specifications) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.specifications.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + '||';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.specifications = nDesc;
      }
    }
  }
  // const clean = text => text.toString()
  //   .replace(/\r\n|\r|\n/g, ' ')
  //   .replace(/&amp;nbsp;/g, ' ')
  //   .replace(/&amp;#160/g, ' ')
  //   .replace(/\u00A0/g, ' ')
  //   .replace(/\s{2,}/g, ' ')
  //   .replace(/"\s{1,}/g, '"')
  //   .replace(/\s{1,}"/g, '"')
  //   .replace(/^ +| +$|( )+/g, ' ')
  //   // eslint-disable-next-line no-control-regex
  //   .replace(/[\x00-\x1F]/g, '')
  //   .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  // data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
  //   el.text = clean(el.text);
  // }))));

  return data;
};

module.exports = { transform };
