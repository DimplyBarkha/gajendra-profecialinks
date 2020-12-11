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
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.description.forEach(item => {
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
        row.description = nDesc;
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
      // if (row.weightNet) {
      //   if (row.weightNet.length > 1) {
      //     let text = '';
      //     const weightRec = [];
      //     weightRec.push(row.weightNet[0]);
      //     let weight;
      //     row.weightNet.forEach(item => {
      //       text = item.text.trim();
      //       const startIdx = text.indexOf('vikt');
      //       if (startIdx > -1) {
      //         weight = text.split('vikt:')[1];
      //         weightRec[0].text = weight.trim();
      //       }
      //     });
      //     row.weightNet = weightRec;
      //   }
      // }
      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ' ')} | `;
        });
        row.variants = [
          {
            text: text.slice(0, -2),
          },
        ];
      }
      // if (row.aggregateRating) {
      //   row.aggregateRating = [
      //     {
      //       text: Math.round(row.aggregateRating[0].text / 20) ,
      //     },
      //   ];
      // }
      if (row.directions) {
        let text = '';
        row.directions.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} `;
        });
        row.directions = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.warnings) {
        let text = '';
        row.warnings.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} `;
        });
        row.warnings = [
          {
            text: text.slice(0, -1),
          },
        ];
      }    
      if (row.manufacturerImages) {
        let text = '';
        row.manufacturerImages.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} | `;
        });
        row.manufacturerImages = [
          {
            text: text.slice(0, -2),
          },
        ];
      }
      if ((!row.brandText || !row.brandText.length) && row.brandText1) {
        row.brandText = row.brandText1;
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