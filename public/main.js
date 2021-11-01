const trash = document.getElementsByClassName('trash')

Array.from(trash).forEach(function(element) {
    element.addEventListener('click',  function(){
        const subject = this.parentNode.parentNode.childNodes[1].innerText
        const user = this.parentNode.childNodes[1].childNodes[1].innerText
        fetch('/entry', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'user': user,
            'subject': subject
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});