document.addEventListener("DOMContentLoaded", function(event) {
    var $body = document.querySelector('body');
    var $headerTitle = document.querySelector('.js-header-title');
    var $socialLink = document.querySelector('.js-social-link');
    var $navigationLink = document.querySelectorAll('.js-navigation-link');
  
    if ($body.classList.contains('is-full-page')) {
      $headerTitle.setAttribute('tabindex', '-1');
    } else {
      setTimeout(function(){
        $body.classList.add('is-loaded');
      }, 100);
      $socialLink.setAttribute('tabindex', '-1');
    }
  
    // When the user clicks on the head title show the full page
    $headerTitle.addEventListener('click', function(event) {
      event.preventDefault();
      $body.classList.toggle('is-full-page');
      window.history.pushState(null, null, '/');
  
      $headerTitle.setAttribute('tabindex', '-1');
      $socialLink.setAttribute('tabindex', '0');
  
      for (var i = 0; i < $navigationLink.length; i++) {
        $navigationLink[i].classList.remove('is-active');
      }
    });
  
    // Check which navigation item is active
    setActiveNavigationLink();
  
    // Loop through all navigation links and add event listner to click
    for (var i = 0; i < $navigationLink.length; i++) {
      $navigationLink[i].addEventListener('click', function(event) {
  
        // Only load with javascript when current page is full width / height
        if ($body.classList.contains('is-full-page')) {
          event.preventDefault();
  
          var url = this.getAttribute('href');
  
          $headerTitle.setAttribute('tabindex', '0');
          $socialLink.setAttribute('tabindex', '-1');
  
          // Check if fecth is supported
          if (self.fetch) {
  
            // Fetch the html
            fetch(url).then(function(response) {
              var html = response.text();
  
              html.then(function(val) {
                var element = document.createElement("div");
                element.innerHTML = val;
                var pageContent = element.querySelector('.js-page-content')
                document.querySelector('.page').innerHTML = pageContent.outerHTML;
              });
  
              $body.classList.toggle('is-full-page');
              window.history.pushState(null, null, url);
              setActiveNavigationLink(url);
            });
          }
        }
      });
    }
  });
  
  /**
   * Check which navigation item is active by matching the url and the href
   * of the link.
   * @param url
   **/
  function setActiveNavigationLink(url = null)
  {
    var $navigationLink = document.querySelectorAll('.js-navigation-link');
  
    if (url == null) {
      url = window.location.pathname;
    }
  
    for (var i = 0; i < $navigationLink.length; i++) {
      var href = $navigationLink[i].getAttribute('href');
      if (href.indexOf(url) != -1 && url != '/') {
        console.warn(url);
        $navigationLink[i].classList.add('is-active');
        $navigationLink[i].setAttribute('tabindex','1')
      }
    }
  
  }