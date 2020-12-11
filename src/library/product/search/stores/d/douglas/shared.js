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
      if (row.variantUrl) {
        const variantUrl1 = [];
        row.variantUrl.forEach(item => {
          if (item.text.indexOf('https:') === -1) {
            item.text = `https://www.euro.com.pl${item.text}`;
          }
        });
      }
      if (row.specifications) {
        const specs = [];
        let newTxt = '';
        let cnt = 0;
        row.specifications.forEach(item => {
          specs[0] = item;
          item.text = item.text.replace(/(\s?\n)+/g, ' ');
          if (cnt > 0) newTxt = newTxt + ' || ' + item.text;
          else newTxt = newTxt + item.text;
          cnt++;
        });
        specs.forEach(item => {
          item.text = newTxt;
        });
        row.specifications = specs;
      }
      if (row.videos) {
        const video = [];
        let dupUrl = '';
        let urls = [];
        row.videos.forEach(item => {
          console.log('item:: ', item.text);
          urls = row.videos.filter(it => item.text === it.text);
          if (urls && urls.length === 1) {
            video.push(item);
          } else {
            if (dupUrl !== item.text) {
              dupUrl = item.text;
              video.push(item);
            }
          }
        });
        row.videos = video;
      }

      if (row.manufacturerDescription) {
        const manufacturerDescriptions = [];
        let dupUrl = '';
        let urls = [];
        row.manufacturerDescription.forEach(item => {
          console.log('item:: ', item.text);
          urls = row.manufacturerDescription.filter(it => item.text === it.text);
          if (urls && urls.length === 1) {
            manufacturerDescriptions.push(item);
          } else {
            if (dupUrl !== item.text) {
              dupUrl = item.text;
              manufacturerDescriptions.push(item);
            }
          }
        });
        row.manufacturerDescription = manufacturerDescriptions;
      }

      if (row.manufacturerImages) {
        const manufacturerImage = [];
        let dupUrl = '';
        let urls = [];
        row.manufacturerImages.forEach(item => {
          console.log('item:: ', item.text);
          urls = row.manufacturerImages.filter(it => item.text === it.text);
          if (urls && urls.length === 1) {
            manufacturerImage.push(item);
          } else {
            if (dupUrl !== item.text) {
              dupUrl = item.text;
              manufacturerImage.push(item);
            }
          }
        });
        row.manufacturerImages = manufacturerImage;
      }
      if (row.variants) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.variants.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + '|';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.variants = nDesc;
      }

      if (row.description) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.description.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + '|';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.description = nDesc;
      }

      if (row.variantInformation) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.variantInformation.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + ',';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.variantInformation = nDesc;
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
    }
  }
  // clean data
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};
module.exports = { transform };
