const data = [
  {
    id: 1,
    url: "https://zymmo-image-storage-staging.s3.amazonaws.com/cecd87f9408edfbf72e5f1ab83a32af0.mp4",
    title: "Putting Sugar On Top Of Cupcakes",
    cta: "Shop Now",
  },
  {
    id: 2,
    url: "https://zymmo-image-storage-staging.s3.amazonaws.com/c8101111447f5e9f3e93ef3076a87c72.mp4",
    title: "Top View of A Person Slicing Cherry Tomatoes Using a Knife",
    cta: "Order Now",
  },
  {
    id: 3,
    url: "https://zymmo-image-storage-staging.s3.amazonaws.com/e51f1e99e9777bb13f4e8a8664ff7998.mp4",
    title: "Pouring Honey on the Sliced Bananas",
    cta: "Buy Now",
  },
  {
    id: 4,
    url: "https://zymmo-image-storage-staging.s3.amazonaws.com/df687a19bfa352a0250a2dcc3fa9760c.mp4",
    title: "Cooking Dumplings",
    cta: "Order Now",
  },
  {
    id: 5,
    url: "https://zymmo-image-storage-staging.s3.amazonaws.com/a68130e6b5ac0ee74ff7790fe6b77c02.mp4",
    title: "A Person Stirring a Broccoli Soup Using a Spoon",
    cta: "Shop Now",
  },
  {
    id: 6,
    url: "https://zymmo-image-storage-staging.s3.amazonaws.com/10cf33744b87483b769478f51730d46d.mp4",
    title: "Person Cutting A Onion",
    cta: "Buy Now",
  },
];
// fetch(
//   "https://dev.vudoo.zymmo.com/play/v1/12e2d10a-5047-47b2-b348-5d1576f21947",
//   {
//     method: "GET",
//     headers: {
//       Authorization:
//         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJhY2NvdW50SWQiOjEwLCJpYXQiOjE2NDYxMTM5ODIsImV4cCI6MTY0ODcwNTk4Mn0.2iWMxEzevw0a0B-dnUMTMSO6Zq_MZ1M7qVOCjjkg5Ok",
//     },
//   }
// )
//   .then((response) => response.json())
//   .then((json) => console.log(json));
// .catch(err => console.log(err));
const d = document.getElementById("video-page");
data.forEach(function (row, key) {
  // var newRow = document.createElement("tr");
  // tableBody.appendChild(newRow);

  d.innerHTML += `
  <div id="popup-${key}" class="popup">
 <header>
   <span>Share Modal</span>
   <div id="close-${key}" class="close"><i class="bi bi-x-lg"></i></div>
 </header>
 <div class="content">
   <ul class="icons">
     <a id="facebook-${key}" href="#"><i class="bi bi-facebook"></i></a>
     <a id="twitter-${key}" href="#"><i class="bi bi-twitter"></i></a>
     <a id="telegram-${key}" href="#"><i class="bi bi-telegram"></i></i></a>
     <a id="whatsapp-${key}" href="#"><i class="bi bi-whatsapp"></i></a>
     <a id="mail-${key}" href="#"><i class="bi bi-envelope"></i></a>
   </ul>
   <p>Or copy link</p>
      <div class="field">
      
        <input type="text" readonly value=${row.url}>
        <button id="clip-${key}">Copy</button>
      </div>
   </div>
</div>
  <div class="video-container outer-max-width">
    <div class="video-cards" id="video-cards-${key}">
    <video
    id=video-${key}
    class="video-player"
    src=${row.url}
    muted="muted"
    playsInline
  />
    </div>
    <div class="video-header" id="video-header-${key}">
    <h3 class="video-title">${row.title}</h3>
  </div>
    <div class="progress">
    <div
      class="progress-bar"
      id="progress-bar-${key}"
      style="width: 0%;"
      role="progressbar"></div>
  </div>
    <div class="video-footer">
    <div class="video-footer-div">
    <i style="font-size:1.2rem;" id="shareBtn-${key}" class="video-icon bi bi-share-fill"></i>
    <i style="font-size:1.5rem;" id=unMute-${key} class="video-icon bi bi-volume-mute-fill"></i>
    </div>
    <div>
      <a href="/">
        <button class="video-footer-button">${row.cta}</button>
      </a>
    </div>
  </div>
  <div id="video-ended-${key}" class="video-ended">
  <i id="video-ended-icon-${key}" class="bi bi-arrow-clockwise" style="font-size:2rem;"></i>
</div>`;
});
var videoPlayers = Array.from(document.querySelectorAll(".video-player"));
var videofooters = document.querySelectorAll(".video-footer-div");
videoPlayers.map((item, key) => {
  const soundControl = document.getElementById(`unMute-${key}`);
  const videoCards = document.getElementById(`video-cards-${key}`);
  const videoHeaders = document.getElementById(`video-header-${key}`);
  const share = document.getElementById(`shareBtn-${key}`);
  const popup = document.getElementById(`popup-${key}`);
  const close = document.querySelectorAll(`.close`);
  const shareTest = document.querySelectorAll(`.video-icon`);
  const restartDiv = document.getElementById(`video-ended-${key}`);
  const restartButton = document.getElementById(`video-ended-icon-${key}`);
  const facebookBtn = document.getElementById(`facebook-${key}`);
  const twitterBtn = document.getElementById(`twitter-${key}`);
  const telegramBtn = document.getElementById(`telegram-${key}`);
  const whatsappBtn = document.getElementById(`whatsapp-${key}`);
  const mailBtn = document.getElementById(`mail-${key}`);
  const clipboardBtn = document.getElementById(`clip-${key}`);
  share.addEventListener("click", () => {
    popup.setAttribute("class", `popup`);
    popup.classList.toggle("show");
  });
  for (let i = 0; i < close.length; i++) {
    close[i].addEventListener("click", () => {
      popup.setAttribute("class", `popup`);
      popup.classList.toggle("hide");
    });
  }

  for (let i = 0; i < shareTest.length; i++) {
    shareTest[i].addEventListener("click", () => {
      popup.setAttribute("class", `popup`);
      popup.classList.toggle("hide");
    });
  }
  share.addEventListener("click", () => {
    popup.setAttribute("class", `popup`);
    popup.classList.toggle("show");
  });

  // social buttons
  facebookBtn.addEventListener("click", () => {
    facebookBtn.setAttribute(
      "href",
      `https://www.facebook.com/sharer.php?u=${item.src}`
    );
  });

  twitterBtn.addEventListener("click", () => {
    twitterBtn.setAttribute(
      "href",
      `https://twitter.com/share?url="+encodeURIComponent(${item.src})`
    );
  });

  whatsappBtn.addEventListener("click", () => {
    whatsappBtn.setAttribute(
      "href",
      `https://wa.me/?text=${"Share This Video Link"} ${item.src}`
    );
  });

  telegramBtn.addEventListener("click", () => {
    telegramBtn.setAttribute(
      "href",
      ` https://telegram.me/share/url?url=${item.src}&text="Share This Video Link"`
    );
  });

  mailBtn.addEventListener("click", () => {
    mailBtn.setAttribute(
      "href",
      `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=Share Video Link&body=${item.src}&ui=2&tf=1&pli=1`
    );
  });

  clipboardBtn.addEventListener("click", () => {
    var dummy = document.createElement("input");

    // Add it to the document
    document.body.appendChild(dummy);

    // Set its ID
    dummy.setAttribute("id", "dummy_id");

    // Output the array into it
    document.getElementById("dummy_id").value = item.src;

    // Select it
    dummy.select();

    // Copy its contents
    document.execCommand("copy");

    // Remove it as its not needed anymore
    document.body.removeChild(dummy);
    // clipboardBtn.childNodes[0].setAttribute("class", `bi bi-check`);
    clipboardBtn.value = "Copied";
    clipboardBtn.innerHTML = "Copied";
    setTimeout(() => {
      // clipboardBtn.childNodes[0].setAttribute("class", `bi bi-clipboard`);
      clipboardBtn.value = "Copy";
      clipboardBtn.innerHTML = "Copy";
    }, 3000);
  });

  soundControl.addEventListener("click", function () {
    if (item.muted) {
      item.muted = false;
      soundControl.setAttribute("class", `video-icon bi bi-volume-up-fill`);
    } else {
      item.muted = true;
      soundControl.setAttribute("class", `video-icon bi bi-volume-mute-fill`);
    }
  });

  restartButton.addEventListener("click", () => {
    item.play();
    restartDiv.style.display = "none";
    videoCards.setAttribute("class", `video-cards video-cards-show`);
    videoHeaders.setAttribute("class", `video-header video-header-hide`);
  });

  item.addEventListener("mouseout", function () {
    this.pause();
    videoCards.setAttribute("class", `video-cards video-cards-hide`);
    videoHeaders.setAttribute("class", `video-header video-header-show`);
  });
  if (window.innerWidth >= 600) {
    item.addEventListener("mouseover", function () {
      this.play();
      videoCards.setAttribute("class", `video-cards video-cards-show`);
      videoHeaders.setAttribute("class", `video-header video-header-hide`);
    });
    if (item.paused) {
      videoCards.setAttribute("class", `video-cards video-cards-hide`);
      videoHeaders.setAttribute("class", `video-header video-header-show`);
    }
    item.addEventListener("click", function () {
      this.pause();
      videoCards.setAttribute("class", `video-cards video-cards-hide`);
      videoHeaders.setAttribute("class", `video-header video-header-show`);
    });
  }
  if (window.innerWidth <= 600) {
    if (item.paused) {
      videoCards.setAttribute("class", `video-cards video-cards-hide`);
      videoHeaders.setAttribute("class", `video-header video-header-show`);
    }
    item.addEventListener("click", function () {
      if (this.paused) {
        this.play();
        videoCards.setAttribute("class", `video-cards video-cards-show`);
        videoHeaders.setAttribute("class", `video-header video-header-hide`);
      } else {
        this.pause();
        videoCards.setAttribute("class", `video-cards video-cards-hide`);
        videoHeaders.setAttribute("class", `video-header video-header-show`);
      }
    });
  }
  item.addEventListener("timeupdate", function () {
    var v = document.getElementById(`video-${key}`);
    var progress = document.getElementById(`progress-bar-${key}`);
    progress.style.width = "10%";
    if ((v.currentTime / v.duration) * 100 > 10) {
      progress.style.width = `${(v.currentTime / v.duration) * 100}%`;
    }
    console.log((v.currentTime / v.duration) * 100);
  });
  item.addEventListener("ended", function () {
    restartDiv.style.display = "flex";
  });
});

// }
