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
      if (row.nameExtended) {
        let brandData = '';
        let nameExtended = '';
        if (row.brandText) {
          row.brandText.map((item) => {
            brandData = item.text;
          });
          row.nameExtended.map((item) => {
            nameExtended = item.text;
          });
          row.nameExtended = [{ text: `${nameExtended}` }];
          // row.nameExtended = [{ text: `${brandData} - ${nameExtended}` }];
        }
      }
      if (row.image) {
        row.image.map((item) => {
          item.text = `${item.text.indexOf('https') === -1 ? 'https:' : ''}${item.text}`;
        });
      }
      if (row.alternateImages) {
        row.alternateImages.map((item) => {
          item.text = `${item.text.indexOf('https') === -1 ? 'https:' : ''}${item.text}`;
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.map((item) => {
          item.text = item.text.replace('.', ',');
        });
      }
      if (row.price) {
        row.price.map(item => {
          item.text = `${item.text}€`;
        });
      }

      if (row.manufacturerImages) {
        const arr = row.manufacturerImages.filter((item) => {
          return !(item.text.indexOf('gif') > -1);
        });
        row.manufacturerImages = arr;
        row.manufacturerImages.map((item) => {
          item.text = `${item.text.indexOf('https') === -1 ? 'https:' : ''}${item.text}`;
        });
      }
      if (row.description) {
        // console.log(row.description);
      }
    }
  }
  data = cleanUp(data, undefined);
  return data;
};

module.exports = { transform };
