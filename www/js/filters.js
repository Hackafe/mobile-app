angular.module('starter.filters', [])

.filter('discourse_template', function(){
  return function(template, base){
    console.log('templated', template);

    var template = new URITemplate(template);
    var uri = new URI(template.expand({size: 500}));

    console.log('expanded', ""+uri);

    if (uri.is('relative')) {
      if (!base) base='http://frm.hackafe.org/';
      uri = uri.absoluteTo(base);
    }

    console.log('absoluted', ""+uri);

    return ""+uri;
  };
})

;
