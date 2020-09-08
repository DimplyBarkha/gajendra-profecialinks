
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.additionalDescBulletInfo) {
        const bullets = row.additionalDescBulletInfo[0].text.split(/\s*\n\s*-\s*/);
        for (let i = 0; i < bullets.length - 1; i++) {
          row.additionalDescBulletInfo[i] = {
            text: bullets[i + 1],
          };
        }
        row.descriptionBullets = [{
          text: row.additionalDescBulletInfo.length,
        },
        ];
      }

      if (row.description) {
        let text = row.description[0].text.replace(/\s*\n\s*-\s*/g, ' || ').split(' || ');
        const txt = text[text.length - 1].replace(/(\s*\n)+/, ' | ');
        text[text.length - 1] = txt;
        text = text.join(' || ');
        row.description = [{
          text: text.replace(/\n\s*\n*/g, ' '),
        },
        ];
      }

      if (row.videos) {
        row.videos.forEach(video => {
          if (!video.text.startsWith('http')) {
            video.text = `https://www.elgiganten.se${video.text}`;
          }
        });
      }

      if (row.specifications) {
        let text = '';
        row.specifications.forEach(spec => {
          text = text + ' || ' + spec.text;
        });
        row.specifications = [
          {
            text: text.slice(4),
          },
        ];
      }

      if (row.price && row.currency) {
        row.price[0].text = row.currency[0].text + row.price[0].text;
      }

      if (row.listPrice && row.currency) {
        row.listPrice[0].text = row.currency[0].text + row.listPrice[0].text;
      }
    }
    return data;
  };
};
module.exports = { transform };
