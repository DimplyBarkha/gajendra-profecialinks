
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
      el.text = el.text.trim();
    }))));
    return data;
  };
  for (const { group } of data) {
    for (const row of group) {
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
        let text = '';
        for (let i = 0; i < row.specifications.length; i++) {
          text += `${row.specificationsLabel[i].text} : ${row.specifications[i].text} || `;
        }
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
        delete row.specificationsLabel;
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
