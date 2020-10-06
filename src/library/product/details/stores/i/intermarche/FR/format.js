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
        
          if(row.nameExtended){
            let nameArr = [];
            row.nameExtended.forEach(name => {              
              nameArr.push(name.text);
            })            
            row.nameExtended = [{text: " "}]
            if(nameArr.length > 1) { nameArr.splice(0,1)}
            let joins = nameArr.join(" ")
            row.nameExtended[0].text = joins;
            if(row.brandText[0].text) {
              row.nameExtended[0].text = row.brandText[0].text + row.nameExtended[0].text;
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
      }
    }
    // context.setState({ variantArray });
    return data;
  };
  module.exports = { transform };