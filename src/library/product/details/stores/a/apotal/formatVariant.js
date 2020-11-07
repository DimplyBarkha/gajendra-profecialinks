/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    // var rank = 1;
    for (const row of group) {
      if (row.variantId) {
        const variantIds = row.variantId.map((item) => {
          return item.text.trim().substring(item.text.lastIndexOf('-') + 1);
        });
        if (variantIds.length > 1) {
          variantIds.shift();
        }
        row.variantId = variantIds.map((item) => {
          return { text: item, xpath: row.variantId[0].xpath };
        });
      }
      if (row.variantUrl) {
        const variantUrls = row.variantUrl.map((item) => {
          return item.text.trim();
        });
        if (variantUrls.length > 1) {
          variantUrls.shift();
        }
        row.variantUrl = variantUrls.map((item) => {
          return { text: item, xpath: row.variantUrl[0].xpath };
        });
      }
    }
  }

  const clean = text =>
    text
      .toString()
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

  data.forEach(obj =>
    obj.group.forEach(row =>
      Object.keys(row).forEach(header =>
        row[header].forEach(el => {
          el.text = clean(el.text);
        }),
      ),
    ),
  );
  return data;
};

module.exports = { transform };
