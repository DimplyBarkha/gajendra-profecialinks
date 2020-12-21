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
      .replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
      })
      .replace(/\s{2,}/g, " ");

    for (const { group } of data) {
      for (let row of group) {
        try {

          if(row.description){
            let text = row.description[0].text;
            let bulletReplace = text.replace(/ - /g, " || ")
            row.description[0].text = bulletReplace
          }
          if(row.ingredientsList){
            let text = row.ingredientsList[0].text;
            let bulletReplace = text.replace(/ - /g, " || ")
            row.ingredientsList[0].text = bulletReplace
          }
          if(row.directions){
            let text = row.directions[0].text;
            let bulletReplace = text.replace(/ - /g, " || ")
            row.directions[0].text = bulletReplace
          }

          if(row.quantity){
            let text = row.quantity[0].text;
            row.quantity[0].text = text.replace(/(\(|\))/gm, '');
          }

          if(row.shownImages){
            row.shownImages.forEach(item => {
              console.log("item.text",item.text);
              item.text = "https://sephora.com" + item.text;
              console.log("item.text",item.text);
            })
          }

          if(row.highQualityImages){
            row.highQualityImages.forEach(item => {
              item.text = item.text.split("?");
              item.text = `https://sephora.com${item.text[0]}`
            })
          }

          if(row.aggregateRating){
              let text = row.aggregateRating[0].text;
              let splits = text.split(" /");
            row.aggregateRating[0].text = splits[0];
        }

          if(row.additionalDescBulletInfo){
            row.additionalDescBulletInfo.forEach(bullet => {
              let text = bullet.text.replace(/- /g, "")
              bullet.text = text
            })
          }

          if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0].text.length > 1) {
            row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.startsWith(' || ') ? row.additionalDescBulletInfo[0].text : ' || ' + row.additionalDescBulletInfo[0].text;
          }

          if (row.videos) {
            let videoArray = [];
            row.videos.forEach(video => {
              if(!videoArray.includes(video.text)){
                videoArray.push(video.text);
              }
            });
            row.videos = [{text: ""}]
            let videoStr = videoArray.join(" | ");
            row.videos[0].text = videoStr;
          }

          if (row.manufacturerImages) {
            let manufImageArray = [];
            row.manufacturerImages.forEach(manufImage => {
              if(!manufImageArray.includes(manufImage.text)){
                manufImageArray.push(manufImage.text);
              }
            });
            row.manufacturerImages = [{text: ""}]
            let manufImageStr = manufImageArray.join(" | ");
            row.manufacturerImages[0].text = manufImageStr;
          }

          if (row.brandLink) {
            row.brandLink.forEach(item => {
              console.log("item.text",item.text);
            item.text = "https://sephora.com" + item.text;
            console.log("item.text",item.text);
          })
          }

          if (row.variantInformation) {
            row.variantInformation.forEach(item => {
            item.text = item.text.replace("COLOR: ","").trim();
          })
          }

          // if (row.variants) {
          //   console.log("row.variants",row.variants);
          //   row.variants.forEach(item => {
          //     item.text = item.text.replace('/productimages/sku/s','').trim();
          //     item.text = item.text.split("+");
          //     console.log("item.text2",item.text);
          // })
          // }

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