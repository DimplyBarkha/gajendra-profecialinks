/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      // if (row.pricePerUnit2) {
      //   let text = '';
      //   row.pricePerUnit2.forEach(item => {
      //     if (item.text.endsWith('p/')) {
      //       text = item.text.replace('p/', '');
      //     } else if (item.text.endsWith('/')) {
      //       text = item.text.slice(0, -1);
      //       console.log(text);
      //     } else {
      //       text = item.text;
      //     }
      //   });
      //   row.pricePerUnit2 = [
      //     {
      //       text,
      //     },
      //   ];
      // }
      // if (row.description) {
      //   let text = '';
      //   row.description.forEach(item => {
      //     text += ` || ${item.text}`;
      //   });
      //   row.description = [
      //     {
      //       text: text,
      //     },
      //   ];
      // }
      // if (row.specifications) {
      //   let text = '';
      //   row.specifications.forEach(item => {
      //     text = row.specifications.map(elm => elm.text).join(' || ');
      //   });
      //   row.specifications = [{ text }];
      // }
      // if (row.manufacturerDescription) {
      //   let text = '';
      //   row.manufacturerDescription.forEach(item => {
      //     text = text + (text ? ' ' : '') + item.text;
      //   });
      //   row.manufacturerDescription = [{ text }];
      // }

      // if (row.caloriesPerServing) {
      //   let text = '';
      //   row.caloriesPerServing.forEach(item => {
      //     if (item.text.includes('//')) {
      //       text = item.text.replace('//', '/');
      //     } else if (item.text.endsWith('/')) {
      //       text = item.text.slice(0, -1);
      //     } else {
      //       text = item.text;
      //     }
      //   });
      //   row.caloriesPerServing = [
      //     {
      //       text,
      //     },
      //   ];
      // }
      if (row.price && row.price[0]) {
        row.price[0].text = row.price[0].text.replace(/\./g, ',');
      }
      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          text = row.variants.map(elm => elm.text).join(' | ');
        });
        row.variants = [{ text }];
      }
    }
  }

  // Clean up data
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
