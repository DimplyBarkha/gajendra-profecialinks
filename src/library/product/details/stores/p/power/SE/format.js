
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
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        let text = '';
        let count = 0;
        row.specifications.forEach(item => {
          if (count % 2 === 0) {
            text += `${item.text.replace(/\n \n/g, '')} : `;
          } else {
            text += `${item.text.replace(/\n \n/g, '')} || `;
          }
          count++;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.manufacturerImages) {
        const manufacturerImages = [];
        row.manufacturerImages.forEach(item => {
          manufacturerImages.push({ text: `https:${item.text}` });
        });
        row.manufacturerImages = manufacturerImages;
      }
      if (row.description || row.descriptionOne || row.descriptionTwo) {
        let desc = '';
        let descTwo = '';
        const bullets = [];
        row.description && row.description.forEach(item => {
          bullets.push({ text: item.text });
          desc += `|| ${item.text}`;
        });
        row.additionalDescBulletInfo && row.additionalDescBulletInfo.forEach(item => {
          bullets.push({ text: item.text });
        });
        row.descriptionTwo && row.descriptionTwo.forEach(item => {
          descTwo += ` ${item.text}`;
        });
        row.additionalDescBulletInfo && row.additionalDescBulletInfo.forEach(item => {
          descTwo += `|| ${item.text}`;
        });
        let text = '';
        text = row.descriptionOne && row.descriptionOne[0].text;
        text = `${text} ${desc} | ${descTwo}`;
        row.description = [{ text: text }];
        if (bullets) {
          row.additionalDescBulletInfo = bullets;
          row.descriptionBullets = [{ text: bullets.length }];
        }
      }
    }
  }

  return data;
};

module.exports = { transform };
