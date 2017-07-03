var thingTemplate = _.template($('#thingItem').html());
var moduleTemplate = _.template($('#moduleItem').html());

$('#searchField').keyup(function(){
  $('#searchResults').removeClass('hidden');
  $('#moduleList').empty();
  $('#thingList').empty();
  if ($('#searchField').val().length > 0) {
    $.getJSON('/api/search?q=' + $('#searchField').val(), function(data){
      data.things.forEach(function(thing){
        $('#thingList').append(thingTemplate(thing));
      });
      data.modules.forEach(function(module){
        $('#moduleList').append(moduleTemplate(module));
      });
    });
  } else {
     $('#searchResults').addClass('hidden');
  }
});