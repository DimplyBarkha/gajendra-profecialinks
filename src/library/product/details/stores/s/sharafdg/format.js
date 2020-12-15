
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
    for (let row of group) {
      if (row.category) {
        if (row.category.length) {
          row.category.splice(0, 1);
        }
        if (row.category.length) {
          row.category.splice(row.category.length - 1, 1);
        }
        if (!row.category.length) {
          delete row.category.length;
        }
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace('180x180', '600x600');
        });
      }
      if (row.price2) {
        if (!row.price) {
          row.price = [{ text: row.price2[0].text }];
        }
        delete row.price2;
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          if (item.text.indexOf('https') < 0) {
            item.text = 'https:' + item.text;
          }
        });
      }
      if (row.specifications) {
        var specificationsArr = [];
        row.specifications.forEach(item => {
          specificationsArr.push(item.text.replace('\n', ' : '));
        });
        if (specificationsArr.length) {
          row.specifications = [{ "text": specificationsArr.join(" || ") }];
        }
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          var myRegexp = /\?p=(.+)/g;
          var match = myRegexp.exec(item.text);
          if (match) {
            if (match.length) {
              item.text = match[1].trim();
            }
          }
        });
      }      
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
