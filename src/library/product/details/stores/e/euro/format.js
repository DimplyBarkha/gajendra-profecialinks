/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
      if (row.specifications) {
        const specs = [];
        let newTxt = '';
        let cnt = 0;
        row.specifications.forEach(item => {
          specs[0] = item;
          item.text = item.text.replace(/(\s?\n)+/g, ' ');
          if (cnt > 0) newTxt = newTxt + ' || ' + item.text;
          else newTxt = newTxt + item.text;
          cnt++;
        });
        specs.forEach(item => {
          item.text = newTxt;
        });
        row.specifications = specs;
      }
      if (row.description) {
        const descs = [];
        let newTxt = '';
        let cnt = 0;
        row.description.forEach(item => {
          descs[0] = item;
          item.text = item.text.replace(/(\s?\n)+/g, ' ').trim();
          if (cnt > 0) newTxt = newTxt + '||' + item.text;
          else newTxt = newTxt + item.text;
          cnt++;
        });
        descs.forEach(item => {
          item.text = newTxt;
        });
        row.description = descs;
      }
      if (row.price) {
        row.price = [
          {
            text: row.price[0].text.replace(' ', ''),
          },
        ];
      }
      if (row.listPrice) {
        row.listPrice = [
          {
            text: row.listPrice[0].text.replace(' ', ''),
          },
        ];
      }
      if (row.alternateImages) {
        const images = row.alternateImages.filter(img => !img.text.match('#'));
        // console.log('images:: ', images);
        row.alternateImages = images;
      }
      // if (row.alternateImages) {
      //   row.alternateImages = [
      //     {
      //       text: row.alternateImages[0].text.replace('#', ''),
      //     },
      //   ];
      // }
    }
  }
  // clean data
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};
module.exports = { transform };
