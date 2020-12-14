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
      let rank = 1;
      for (const row of group) {
        if (row.productUrl) {
          row.productUrl.forEach(item => {
            item.text = 'https://bws.com.au' + item.text;
          });
        }
        if (row.reviewCount) {
          row.reviewCount.forEach(item => {
            var tmp = item.text.replace('(', '');
            item.text = tmp.replace(')', '');
            item.text=parseInt(item.text);
          });
        }
        if (row.price) {
          row.price.forEach(item => {
            item.text = item.text.replace(/\s*/g, "").trim();
            item.text = item.text.replace(/\B(?=(\d{2})+(?!\d))/g, ".").trim();
          });
        }
        if (row.id) {
          row.id.forEach(item => {
            item.text = item.text.match(/\d+/g);
            item.text = item.text.toString().replace(/\,.*/g, '').trim();
          });
        }
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {
            item.text = Number(item.text);
          });
        }
        if (row.name) {
          row.name.forEach(item => {
            item.text = item.text.replace(/\s\n/g, '').trim();
          });
        }
        row.rank = row.rankOrganic = [{ "text": rank }];
        rank++;
      }
    }
    return cleanUp(data);
  };
module.exports = { transform };