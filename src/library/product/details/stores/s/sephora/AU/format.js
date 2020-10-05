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

          if(row.brandLink){
            let text = row.brandLink[0].text;
            row.brandLink[0].text = `https://www.sephora.com.au${text}`
          }


          
          if(row.alternateImages){
              let imageArray = [];
              if(row.alternateImages.length > 1){
                for(let i = 0; i < row.alternateImages.length; i++){
                  let text = row.alternateImages[i].text
                  if(!imageArray.includes(text) && !text.includes("sephora_logo")){
                    imageArray.push(text);
                  }
                }
                let oneLess = imageArray.slice(1);
                let joins = oneLess.join(" | ");
                row.alternateImages = [{text: joins}]
              } else {
                row.alternateImages = [{text: ""}]
              }
          }

        //   if(row.aggregateRating){
        //       let text = row.aggregateRating[0].text;
        //       let splits = text.split(" /");
        //     row.aggregateRating[0].text = splits[0];
        // }


          if(row.firstVariant){
            let text = row.firstVariant[0].text;
            if(text.includes("variant-swatch")){
              text = text.split("-swatch-")
              if(text[1]){
                row.firstVariant[0].text = text[1]
              }
            }

          }

          if(row.nameExtended){
            let newName = [];
            let text = row.nameExtended.forEach(name => {
                newName.push(name.text)
                name.text = "";
            })
            let joins = newName.join(" ")
            row.nameExtended = [{text: joins}]
          }

          if(row.additionalDescBulletInfo){
            for(let i = 0; i < row.additionalDescBulletInfo.length; i++){
              let text = row.additionalDescBulletInfo[i].text.replace(/\||/g, "")
              row.additionalDescBulletInfo[i].text = text
            }
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