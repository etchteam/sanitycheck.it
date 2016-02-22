// Fix urls http bit
function fixUrl(url) {
  let fixedUrl;

  if (!/^.+[:\/\/]+|\/+/i.test(url)) {
    // Missing http
    fixedUrl = `http://${url}`;
  } else if (/^.+[:\/\/]+|\/+/i.test(url) && !/^(f|ht)tps?:\/\//i.test(url)) {
    // Misspelt http
    fixedUrl = url.replace(/^.+[:\/\/]+|\/+/, 'http://');
  } else {
    fixedUrl = url;
  }

  return fixedUrl;
}

function setValue() {
  this.value = fixUrl(this.value);
}

export default (el) => {
  const input = document.querySelector(el);

  input.addEventListener('change', setValue);
  input.addEventListener('blur', setValue);
  input.form.addEventListener('submit', setValue);
};
