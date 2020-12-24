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
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        // row.specifications = [
        //   {
        //     text: text,
        //   },
        // ];
      }
      if (row.price && row.price[0]) {
        row.price[0].text = row.price[0].text.replace(',', '.');
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
      // if ((!row.quantity || !row.quantity.length) && row.quantity3) {
      //   console.log('quantity3',row.quantity3);
      //   row.quantity = row.quantity3;
      //   console.log("quantity", row.quantity);
      // }
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
      if (row.weightNet) {
        let text = '';
        row.weightNet.forEach(item => {
          text += `${item.text.replace('saszetek', ' ')}`;
        });
        row.weightNet = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.weightNet) {
        let text = '';
        row.weightNet.forEach(item => {
          text += `${item.text.replace('(1 saszetka)', ' ')}`;
        });
        row.weightNet = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.description1) {
        let text = '';
        row.description1.forEach(item => {
          text += `|| ${item.text.replace(/\n \n/g, ':')} `;
        });
        row.description1 = [
          {
            text: text.slice(0, -1),
          },
        ];
        descTxt = `${descTxt} ${text.slice(0, -3)}`;
        row.description = [
          {
            text: descTxt,
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.replace('pokaż więcej ...', '')} `;
        });
        row.description = [
          {
            text: text.slice(0, -1),
          },
        ];
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
      if (row.ageSuitability) {
        let text = '';
        row.ageSuitability.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} `;
        });
        row.ageSuitability = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
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
      if (row.manufacturer) {
        let text = '';
        row.manufacturer.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} `;
        });
        row.manufacturer = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.ingredientsList) {
        let text = '';
        row.ingredientsList.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} `;
        });
        row.ingredientsList = [
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
      if (row.shippingInfo) {
        let text = '';
        row.shippingInfo.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} `;
        });
        row.shippingInfo = [
          {
            text: text.slice(0, -1),
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
      if (row.price && row.price[0]) {
        row.price[0].text = row.price[0].text.replace(/\./g, ',');
      }
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