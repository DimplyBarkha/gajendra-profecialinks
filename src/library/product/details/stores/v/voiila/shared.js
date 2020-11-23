/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.nutritionInfo) {
        let text = '';
        row.nutritionInfo.forEach(item => {
          text += item.text.replace(/\n/g, ' ');
        });
        row.nutritionInfo = [
          {
            text: text,
          },
        ];
      }

      // if (row.shownImages) {
      //   let text = '';
      //   row.shownImages.forEach(item => {
      //     if (item.text.includes(',')) {
      //       text = item.text.split(',').join();
      //     } else {
      //       text = item.text;
      //     }
      //   });
      //   row.shownImages = [
      //     {
      //       text,
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