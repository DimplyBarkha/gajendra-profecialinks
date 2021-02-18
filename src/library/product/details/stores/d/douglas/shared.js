/**
 *
 * *
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

  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' ').trim();
        });
      }
      if ((!row.name || !row.name.length) && row.name1) {
        row.name = row.name1;
      }
      if ((!row.name || !row.name.length) && (!row.name1 || !row.name1.length) && row.name2) {
        row.name = row.name2;
      }
      if (row.shippingInfo) {
        row.shippingInfo.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' || ').trim();
        });
      }

      if (row.nameExtended) {
        let qunatityTxt = '';
        if (row.quantity && row.quantity.length > 0) {
          qunatityTxt = row.quantity[0].text;
        }
        row.nameExtended.forEach(item => {
          item.text = `${item.text} ${qunatityTxt}`;
        });
        row.nameExtended[0].text = row.nameExtended[0].text.trim();
      }
      if (!row.quantity && row.quantity1 && row.quantity1.length) {
        const text = row.quantity1[0].text;
        row.quantity = [{ text }];
      }
      if (row.name) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.name.forEach(item => {
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
        row.name = nDesc;
      }
      if (row.aggregateRating) {
        let text = '';
        row.aggregateRating.forEach(item => {
          text = item.text.replace('.', ',');
        });
        row.aggregateRating = [{ text }];
      }
      if (!row.aggregateRating && row.aggregateRating1 && row.aggregateRating1.length) {
        row.aggregateRating1[0].text = row.aggregateRating1[0].text.trim();
        row.aggregateRating1[0].text = row.aggregateRating1[0].text.replace('.', ',');
        row.aggregateRating = row.aggregateRating1;
      }
      if ((!row.nameExtended || !row.nameExtended.length) && row.name) {
        row.nameExtended = row.name;
      }
      if ((!row.price || !row.price.length) && row.price1) {
        row.price = row.price1;
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.additionalDescBulletInfo = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.variantCount) {
        //
        row.variantCount.forEach(item => {
          item.text = item.text === '1' ? '' : item.text;
        });
      };
      if (row.variantId && row.variantId.length > 1) {
        row.variantId[0].text = row.variantId[1].text;
        row.variantId.pop();
      };
      if (row.ingredientsList && row.ingredientsList.length > 1) {
        row.ingredientsList = row.ingredientsList.filter((thing, index, self) => self.findIndex(t => t.text === thing.text) === index);
      };
      if (row.directions && row.directions.length > 1) {
        row.directions = row.directions.filter((thing, index, self) => self.findIndex(t => t.text === thing.text) === index);
      };
      if (!row.variantInformation && row.variantInformation1 && row.variantInformation1.length) {
        const text = row.variantInformation1[0].text;
        row.variantInformation = [{ text }];
      }
      if (!row.image && row.image1 && row.image1.length) {
        const text = row.image1[0].text;
        row.image = [{ text }];
      }
      if (row.brandText && row.nameExtended) {
        if (row.variantInformation) {
          if (row.variantInformation[0].text.includes(row.nameExtended[0].text)) {
            let text = row.variantInformation[0].text.split(row.nameExtended[0].text)[1];
            text = row.brandText[0].text + ' ' + row.nameExtended[0].text + ' ' + text;
            text = text.trim();
            row.imNameExtended = [{ text }];
          } else {
            const text = row.brandText[0].text + ' ' + row.nameExtended[0].text + ' ' + row.variantInformation[0].text;
            row.imNameExtended = [{ text }];
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
