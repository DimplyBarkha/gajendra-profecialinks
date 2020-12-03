const transform = (data, context) => {
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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();
  for (const { group } of data) {
    for (const row of group) {
      if (row.sku) {
        if (!row.reviewedSku) {
          row.reviewedSku = row.sku;
        }
      }
      if (!row.flavour && row.backupFlavour) {
        row.flavour = row.backupFlavour;
        delete row.backupFlavour;
      }

      if (row.flavour && Array.isArray(row.flavour)) {
        row.flavour = [{ text: row.flavour.map(el => el.text).join(', ') }];
      }
      if (row.productFamily && Array.isArray(row.productFamily)) {
        row.productFamily = [{ text: row.productFamily.map(el => el.text).join(' > ') }];
      }

      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};
module.exports = { transform };
