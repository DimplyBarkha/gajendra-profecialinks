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
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -3),
          },
        ];
      }

      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `|| ${item.text.replace(/\n \n/g, ':')} `;
        });
        row.additionalDescBulletInfo = [
          {
            text: text.slice(0, -1),
          },
        ];
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
      if (row.alternateImages) {
        //const variantUrls = [];
        let imgUrls = [];
        //let dupUrl = '';
        let urls = [];
        row.alternateImages.forEach(item => {
          // console.log('item:: ', item.text);
          urls = row.alternateImages.filter(it => item.text === it.text);
          //console.log('imgUrls.indexOf(item):: ', imgUrls.indexOf(item.text));
          if (imgUrls.indexOf(item.text) == -1) {
            imgUrls.push(item.text);
          }
          //console.log('imgUrls:: ', imgUrls);
          // if (urls && urls.length === 1) {
          //   variantUrls.push(item);
          // } else {
          //   if (variantUrls.indexOf() !== item.text) {
          //     dupUrl = item.text;
          //     variantUrls.push(item);
          //   }
          // }
        });
        // row.alternateImages = variantUrls;
        row.alternateImages = [
          imgUrls.map((e) => {
            return { text: e }

          })

        ]
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

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} `;
        });
        row.description = [
          {
            text: text.slice(0, -4),
          },
        ];
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

      if (row.description) {
        const descs = [];
        let newTxt = '';
        let cnt = 0;
        row.description.forEach(item => {
          descs[0] = item;
          item.text = item.text.replace(/(\s?\n)+/g, ' ').trim();
          if (cnt > 0) newTxt = newTxt + '||' + item.text;
          else newTxt = newTxt + item.text;
          cnt++;
        });
        descs.forEach(item => {
          item.text = newTxt;
        });
        row.description = descs;
      }
      if (row.aggregateRating) {
        row.aggregateRating = [
          {
            text: row.aggregateRating[0].text.replace('.', ','),
          },
        ];
      }
      // if (row.alternateImages) {
      //   const images = row.alternateImages.filter(img => !img.text.match('#'));
      //   row.alternateImages = images;
      // }

    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };