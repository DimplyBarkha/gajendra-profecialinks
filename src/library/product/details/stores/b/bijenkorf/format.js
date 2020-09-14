
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.additionalDescBulletInfo) {
        row.descriptionBullets = [{
          text: row.additionalDescBulletInfo.length,
        },
        ];
      }

      if (row.description) {
        row.description = [{
          text: row.description[0].text.replace(/\s*\n\s*/g, ' '),
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

      if (row.name) {
        if (row.brandText) {
          row.name = [{
            text: row.brandText[0].text + ' - ' + row.name[0].text,
          },
          ];
        }
      }

      if (row.nameExtended) {
        if (row.brandText) {
          row.nameExtended = [{
            text: row.brandText[0].text + ' - ' + row.nameExtended[0].text,
          },
          ];
        }
      }
    }
    return data;
  };
};
module.exports = { transform };
