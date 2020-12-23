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
  let nameData = '';
  let brandData = '';
  for (const { group } of data) {
    for (const row of group) {
      if (row.name) {
        row.name.forEach(item => {
          nameData = item.text;
        });
      }

      if (row.brandText) {
        row.brandText.forEach(item => {
          brandData = item.text;
        });
      }

      // row.nameExtended = [{ text: `${brandData} ${brandData ? '-' : ''} ${nameData}` }];

      if (row.description) {
        row.description.forEach(item => {
          // item.text = item.text.replace(/(\s?\n)+/g, ' ').trim();
          // if (row.directions && row.directions.length) {
          //   item.text = item.text.replace(row.directions[0].text, '');
          // }
          item.text = item.text.trim();
        });
      }
      if (row.directions) {
        row.directions.forEach((item) => {
          item.text = item.text.replace('Modo de usar:', '').trim();
        });
      }
      // if (row.description) {
      //   row.description.forEach(item => {
      //     item.text = item.text.replace(/(\s?\n)+/g, ' | ').trim();
      //   });
      // }
      //   if (row.videos) {
      //     row.videos = row.videos.filter((video) => {
      //       return video.text;
      //     })
      //     row.videos.forEach(item => {
      //       item.text = item.text.indexOf('https:') === -1 ? ('https:' + item.text) : item.text;
      //     });
      //   }
      //   if (row.specifications) {
      //     row.specifications.forEach(item => {
      //       const specs = item.text.trim().split('\n');
      //       console.log('specs', specs[0])
      //       var cs = '';
      //       var flag = true;
      //       specs.forEach((spec, index) => {
      //         cs += spec + (flag ? ' : ' : ' || ');
      //         flag = !flag;
      //       });
      //       item.text = cs;
      //     });
      //   }
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.split('?')[0];
        });
      }

      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          if (item.text.indexOf('.') === -1) {
            item.text = `${item.text}.0`;
          }
          item.text = item.text.replace('.', ',');
        });
        row.aggregateRating2.forEach(item => {
          if (item.text.indexOf('.') === -1) {
            item.text = `${item.text}.0`;
          }
          item.text = item.text.replace('.', ',');
        });
        row.aggregateRatingText.forEach(item => {
          if (item.text.indexOf('.') === -1) {
            item.text = `${item.text}.0`;
          }
          item.text = item.text.replace('.', ',');
        });
      }

      if (row.alternateImages && row.alternateImages.length) {
        row.alternateImages.forEach(item => {
          item.text = item.text.split('?')[0];
        });

        row.alternateImages = row.alternateImages.filter(alternateItem => {
          const itemFound = row.image.find((item) => {
            return item.text === alternateItem.text;
          });

          if (itemFound) {
            return false;
          } else {
            return true;
          }
        });

        const unq = [...new Set(row.alternateImages.map(item => item.text))];

        row.alternateImages = [];
        unq.forEach((item) => {
          row.alternateImages.push({ text: item });
        });
        row.secondaryImageTotal = [{ text: row.alternateImages ? row.alternateImages.length : 0 }];
      }
    }
    data = cleanUp(data, undefined);
    return data;
  };
};

module.exports = { transform };
