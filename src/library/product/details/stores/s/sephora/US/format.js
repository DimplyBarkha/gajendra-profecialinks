/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  // const cleanUp = (data, context) => {
  //   data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
  //     el.text = clean(el.text);
  //   }))));
  //   return data;
  // };
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
  // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/\"/g, ' " ')
    .replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec);
    })
    .replace(/\s{2,}/g, ' ');

  for (const { group } of data) {
    for (const row of group) {
      try {
        // if (row.description) {
        //   const text = row.description[0].text;
        //   const bulletReplace = text.replace(/ - /g, ' || ');
        //   row.description[0].text = bulletReplace;
        // }
        if (row.ingredientsList) {
          const text = row.ingredientsList[0].text;
          const bulletReplace = text.replace(/ - /g, ' || ');
          row.ingredientsList[0].text = bulletReplace;
        }
        if (row.directions) {
          const text = row.directions[0].text;
          const bulletReplace = text.replace(/ - /g, ' || ');
          row.directions[0].text = bulletReplace;
        }

        if (row.image) {
          const text = row.image[0].text;
          const splits = text.split('?');

          row.image[0].text = `https://sephora.com${splits[0]}`;
        }

        if (row.quantity) {
          const text = row.quantity[0].text;

          row.quantity[0].text = text.replace(/(\(|\))/gm, '');
        }

        // if (row.alternateImages) {
        //   const imageArray = [];
        //   if (row.alternateImages.length > 1) {
        //     for (let i = 0; i < row.alternateImages.length; i++) {
        //       const text = row.alternateImages[i].text;
        //       const splits = text.split('?');
        //       imageArray.push(`https://sephora.com${splits[0]}`);
        //     }
        //     const oneLess = imageArray.slice(1);
        //     const joins = oneLess.join(' | ');
        //     row.alternateImages = [{ text: joins }];
        //   } else {
        //     row.alternateImages = [{ text: '' }];
        //   }
        // }

        if (row.aggregateRating) {
          const text = row.aggregateRating[0].text;
          const splits = text.split(' /');
          row.aggregateRating[0].text = splits[0];
        }

        // if (row.nameExtended) {
        //   const newName = [];
        //   const text = row.nameExtended.forEach(name => {
        //     newName.push(name.text);
        //     name.text = '';
        //   });
        //   const joins = newName.join(' ');
        //   row.nameExtended = [{ text: joins }];
        // }

        if (row.nameExtended) {
          let text = '';
          row.nameExtended.forEach(item => {
            text = row.nameExtended.map(elm => elm.text).join(' ');
          });
          row.nameExtended = [
            {
              text: text,
            },
          ];
        } 
        if (row.additionalDescBulletInfo) {
          row.additionalDescBulletInfo.forEach(bullet => {
            const text = bullet.text.replace(/- /g, '');
            bullet.text = text;
          });
        }

        if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0].text.length > 1) {
          row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.startsWith(' || ') ? row.additionalDescBulletInfo[0].text : ' || ' + row.additionalDescBulletInfo[0].text;
        }

        if (row.videos) {
          const videoArray = [];
          row.videos.forEach(video => {
            if (!videoArray.includes(video.text)) {
              videoArray.push(video.text);
            }
          });
          row.videos = [{ text: '' }];
          const videoStr = videoArray.join(' | ');
          row.videos[0].text = videoStr;
        }

        if (row.ratingCount2) {
          const text = row.ratingCount2[0].text;
          row.ratingCount[0].text = text;
        }

        if (row.manufacturerImages) {
          const manufImageArray = [];
          row.manufacturerImages.forEach(manufImage => {
            if (!manufImageArray.includes(manufImage.text)) {
              manufImageArray.push(manufImage.text);
            }
          });
          row.manufacturerImages = [{ text: '' }];
          const manufImageStr = manufImageArray.join(' | ');
          row.manufacturerImages[0].text = manufImageStr;
        }

        // row = cleanUp(row);
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      } catch (exception) {
        console.log(exception);
      }
    }
  }
  // context.setState({ variantArray });
  return data;
};
module.exports = { transform };
