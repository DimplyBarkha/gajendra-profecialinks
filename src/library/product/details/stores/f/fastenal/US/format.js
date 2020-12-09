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

  for (const { group }
    of data) {
    var rank = 1;
    for (const row of group) {
      if (row.image) {
        row.image.forEach(item => {
          item.text = "https:" + item.text;
        });
      }
      if (row.shownImages) {
        row.shownImages.forEach(item => {
          item.text = "https:" + item.text;
        });
      }
      if (row.sku) {
        row.sku.forEach(item => {
          item.text = "fastenal_" + item.text;
        });
      }

      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace('$', ' ').trim();
          item.text = item.text.replace('/ each', ' ').trim();
        });
      }

      if (row.priceCurrency) {
        row.priceCurrency.forEach(item => {
          item.text = item.text.replace('/ each', ' ').trim();
          console.log("item.text", item.text);
          item.text = item.text.slice(0, 1);
        });
      }
      row.rank = [{ "text": rank }];
      row.rankOrganic = [{ "text": rank }];
      rank++;

    }



  }
  return data;
};

module.exports = { transform };