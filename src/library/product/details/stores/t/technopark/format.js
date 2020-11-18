/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const clean = text => text.toString().replace(/\r\n|\r|\n \n|\n/gm, ' ');
  // .replace(/&amp;nbsp;/g, ' ')
  // .replace(/&amp;#160/g, ' ')
  // .replace(/\u00A0/g, ' ')
  // .replace(/\s{2,}/g, ' ')
  // .replace(/"\s{1,}/g, '"')
  // .replace(/\s{1,}"/g, '"')
  // .replace(/^ +| +$|( )+/g, ' ')
  // eslint-disable-next-line no-control-regex
  // .replace(/[^\x00-\x7F]/g, '');

  for (const { group } of data) {
    for (const row of group) {
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(item => {
          const locText = item.text;
          if (locText.indexOf('###') > 0) {
            item.text = locText.substring(0, locText.indexOf('###'));
          } else if (locText.indexOf('###') === 0) {
            item.text = locText.replace('###', '');
          }
          console.log(item.text);
        });
      }

      if (row.description) {
        const nDesc = [];
        // let newDesc = '';
        // let idx = 0;
        row.description.forEach(item => {
          const des = clean(item.text);
          item.text = des;
          // console.log('des: ', des);
          nDesc[0] = item;
          // if (idx > 0) {
          //   newDesc = newDesc + '||';
          // }
          // newDesc = newDesc + item.text;
          // idx++;
        });
        // console.log(newDesc);
        // nDesc.forEach(item => {
        //   item.text = newDesc;
        // });
        // row.description = nDesc;
      }

      if (row.specifications) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.specifications.forEach(item => {
          nDesc[0] = item;
          item.text = clean(item.text);
          if (idx > 0) {
            newDesc = newDesc + ' | ';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        console.log(newDesc);
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.specifications = nDesc;
      }

      if (row.variants) {
        const nvariants = [];
        let newText = '';
        row.variants.forEach(item => {
          nvariants[0] = item;
          newText = newText + item.text.replace('/item', '').replace('.html', '') + '|';
        });
        console.log(newText);
        nvariants.forEach(item => {
          if (newText.length > 0) newText = newText.substring(0, newText.length - 1);
          item.text = newText;
        });
        row.variants = nvariants;
      }

      // Price
      if (row.price && row.price[0]) {
        console.log('row.price[0]:: ', row.price[0]);
        row.price[0].text = row.price[0].text.replace(/\s/, '');
        console.log('row.price[0].text', row.price[0].text);
      }
    }
  }
  return data;
};

module.exports = { transform };
