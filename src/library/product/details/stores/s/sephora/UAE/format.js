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
        // if(row.alternateImages){
        //     let imageArray = [];
        //     if(row.alternateImages.length > 1){
        //       for(let i = 0; i < row.alternateImages.length; i++){
        //         let text = row.alternateImages[i].text
        //         imageArray.push(text);
        //       }
        //       let oneLess = imageArray.slice(1);
        //       let joins = oneLess.join(" | ");
        //       row.alternateImages = [{text: joins}]
        //     } else {
        //       row.alternateImages = [{text: ""}]
        //     }
        // }

        if (row.category) {
          const catArray = [];
          if (row.category.length > 0) {
            for (let i = 0; i < row.category.length; i++) {
              const text = row.category[i].text;
              if (text !== 'Home' && !catArray.includes(`${text}`)) {
                catArray.push(text);
              }
              row.category[i].text = '';
            }
          }

          for (let i = 0; i < catArray.length; i++) {
            row.category[i].text = catArray[i];
          }
        }

        if (row.manufacturerDescription) {
          const desArray = [];
          for (let i = 0; i < row.manufacturerDescription.length; i++) {
            const text = row.manufacturerDescription[i].text;
            desArray.push(text);
          }
          const joins = desArray.join(' ');
          row.manufacturerDescription = [{ text: joins }];
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
