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
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  for (const { group } of data) {
    for (const row of group) {
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(item => {
          const locText = item.text;
          if (locText.indexOf('###') > 0) {
            item.text = locText.substring(0, locText.indexOf('###'));
          } else if (locText.indexOf('###') === 0) {
            item.text = locText.replace('###', '');
          }
          console.log(item.text);
        });
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

      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text = text + (text ? ' ' : ' ') + item.text;
        });
        row.additionalDescBulletInfo = [{ text }];
      }

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = text + (text ? ' ' : ' ') + item.text;
        });
        row.description = [{ text }];
      }

      if (row.alternateImages) {
        const images = row.alternateImages.filter(img => !img.text.match('#'));
        row.alternateImages = images;
      }

      if (row.alternateImages) {
        let text = '';
        row.alternateImages.forEach(item => {
          text = text + (text ? ' | ' : ' ') + item.text;
        });
        row.alternateImages = [{ text }];
      }

      if (row.specifications) {
        let text = '';
        for (let i = 0; i < row.specifications.length; i++) {
          text += `${row.specificationsLabel[i].text} : ${row.specifications[i].text} || `;
        }
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
        delete row.specificationsLabel;
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
    el.text = el.text.trim();
  }))));
  return data;
};
module.exports = { transform };
