
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
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += ` ${item.text.replace('+', '')}`;
        });
        row.description = [
          {
            text: text.trim(),
          },
        ];
      }
      if (row.variantInformation) {
        let text = '';
        row.variantInformation.forEach(item => {
          text += ` ${item.text}`;
        });
        row.variantInformation = [
          {
            text: text.trim(),
          },
        ];
      }
      if (row.alternateImages) {
        const pdps = [];

        row.alternateImages.forEach(item => {
          console.log('item:: ', item.text);

          if (pdps.indexOf(item.text) === -1) {
            pdps.push(item.text);
          }
        });
        row.alternateImages = pdps.map((el) => {
          return {
            text: el,
          };
        });
      };
      if (row.specifications) {
        const pdps = [];
        row.specifications.forEach(item => {
          // console.log('item:: ', item.text);

          if (pdps.indexOf(item.text) === -1) {
            pdps.push(item.text);
          }
        });
        row.specifications = pdps.map((el) => {
          return {
            text: el,
          };
        });
      }
      if (row.variants) {
        const pdps = [];
        row.variants.forEach(item => {
          // console.log('item:: ', item.text);

          if (pdps.indexOf(item.text) === -1) {
            pdps.push(item.text);
          }
        });
        row.variants = pdps.map((el) => {
          return {
            text: el,
          };
        });
      }
      if ((!row.sku || !row.sku.length) && row.sku1) {
        // console.log('sku1',row.sku1);
        row.sku = row.sku1;
        // console.log("sku", row.sku);
      }
      if ((!row.variantId || !row.variantId.length) && row.variantId1) {
        // console.log('variantId1',row.variantId1);
        row.variantId = row.variantId1;
        // console.log("variantId", row.variantId);
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.replace('Description du produit', '')}`;
        });
        row.description = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.videos) {
        const pdps = [];

        row.videos.forEach(item => {
          // console.log('item:: ', item.text);

          if (pdps.indexOf(item.text) === -1) {
            pdps.push(item.text);
          }
        });
        row.videos = pdps.map((el) => {
          return {
            text: el,
          };
        });
      };
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')}||`;
        });
        row.additionalDescBulletInfo = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')}|`;
        });
        row.variants = [
          {
            text: text.slice(0, -2),
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        let count = 0;
        row.specifications.forEach(item => {
          if (count % 2 === 0) {
            text += `${item.text.replace(/\n \n/g, '')} : `;
          } else {
            text += `${item.text.replace(/\n \n/g, '')} || `;
          }
          count++;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      // if (row.additionalDescBulletInfo) {
      //   let text = '';
      //   let count = 0;
      //   row.additionalDescBulletInfo.forEach(item => {
      //     if (count % 2 === 0) {
      //       text += `${item.text.replace(/\n \n/g, '')} : `;
      //     } else {
      //       text += `${item.text.replace(/\n \n/g, '')} || `;
      //     }
      //     count++;
      //   });
      //   row.additionalDescBulletInfo = [
      //     {
      //       text: text.slice(0, -4),
      //     },
      //   ];
      // }
    }
  }

  return data;
};

module.exports = { transform };
