// var options = {
//   url: function(thing) {
//     return "api/search/thing?q=" + thing;
//   },

//   getValue: "name"
// };

// $("#provider-remote").easyAutocomplete(options);

var options = {
  url: function(q) {
    return "/api/search/things?q=" + q + "&format=json";
  },

  getValue: "name"

//  data: ["blue", "green", "pink", "red", "yellow"]
};

$("#input").easyAutocomplete(options);
$("#output").easyAutocomplete(options);