/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.category) {
        if (row.category[0].text === 'Home') {
          row.category.shift();
        }
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach((el) => {
          text += el.text.replace(/\n \n/g, '||');
        });
        row.additionalDescBulletInfo = [
          {
            text: text.slice(0, -3).trim(),
          },
        ];
      }
      if (row.descriptionBullets) {
        const info = row.additionalDescBulletInfo[0].text;
        row.descriptionBullets[0].text = info.split('||').length;
      }
      if (row.description) {
        row.description[0].text = row.description[0].text.replace(/\n/g, '');
      }
      if (row.largeImageCount) {
        row.largeImageCount = [
          {
            text: row.alternateImages.length,
          },
        ];
      }
      if (row.ratingCount) {
        let pr = row.ratingCount[0].text;
        pr = pr.replace(/^\((.+)\)$/, '$1');
        row.ratingCount = [
          {
            text: pr,
            xpath: row.ratingCount[0].xpath,
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach((item) => {
          text += `${item.text.replace(/\n \n/g, '')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.aggregateRatingText) {
        let ag = row.aggregateRatingText[0].text;
        ag = ag.split(' ')[0] === 'Rated' ? ag.replace('Rated ', '') : ag;
        row.aggregateRatingText = [
          {
            text: ag,
            xpath: row.aggregateRatingText[0].xpath,
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
