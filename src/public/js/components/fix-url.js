//fix urls http bit
function fixUrl(url){
  // Missing http
  if (!/^.+[:\/\/]+|\/+/i.test(url)) {
    url = 'http://'+url;
    return url;
  // Else if they misspelled http
  } else if ( /^.+[:\/\/]+|\/+/i.test(url) && !/^(f|ht)tps?:\/\//i.test(url) ) {
    url = url.replace(/^.+[:\/\/]+|\/+/, 'http://');
    return url;
  }
  return url;
}

export default function(el){
  el = document.querySelector(el);
  el.addEventListener('change',function(){
    this.value = fixUrl(this.value);
  });

  el.addEventListener('blur',function(){
    this.value = fixUrl(this.value);
  });

  el.form.addEventListener('submit',function(){
    this.value = fixUrl(this.value);
  });
}
