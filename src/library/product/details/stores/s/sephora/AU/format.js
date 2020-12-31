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
        if (row.brandLink) {
          const text = row.brandLink[0].text;
          row.brandLink[0].text = `https://www.sephora.nz${text}`;
        }

        // if(row.description){
        //   let text = row.description[0].text;
        //   let bulletReplace = text.replace(/ - /g, " || ")
        //   row.description[0].text = bulletReplace
        // }
        // if(row.ingredientsList){
        //   let text = row.ingredientsList[0].text;
        //   let bulletReplace = text.replace(/ - /g, " || ")
        //   row.ingredientsList[0].text = bulletReplace
        // }
        // if(row.directions){
        //   let textLines = [];
        //   row.directions.forEach(line => {
        //     let bulletReplace = line.text.replace(/ - /g, " || ")
        //     row.directions[0].text = bulletReplace
        //   })
        // }

        // if(row.image){
        //   let text = row.image[0].text;
        //   if(!text.includes(".com")){
        //     let splits = text.split("?");
        //     row.image[0].text = `https://sephora.com.au${splits[0]}`
        //   }
        // }

        if (row.alternateImages) {
          const imageArray = [];
          if (row.alternateImages.length > 1) {
            for (let i = 0; i < row.alternateImages.length; i++) {
              const text = row.alternateImages[i].text;
              if (!imageArray.includes(text)) {
                imageArray.push(text);
              }
            }
            const oneLess = imageArray.slice(1);
            const joins = oneLess.join(' | ');
            row.alternateImages = [{ text: joins }];
          } else {
            row.alternateImages = [{ text: '' }];
          }
        }

        //   if(row.aggregateRating){
        //       let text = row.aggregateRating[0].text;
        //       let splits = text.split(" /");
        //     row.aggregateRating[0].text = splits[0];
        // }

        if (row.nameExtended) {
          const newName = [];
          const text = row.nameExtended.forEach(name => {
            newName.push(name.text);
            name.text = '';
          });
          const joins = newName.join(' ');
          row.nameExtended = [{ text: joins }];
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
        if (row.inTheBoxText1) {  
          row.inTheBoxText1.forEach(item => {
            item.text = item.text.replace('|| ', '');
            item.text = item.text.replace('||', '');
          });
        }
        if ((!row.inTheBoxText || row.inTheBoxText.length === 0) && row.inTheBoxText1) {
            row.inTheBoxText = row.inTheBoxText1;
          }
  
        if (row.inTheBoxText) {
          row.inTheBoxText.forEach(item => {
            item.text = item.text.replace('|| ', '');
            item.text = item.text.replace('||', '');
          });
        }

        if (row.unInterruptedPDP) {
          const txt = 'add to bag';
          row.unInterruptedPDP.forEach(item => {
            const idx = item.text.toLowerCase().indexOf(txt);
            if (idx > -1) {
              item.text = item.text.substring(idx + txt.length);
            }
            item.text = item.text.replace('false', ' '); 
          });
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
