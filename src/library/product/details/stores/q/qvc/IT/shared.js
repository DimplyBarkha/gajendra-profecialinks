
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.price) {
        let text = '';
        let xpath = '';
        row.price.forEach(item => {
          text = item.text.replace('.', ',') + ' €';
          xpath = item.xpath;
        });
        row.price = [
          {
            text: text,
            xpath: xpath,
          },
        ];
      }

      if (row.weightNet) {
        let text = '';
        let xpath = '';
        row.weightNet.forEach(item => {
          text = item.text.replace('.', ',');
          text = text.replace('peso: ', '');
          xpath = item.xpath;
        });
        row.weightNet = [
          {
            text: text,
            xpath: xpath,
          },
        ];
      }

      if (row.aggregateRating) {
        let text = '';
        let xpath = '';
        row.aggregateRating.forEach(item => {
          text = item.text.replace('.', ',');
          xpath = item.xpath;
        });
        row.aggregateRating = [
          {
            text: text,
            xpath: xpath,
          },
        ];
      }

      if (row.manufacturerDescription) {
        row.manufacturerDescription = [
          {
            text: row.manufacturerDescription[1].text,
            xpath: row.manufacturerDescription[1].xpath,
          },
        ];
      }

      // if (row.description) {
      //   let text = '';
      //   let xpath = '';
      //   row.description = [
      //     {
      //       text: row.description[0].text,
      //       xpath: row.description[0].xpath
      //     },
      //   ];
      // }

      if (row.specifications) {
        let text = '';
        row.specifications.forEach((item, index) => {
          text += item.text.trim() + ' || ';
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }

      if (row.availabilityText) {
        let newText = 'Out Of Stock';
        row.availabilityText.forEach(item => {
          if (item.text.trim() === 'InStock') {
            newText = 'In Stock';
          }
        });
        row.availabilityText = [{ text: newText }];
      }

      if (row.category) {
        let text = '';
        row.category.forEach(item => {
          text = row.category.map(elm => elm.text).join(' | ');
        });
        row.category = [
          {
            text: text,
          },
        ];
      }

      if (row.warranty) {
        let text = '';
        row.warranty.forEach(item => {
          text = row.warranty.map(elm => elm.text).join(' | ');
        });
        row.warranty = [
          {
            text: text,
          },
        ];
      }

      // if (row.additionalDescBulletInfo) {
      //   let text = '';
      //   row.additionalDescBulletInfo.forEach(item => {
      //     text = row.additionalDescBulletInfo.map(elm => elm.text).join(' | ');
      //   });
      //   row.additionalDescBulletInfo = [
      //     {
      //       text: text,
      //     },
      //   ];
      // }
    }
  }

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

  return data;
};

module.exports = { transform };
