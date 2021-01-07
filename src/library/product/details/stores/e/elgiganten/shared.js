/* eslint-disable no-unused-vars */
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
      if (row.manufacturerImages) {
        let text = '';
        row.manufacturerImages.forEach((item, index) => {
          text = item.text.replace('?$prod_tnsm$', '');
          row.manufacturerImages[index].text = text;
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

      if (row.unInterruptedPDP) {
        const unInterruptedPDPs = [];
        let dup = '';
        let urls = [];
        row.varianunInterruptedPDPtId.forEach(item => {
          // console.log('item:: ', item.text);
          urls = row.unInterruptedPDP.filter(it => item.text === it.text);
          if (urls && urls.length === 1) {
            unInterruptedPDPs.push(item);
          } else {
            if (dup !== item.text) {
              dup = item.text;
              unInterruptedPDPs.push(item);
            }
          }
        });
        row.unInterruptedPDP = unInterruptedPDPs;
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

      if (row.weightNet) {
        if (row.weightNet.length > 1) {
          let text = '';
          const weightRec = [];
          weightRec.push(row.weightNet[0]);
          let weight;
          row.weightNet.forEach(item => {
            text = item.text.trim();
            const startIdx = text.indexOf('vikt');
            if (startIdx > -1) {
              weight = text.split('vikt:')[1];
              weightRec[0].text = weight.trim();
            }
          });
          row.weightNet = weightRec;
        }
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

      if (row.shippingDimensions) {
        let text = '';
        row.shippingDimensions.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} | `;
        });
        row.shippingDimensions = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.videos) {
        const video = [];
        row.videos.forEach(item => {
          if (item.text.indexOf('https:') === -1) {
            item.text = `https://www.elgiganten.se${item.text}`;
          }
        });

      //     if (item.text.split('/').length > 1) {
      //       video.push({
      //         text: '' + item.text,
      //         xpath: item.xpath
      //       })
      //     } else {
      //       video.push({
      //         text: 'https://www.youtube.com/watch?v=' + item.text + '&feature=emb_title',
      //         xpath: item.xpath
      //       })
      //     }
        // row.videos = video;
      }
      // if (row.description) {
      //   const nDesc = [];
      //   let description = '';
      //   let idx = 0;
      //   row.description.forEach(item => {
      //     nDesc[0] = item;
      //     if (idx > 0) {
      //       newDesc = newDesc + '||';
      //     }
      //     newDesc = newDesc + item.text;
      //     idx++;
      //   });
      //   nDesc.forEach(item => {
      //     item.text = newDesc;
      //   });
      //   row.description = nDesc;
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

      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.additionalDescBulletInfo = [
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
