/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
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
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
      if (row.image) {
        const img = [];
        row.image.forEach(item => {
          if (item.text.indexOf('https:') === -1) {
            item.text = `https:${item.text}`;
          }
        });
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.manufacturerDescription = [
          {
            text: text,
          },
        ];
      }
      if ((!row.energyEfficiency || !row.energyEfficiency.length) && row.energyEfficiency1) {
        console.log('energyEfficiency1', row.energyEfficiency1);
        row.energyEfficiency = row.energyEfficiency1;
        console.log('energyEfficiency', row.energyEfficiency);
      }
      if ((!row.weightNet || !row.weightNet.length) && row.weightNet1) {
        console.log('weightNet1', row.weightNet1);
        row.weightNet = row.weightNet1;
        console.log('weightNet', row.weightNet);
      }
      if ((!row.manufacturerImages || !row.manufacturerImages.length) && row.manufacturerImages1) {
        console.log('manufacturerImages1', row.manufacturerImages1);
        row.manufacturerImages = row.manufacturerImages1;
        console.log('manufacturerImages', row.manufacturerImages);
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
      if (row.alternateImages) {
        const variantUrls = [];
        let dupUrl = '';
        let urls = [];
        row.alternateImages.forEach(item => {
          console.log('item:: ', item.text);
          urls = row.alternateImages.filter(it => item.text === it.text);
          if (urls && urls.length === 1) {
            variantUrls.push(item);
          } else {
            if (dupUrl !== item.text) {
              dupUrl = item.text;
              variantUrls.push(item);
            }
          }
        });
        row.alternateImages = variantUrls;
      }
      let descTxt = '';
      if (row.description) {
        // let text = '';
        row.description.forEach(item => {
          descTxt += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.description = [
          {
            text: descTxt,
          },
        ];
      }
      if (row.allergyAdvice) {
        let text = '';
        row.allergyAdvice.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.allergyAdvice = [
          {
            text: text,
          },
        ];
      }
      if (row.ingredientsList) {
        let text = '';
        row.ingredientsList.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.ingredientsList = [
          {
            text: text,
          },
        ];
      }
      if (row.description1) {
        let text = '';
        row.description1.forEach(item => {
          text += `|| ${item.text.replace(/\n \n/g, ':')}  `;
        });
        row.description1 = [
          {
            text: text.slice(0, -1),
          },
        ];
        descTxt = ` ${text.slice(0, -3)} ${descTxt}`;
        row.description = [
          {
            text: descTxt,
          },
        ];
      }
      if ((!row.quantity || !row.quantity.length) && row.quantity1) {
        console.log('quantity1',row.quantity1);
        row.quantity = row.quantity1;
        console.log("quantity", row.quantity);
      }
      if ((!row.quantity || !row.quantity.length) && row.quantity2) {
        console.log('quantity2',row.quantity2);
        row.quantity = row.quantity2;
        console.log("quantity", row.quantity);
      }
      if (row.allergyAdvice) {
        let text = '';
        row.allergyAdvice.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')}  `;
        });
        row.allergyAdvice = [
          {
            text: text.slice(0, -2),
          },
        ];
      }
      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} | `;
        });
        row.variants = [
          {
            text: text.slice(0, -2),
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
      // if (row.allergyAdvice) {
      //   let text = '';
      //   row.allergyAdvice.forEach(item => {
      //     text += item.text.replace(/\n/g, '');
      //   });
      //   row.allergyAdvice = [
      //     {
      //       text: text,
      //     },
      //   ];
      // }

      if (row.allergens) {
        let text = '';
        row.allergens.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.allergens = [{ text }];
      }
    }
  }
  return data;
};

module.exports = { transform };
