window.onload=function () {
  let input=document.querySelector('#input')
  let path=document.querySelector('#path')
  input.addEventListener('input', function() {
    path.setAttribute('d', input.value);
  });


}