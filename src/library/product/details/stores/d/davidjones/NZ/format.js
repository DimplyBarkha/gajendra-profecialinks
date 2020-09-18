// @ts-nocheck
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        if (row.description[0].text.match(/\n(\d+)\./g)) {
          const bulletCount = row.description[0].text.match(/\n(\d+)\./g).length;
          row.descriptionBullets = [{ text: bulletCount }];
        }
        row.description[0].text = '||' + row.description[0].text.replace(/\n(\d+)\./g, '||').replace(/\n \n/g, ' ').replace(/\n/g, '') + '||';
      }
      if (row.availabilityText) {
        row.availabilityText = row.availabilityText[0].text.includes('Available Now') ? [{ text: 'In Stock' }] : [{ text: 'Out of Stock' }];
      }
      if (row.nameExtended) {
        row.nameExtended[0].text = row.brandText[0].text + ' - ' + row.nameExtended[0].text;
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/productthumb/, 'magnify');
        });
      }
      if (row.image) {
        row.image[0].text = row.image[0].text.replace(/productthumb/, 'magnify');
      }
      if (!row.warranty) {
        if (row.warranty1) {
          const text = row.warranty1[0].text.replace(/\n/g, '').replace(/.*Warranty:(.*)/, '$1').replace(/^((?:\S+\s+){3}\S+).*/, '$1').replace(/-/g, '').replace(/:/g, '');
          if (text.includes('guarantee')) {
            row.warranty = [{ text }];
          }
        }
      }
      if (row.videos) {
        row.videos.forEach(temp => {
          if (temp.text.charAt(0) === '/') {
            temp.text = temp.text.replace(/\/\//, 'https://');
          }
        });
        row.videos.forEach(item => {
          item.text = item.text.replace(/\/productimages/, 'https://www.davidjones.com/productimages');
        });
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
