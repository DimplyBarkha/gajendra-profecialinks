/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  for (const { group } of data) {
    for (let row of group) {
      try {
        if (row.manufacturerImages) {
          row.manufacturerImages.forEach(item => {
            if (!(item.text.startsWith('http'))) {
              const img = item.text;
              const imgText = 'https:' + img;
              item.text = imgText;
            }
          });
        }

        const concatFunction = (item, index) => {
          let text = '';
          if ((index + 1) % 2 === 0) {
            text += `${item.text} || `;
          } else {
            text += `${item.text} : `;
          }
          return text;
        };

        if (row.specifications) {
          let specificationsText = 'Product Specification Highlights ';
          row.specifications.forEach((item, i) => {
            if (item.text) {
              specificationsText += concatFunction(item, i);
            }
          });
          row.specifications = [{
            text: specificationsText.slice(0, -4).trim(),
          }];
        }

        if (!row.specifications && row.specifications2) {
          let specificationsText = '';
          row.specifications2.forEach((item, i) => {
            if (item.text) {
              specificationsText += concatFunction(item, i);
            }
          });
          row.specifications = [{
            text: specificationsText.slice(0, -4).trim(),
          }];
        }

        if (row.imageZoomFeaturePresent) {
          row.imageZoomFeaturePresent.forEach(item => {
            item.text = item.text === 'true' ? 'Yes' : 'No';
          });
        }

        if (row.image2 && !row.image) {
          row.image = [{
            text: row.image2[0].text,
          }];
        }

        if (row.aggregateRatingOther && !row.aggregateRating) {
          row.aggregateRating = [{
            text: row.aggregateRatingOther[0].text.replace(/(.)\/(.+)/, '$1'),
          }];
        }

        if (row.descriptionAdd) {
          let text = '';
          row.descriptionAdd.forEach(item => {
            text += `|| ${item.text} `;
          });

          row.descriptionAdd = [
            {
              text: text.trim(),
            },
          ];
        }

        if (row.description) {
          let text = '';
          row.description.forEach(item => {
            text += `${item.text} `;
          });

          if (row.descriptionAdd) {
            text += row.descriptionAdd[0].text;
          }

          row.description = [
            {
              text: text.trim(),
            },
          ];
        }

        if (!row.description && row.descriptionAdd) {
          row.description = row.descriptionAdd;
        }

        if (row.descriptionBullets) {
          row.descriptionBullets = [
            {
              text: row.descriptionBullets.length,
            },
          ];
        }

        if (row.videos) {
          const videoArr = [];
          const items = [];
          row.videos.forEach(item => {
            if (videoArr.indexOf(item.text) < 0) {
              videoArr.push(item.text);
              items.push({
                text: item.text,
              });
            }
          });
          row.videos = items;
        }

        if (!row.inTheBoxText && row.backUpInTheBoxText) {
          row.inTheBoxText = row.backUpInTheBoxText;
        }

        row = clean(row);
      } catch (exception) {
        console.log(exception);
      }
    }
  }
  return data;
};

module.exports = { transform };
