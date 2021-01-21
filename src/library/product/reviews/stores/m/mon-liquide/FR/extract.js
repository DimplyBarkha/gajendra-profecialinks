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
      if (row.flavour) {
        let flavour = row.flavour[0].text;
        flavour = flavour.replace('Saveur :', '');
        row.flavour = [{ text: flavour }];
      }

      if (!row.brand && row.pageTitle) {
        const downcasePageTitle = row.pageTitle[0].text.toLowerCase();
        const brandRegExp = '((vype|blu|juul|logic))';
        const brand = downcasePageTitle.match(brandRegExp) ? downcasePageTitle.match(brandRegExp)[0] : null;
        if (brand) {
          row.brand = [{ text: brand.slice(0, 1).toUpperCase() + brand.slice(1, brand.length) }];
        }
      }

      if (!row.pageTitle && row.backupPageTitle) {
        row.pageTitle = [{
          text: row.backupPageTitle[0].text
            .replace('€', '')
            .replace(/[0-9]/g, '')
            .replace(',', ''),
        }];
      }

      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'FR',
    store: 'mon-liquide',
    transform,
    domain: 'mon-liquide.fr',
    zipcode: "''",
  },
};
