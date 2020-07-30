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
    .replace(/\"/g, ' " ');
    // .replace(/&#[0-9;]+/g, "");



  for (const { group } of data) {
    for (let row of group) {
      try {
        if (row.variants) {
          if(row.variants.length < 2){

            row.variants = [];
          }
        }

        if (row.variantInformation) {
          let variantsArray = [];
          if(row.variantInformation.length > 1){
            row.variantInformation.forEach(variant => {
              variantsArray.push(variant.text)
            })
            let variantString = variantsArray.join(" | ")
            row.variantInformation = [{ text: variantString }];
          }
        }

        if (row.firstVariant || row.variantId) {
          let text = row.firstVariant[0].text;
          let split = text.split('-')
          row.variantId = [{ text: `${split[split.length - 1]}` }];
          row.firstVariant = [{ text: `${split[split.length - 1]}` }];
        }

        if (row.sku) {
          row.productUrl = [{ text: `${row.productUrl[0].text}?skuid=${row.sku[0].text}` }];
        }
        if (row.manufacturerDescription) {
          let text = '';
          row.manufacturerDescription.forEach(item => {
            text += `${item.text.replace(/\n \n/g, ' ')}  `;
          });
          row.manufacturerDescription = [
            {
              text: text,
            },
          ];
        }

        if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0].text.length > 1) {
          row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.startsWith(' || ') ? row.additionalDescBulletInfo[0].text : ' || ' + row.additionalDescBulletInfo[0].text;
        }
    
        if (row.description) {
          let text = row.description[0].text
          let splits = text.split(" ");
          if(splits[splits.length - 1] === "||"){
            let joins = splits.slice(0,splits.length - 1).join(" ")
            row.description[0].text = joins
          }
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

        if (row.directions) {
          let text = row.directions[0].text
          let splits = text.split(" ");
          if(splits[splits.length - 1] === "||"){
            let joins = splits.slice(0,splits.length - 1).join(" ")
            row.directions[0].text = joins
          }
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
