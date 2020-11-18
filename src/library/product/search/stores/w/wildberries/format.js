/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    const state = context.getState();
    let orgRankCounter = state.orgRankCounter || 0;
    let rankCounter = state.rankCounter || 0;
    for (const { group } of data) {
      for (const row of group) {
        try {
          if (row.price && row.price[0]) {
            row.price[0].text =
              row.price[0].text != ""
                ? `${row.price[0].text.split("₽")[0]}₽`
                : "";
          }
  
          // if (row.thumbnail) {
          //   let loadedImageUrl = "";
          //   row.thumbnail.map((item) => {
          //     loadedImageUrl += `https:${item.text}`;
          //   });
          //   row.thumbnail = [
          //     {
          //       text: loadedImageUrl,
          //     },
          //   ];
          // }
  
          if (!row.sponsored) {
            orgRankCounter = orgRankCounter + 1;
            row.rankOrganic = [{ text: orgRankCounter }];
          }
          rankCounter = rankCounter + 1;
          row.rank = [{ text: rankCounter }];
          context.setState({ orgRankCounter });
          context.setState({ rankCounter });
        } catch (exception) {
          console.log(exception);
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };