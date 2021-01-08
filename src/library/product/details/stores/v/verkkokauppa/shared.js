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
      // if (row.inTheBoxText) {
      //   let text = '';
      //   row.inTheBoxText.forEach(item => {
      //     text += item.text.replace('Mukana:', '');
      //   });
      //   row.inTheBoxText = [
      //     {
      //       text: text,
      //     },
      //   ];
      // }
      if (row.unInterruptedPDP) {
        const pdps = [];

        row.unInterruptedPDP.forEach(item => {
          console.log('item:: ', item.text);

          if (pdps.indexOf(item.text) === -1) {
            pdps.push(item.text);
          }
          // console.log("variantUrls:: ", pdps);
          // if (urls && urls.length === 1) {
          //   variantUrls.push(item);
          // } else {
          //   if (dupUrl !== item.text) {
          //     dupUrl = item.text;
          //     variantUrls.push(item);
          //   }
          // }
        });
        row.unInterruptedPDP = pdps.map((el) => {
          return {
            text: el,
          };
        });
      }
      console.log('box item.text ==  @@@@@@@@@@@@@@@@@@@@@', row.inTheBoxText);
      if (row.inTheBoxText) {
        row.inTheBoxText.forEach(item => {
          // if (row.inTheBoxText && row.inTheBoxText[0]) {
          console.log('box item.text ==', item.text);
          item.text = item.text.replace('Mukana: ', '');
          item.text = item.text.replace(/,/g, ' || ');
          // }
        });
      }

      // if (row.inTheBoxText && row.inTheBoxText[0]) {
      //   row.inTheBoxText[0].text = row.inTheBoxText[0].text.replace(',', '');
      // }
    }
  }
  return data;
};

module.exports = { transform };
