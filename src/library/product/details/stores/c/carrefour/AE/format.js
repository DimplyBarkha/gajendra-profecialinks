
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
      // .replace(/"\s{1,}/g, '"')
      // .replace(/\s{1,}"/g, '"')
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
      if (row.brandLink) {
        row.brandLink.forEach(item => {
          item.text = `https://www.carrefouruae.com${item.text}`;
        });
      }
      if (row.specifications) {
        var specificationsArr = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n/g, ' : ');
          specificationsArr.push(item.text);
        });
        if (specificationsArr.length) {
          row.specifications = [{ text: specificationsArr.join(' || ') }];
        }
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          if (item.text.indexOf('http') < 0) {
            item.text = 'https:' + item.text;
          }
        });
      }
      if (row.warranty) {
        row.warranty.forEach(item => {
          item.text = item.text.replace('Warranty:', '');
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          var myRegexp = /(\d+)\s+reviews/g;
          var match = myRegexp.exec(item.text);
          if (match) {
            item.text = match[1].trim();
          } else {
            delete row.ratingCount;
          }
        });
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
