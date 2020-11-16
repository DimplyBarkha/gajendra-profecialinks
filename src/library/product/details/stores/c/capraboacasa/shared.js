
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.name) {
        let text = '';
        row.name.forEach(item => {
          const nameArr = item.text.split(" ");
          //text += item.text.replace(/(.*kJ)(.*)/g, '$1/$2');
          row.brandText = [
            {
              text: nameArr[0],
            },
          ];
          
          // row.quantity = [
          //   {
          //     text: nameArr[nameArr.length - 1],
          //   },
          // ];
        });
      }
      
      // if (row.description) {
      //   let text = '';
      //   row.description.forEach(item => {
      //     text = row.description.map(elm => elm.text).join(' ').replace(/●/g, '||');
      //   });
      //   row.description = [{ text }];
      // }

      // if (row.availabilityText) {
      //   let newText = 'Out Of Stock';
      //   row.availabilityText.forEach(item => {
      //     if (item.text.trim() === 'Añadir') {
      //       newText = 'In Stock';
      //     }
      //   });
      //   row.availabilityText = [{ text: newText }];
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
