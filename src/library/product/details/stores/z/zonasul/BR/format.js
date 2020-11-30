/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
  for (const { group } of data) {
    for (const row of group) {
      // if (row.alternateImages) {
      //   row.alternateImages.splice(0, 1);
      //   if (row.alternateImages.length === 0) {
      //     delete row.alternateImages;
      //   }
      // }
      // if (row.descriptionBullets) {
      //   var bulletArr = [];
      //   row.descriptionBullets.forEach(item => {
      //     bulletArr.push(item.text.replace(/^\s*-\s*/, ''));
      //   });
      //   row.descriptionBullets = [{ text: '|| ' + bulletArr.join(' || ') }];
      // }
      if (row.specifications) {
        var arrSpecs = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\s*:\s*/, ' : ');
          arrSpecs.push(item.text);
        });
        row.specifications = [{ text: arrSpecs.join(' || ') }];
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace('por:', '');
          item.text = item.text.trim();
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace('De:', '');
          item.text = item.text.trim();
        });
      }
      // if (row.listPrice) {
      //   var tempLprice = row.listPrice[0].text;
      //   row.listPrice = [{ text: row.price[0].text }];
      //   row.price = [{ text: tempLprice }];
      // }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };