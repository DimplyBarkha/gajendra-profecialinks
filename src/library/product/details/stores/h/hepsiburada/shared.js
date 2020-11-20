
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = row.description.map(elm => elm.text).join(' ').replace(/•/g, '||').replace(/·/g, '||');
        });
        row.description = [{ text }];
      }
      if (row.ingredientsList) {
        let text = '';
        row.ingredientsList.forEach(item => {
          text = row.ingredientsList.map(elm => elm.text).join(' ');
        });
        row.ingredientsList = [{ text }];
      }
      // if (row.warranty) {
      //   let text = '';
      //   row.warranty.forEach(item => {
      //     text += item.text.concat(' Ay');
      //   });
      //   row.warranty = [
      //     {
      //       text: text,
      //     },
      //   ];
      // }
      if (row.specifications) {
        let text = '';
        let count = 0;
        row.specifications.forEach(item => {
          count++;
          const val = (count % 2);
          if (val === 0) {
            text += `: ${item.text}`;
          } else {
            text += ` | ${item.text}`;
          }
        });
        row.specifications = [
          {
            text: text.replace(new RegExp('(\\s\\|\\s)(.+)', 'g'), '$2'),
          },
        ];
      }
      if (row.price) {
        let text = '';
        row.price.forEach(item => {
          text += item.text.replace('.', ',');
        });
        row.price = [
          {
            text: text,
          },
        ];
      }
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
