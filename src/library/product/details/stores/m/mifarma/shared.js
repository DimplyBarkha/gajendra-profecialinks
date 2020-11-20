/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
  const clean = (text) =>
    text
      .toString()
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
  data.forEach((obj) =>
    obj.group.forEach((row) =>
      Object.keys(row).forEach((header) =>
        row[header].forEach((el) => {
          el.text = clean(el.text);
        }),
      ),
    ),
  );
  const concatFunction = (item, index) => {
    let text = '';
    if ((index + 1) % 2 === 0) {
      text += `${item.text} || `;
    } else {
      text += `${item.text} `;
    }
    return text;
  };
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        let text = '';
        row.specifications.forEach((item, i) => {
          text += concatFunction(item, i);
        });
        row.specifications = [
          {
            text: text,
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach((item, i) => {
          text += concatFunction(item, i);
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach((item, i) => {
          text += concatFunction(item, i);
        });
        row.manufacturerDescription = [
          {
            text: text,
          },
        ];
      }

      if (row.price && row.listPrice) {
        const discountPercentOff = ((1 - (parseFloat(row.price[0].text) / parseFloat(row.listPrice[0].text))) * 100).toFixed(2);
        row.productDiscount = [{ text: String(discountPercentOff) + '% off' }];
      }

      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach((item, i) => {
          text += concatFunction(item, i);
        });
        row.additionalDescBulletInfo = [
          {
            text: text,
          },
        ];
      }
      if (row.directions) {
        let text = '';
        row.directions.forEach((item, i) => {
          text += concatFunction(item, i);
        });
        row.directions = [
          {
            text: text,
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
