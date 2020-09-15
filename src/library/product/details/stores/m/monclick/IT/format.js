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
    .replace(/^ +| +$|() + /g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  for (const { group } of data) {
    for (const row of group) {
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.replace(/\n \n/g, ' || ');
      }
      if (row.description) {
        row.description1[0].text = row.description1[0].text.replace(/\n \n/g, ' ');
        let demo = '';
        row.description2.forEach(item => {
          demo += item.text.replace(/\n \n \n \n/g, ' : ') + '  ';
        });
        row.description2 = [{ text: demo.slice(0, -1).trim() }];
        row.description[0].text = row.description[0].text.replace(/\n - /g, ' || ').replace(/\n \n-/g, ' || ').replace(/\n \n \n \n/g, ' ').replace(/\n \n \n/g, ' ').replace(/\n \n/g, ' ').replace(/\n/g, ' ');
        const info = row.description[0].text;
        const count = info.split('||').length - 1;
        if (count > 1) {
          row.descriptionBullets = [{
            text: count,
          }];
        }
        row.description[0].text = row.description1[0].text + ' | ' + row.description[0].text + ' | ' + row.description2[0].text;
      }
      if (row.availabilityText) {
        row.availabilityText = row.availabilityText[0].text.includes('Non disponibile') ? [{ text: 'Out of Stock' }] : [{ text: 'In Stock' }];
      }
      if (row.price) {
        let amt = '';
        amt = row.price[0].text.split('\n', 1)[0];
        row.price = [{ text: amt }];
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
