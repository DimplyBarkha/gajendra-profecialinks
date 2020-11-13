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
      if (row.additionalDescBulletInfo && row.additionalDescBulletInfo.length === 1) {
        row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.replace(/\n -/g, ' || ').replace(/^-/, '||').replace(/\\n/g, ' ');
        const bulletCount = row.additionalDescBulletInfo[0].text.match(/\|\|/g).length;
        row.descriptionBullets = [{ text: bulletCount }];
      } else if (row.additionalDescBulletInfo && row.additionalDescBulletInfo.length > 1) {
        row.descriptionBullets = [{ text: row.additionalDescBulletInfo.length }];
        const bulletText = row.additionalDescBulletInfo.reduce((bulletText = '', item) => {
          bulletText += ' || ' + item.text.replace(/^-/, '').replace(/\\n/g, ' ');
          return bulletText;
        }, '');
        row.additionalDescBulletInfo = [{ text: bulletText }];
      }
      if (row.description) {
        if(row.description1) {
          row.description1[0].text = row.description1[0].text.replace(/\n \n/g, ' ');
        }
        let demo = '';
        if(row.description2) {
          row.description2.forEach(item => {
            demo += item.text.replace(/\n \n \n \n/g, ' : ') + '  ';
          });
          row.description2 = [{ text: demo.slice(0, -1).trim() }];
        }
        row.description[0].text = row.description[0].text.replace(/\n - /g, ' || ').replace(/\n \n-/g, ' || ').replace(/\n \n \n \n/g, ' ').replace(/\n \n \n/g, ' ').replace(/\n \n/g, ' ').replace(/\n/g, ' ');
        row.description[0].text = row.description1 ? row.description1[0].text: "" + ' | ' + row.description[0].text + ' | ' + row.description2 ? row.description2[0].text : "";
      }
      if (row.availabilityText) {
        row.availabilityText = row.availabilityText[0].text === 'Disponibile' ? [{ text: 'In Stock' }] : [{ text: 'Out of Stock' }];
      }
      if (row.price) {
        let amt = '';
        amt = row.price[0].text.split('\n', 1)[0];
        row.price = [{ text: amt }];
      }
      if (!row.shippingDimensions) {
        if (row.width && row.depth && row.height && row.shippingWeight) {
          // const w = row.width[0].text.split(' ');
          // const d = row.depth[0].text.split(' ');
          // const h = row.height[0].text.split(' ');
          const dim = 'Altezza (Shipping): ' + row.width[0].text + ' || ' + 'Profondità (Shipping): ' + row.depth[0].text + ' || ' + 'Ampiezza (Shipping): ' + row.height[0].text + ' || ' + 'Peso (Shipping): ' + row.shippingWeight[0].text;
          row.shippingDimensions = [{ text: dim }];
        }
      }
      if (!row.color) {
        if (row.color1) {
          row.color = row.color1;
        } else if (row.color2) {
          var text = row.color2[0].text.replace(/\n/g, '').replace(/.*- Colore: (.*)/, '$1').replace(/((?:\S+\s+){2}\S+)/, '$1');
          text = text.split(' - ');
          row.color = [{ text: text[0] }];
        }
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
