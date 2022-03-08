//  integration type taken from fireworks
const integrationTypes = ["floating_player", "grid", "carousel", "story_block"];
const integrationId = "12e2d10a-5047-47b2-b348-5d1576f21947";
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
const baseEvent = {
  visitor: localStorage.getItem("visitorId")
    ? localStorage.getItem("visitorId")
    : uuidv4(),
  session: sessionStorage.getItem("sessionId")
    ? sessionStorage.getItem("sessionId")
    : uuidv4(),
  integrationType: integrationTypes[2],
  integrationId: integrationId,
  pageUrl: "",
  timestamp: "",
};
const events = [];
localStorage.setItem("visitorId", baseEvent.visitor);
sessionStorage.setItem("sessionId", baseEvent.session);

fetch("https://dev.vudoo.zymmo.com/play/v1/" + integrationId)
  .then((response) => response.json())
  .then((json) => {
    const d = document.getElementById("video-page");
    json.data.videos.forEach(function (row, key) {
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
          
            <input type="text" readonly value=${row.resource.urls.original}>
            <button id="clip-${key}">Copy</button>
          </div>
       </div>
    </div>
      <div class="video-container outer-max-width">
        <div class="video-cards" id="video-cards-${key}">
        <video
        id=video-${key}
        class="video-player"
        poster=${row.poster.urls.original}
        src=${row.resource.urls.original}?id=${row.id}
        muted="muted"
        playsInline
      />
        </div>
        <div class="video-header" id="video-header-${key}">
        <h3 class="video-title">${row.caption}</h3>
      </div>
        <div class="progress">
        <div
          class="progress-bar"
          id="progress-bar-${key}"
          style="width: 0%;"
          role="progressbar"></div>
      </div>
        <div class="video-footer" id=video-footer-${key}>
        <div class="video-footer-div">
        <i style="font-size:1.2rem;" id="shareBtn-${key}" class="video-icon bi bi-share-fill"></i>
        <i style="font-size:1.5rem;" id=unMute-${key} class="video-icon bi bi-volume-mute-fill"></i>
        </div>
        <div>
            <button class="video-footer-button" value="${row.ctaBtnUrl}" onclick="ctaEvent(this.value,${row.id})">${row.ctaBtnTitle}</button>
          
        </div>
      </div>
      <div id="video-started-${key}" class="video-started">
      <i id="video-started-icon-${key}" class="bi bi-play" style="font-size:2rem;"></i>
    </div>
    <div id="video-paused-${key}" class="video-paused">
    <i id="video-paused-icon-${key}" class="bi bi-pause" style="font-size:2rem;"></i>
  </div>
      <div id="video-ended-${key}" class="video-ended">
      <i id="video-ended-icon-${key}" class="bi bi-arrow-clockwise" style="font-size:2rem;"></i>
    </div>`;
    });
    // var checkVideoPaused = false;
    var checkVideoPaused = [];
    var checkVideoPausedMobile = [];
    var checkVideoEnded = [];
    var videoPlayers = Array.from(document.querySelectorAll(".video-player"));
    var videofooters = document.querySelectorAll(".video-footer-div");

    //video loaded event
    if (!navigator.sendBeacon) return;
    const pageLoadEvent = {
      ...baseEvent,
      timestamp: new Date().toISOString(),
      type: "load",
    };
    const headers = {
      type: "application/json",
    };
    // const blob = new Blob([JSON.stringify([pageLoadEvent])], headers);
    const params = new URLSearchParams();
    params.set("data", pageLoadEvent);
    // fetch("https://dev.vudoo.zymmo.com/play/v1/events", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(pageLoadEvent),
    // })
    //   .then((res) => res.json())
    //   .then((res) => console.log(res));
    // events.push(pageLoadEvent);
    // console.log("loaded", pageLoadEvent);

    navigator.sendBeacon("https://dev.vudoo.zymmo.com/play/v1/events", params);
    videoPlayers.map((item, key) => {
      checkVideoPaused[key] = false;
      checkVideoPausedMobile[key] = false;
      checkVideoEnded[key] = false;
      const soundControl = document.getElementById(`unMute-${key}`);
      const videoCards = document.getElementById(`video-cards-${key}`);
      const videoHeaders = document.getElementById(`video-header-${key}`);
      const share = document.getElementById(`shareBtn-${key}`);
      const popup = document.getElementById(`popup-${key}`);
      const close = document.querySelectorAll(`.close`);
      const shareTest = document.querySelectorAll(`.video-icon`);
      const restartDiv = document.getElementById(`video-ended-${key}`);
      const restartButton = document.getElementById(`video-ended-icon-${key}`);
      const playDiv = document.getElementById(`video-started-${key}`);
      const playButton = document.getElementById(`video-started-icon-${key}`);
      const pauseDiv = document.getElementById(`video-paused-${key}`);
      const pauseButton = document.getElementById(`video-paused-icon-${key}`);
      const facebookBtn = document.getElementById(`facebook-${key}`);
      const twitterBtn = document.getElementById(`twitter-${key}`);
      const telegramBtn = document.getElementById(`telegram-${key}`);
      const whatsappBtn = document.getElementById(`whatsapp-${key}`);
      const mailBtn = document.getElementById(`mail-${key}`);
      const clipboardBtn = document.getElementById(`clip-${key}`);
      const footerDiv = document.getElementById(`video-footer-${key}`);

      // share modal functionality
      share.addEventListener("click", () => {
        popup.setAttribute("class", `popup`);
        popup.classList.toggle("show");
      });

      // close modal
      for (let i = 0; i < close.length; i++) {
        close[i].addEventListener("click", () => {
          popup.setAttribute("class", `popup`);
          popup.classList.toggle("hide");
        });
      }

      // open modal

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

      // mute unmute
      soundControl.addEventListener("click", function () {
        if (item.muted) {
          item.muted = false;
          soundControl.setAttribute("class", `video-icon bi bi-volume-up-fill`);
        } else {
          item.muted = true;
          soundControl.setAttribute(
            "class",
            `video-icon bi bi-volume-mute-fill`
          );
        }
        if (
          item.paused &&
          checkVideoPausedMobile[key] == false &&
          checkVideoPaused[key] == false &&
          checkVideoEnded[key] == false
        ) {
          item.play();
          playDiv.style.display = "none";
          videoCards.setAttribute("class", `video-cards video-cards-show`);
          videoHeaders.setAttribute("class", `video-header video-header-hide`);
        }
      });

      // replay video
      restartButton.addEventListener("click", () => {
        item.play();
        restartDiv.style.display = "none";
        checkVideoEnded[key] = false;
        videoCards.setAttribute("class", `video-cards video-cards-show`);
        videoHeaders.setAttribute("class", `video-header video-header-hide`);
      });

      // pause video on mouse out
      item.addEventListener("mouseout", function () {
        if (checkVideoEnded[key] == false) {
          this.pause();
          playDiv.style.display = "flex";
          pauseDiv.style.display = "none";
          videoCards.setAttribute("class", `video-cards video-cards-hide`);
          videoHeaders.setAttribute("class", `video-header video-header-show`);
        }
      });

      // web view
      if (window.innerWidth >= 600) {
        playButton.addEventListener("click", () => {
          item.play();
          playDiv.style.display = "none";
          pauseDiv.style.display = "flex";
          checkVideoPaused[key] = false;
          videoCards.setAttribute("class", `video-cards video-cards-show`);
          videoHeaders.setAttribute("class", `video-header video-header-hide`);
        });
        pauseButton.addEventListener("mouseover", () => {
          item.play();
          playDiv.style.display = "none";
          pauseDiv.style.display = "flex";
          checkVideoPaused[key] = false;
          videoCards.setAttribute("class", `video-cards video-cards-show`);
          videoHeaders.setAttribute("class", `video-header video-header-hide`);
        });
        pauseButton.addEventListener("click", () => {
          item.pause();
          playDiv.style.display = "flex";
          pauseDiv.style.display = "none";
          checkVideoPaused[key] = true;
          videoCards.setAttribute("class", `video-cards video-cards-hide`);
          videoHeaders.setAttribute("class", `video-header video-header-show`);
        });
        // footer hover effect added
        footerDiv.addEventListener("mouseover", function () {
          if (checkVideoPaused[key] == false && checkVideoEnded[key] == false) {
            item.play();
            playDiv.style.display = "none";
            pauseDiv.style.display = "flex";
            videoCards.setAttribute("class", `video-cards video-cards-show`);
            videoHeaders.setAttribute(
              "class",
              `video-header video-header-hide`
            );
          }
        });
        footerDiv.addEventListener("mouseout", function () {
          if (checkVideoPaused[key] == false && checkVideoEnded[key] == false) {
            item.pause();
            playDiv.style.display = "flex";
            pauseDiv.style.display = "none";
            videoCards.setAttribute("class", `video-cards video-cards-hide`);
            videoHeaders.setAttribute(
              "class",
              `video-header video-header-show`
            );
          }
        });
        // https://zymmo-image-storage-dev.s3.amazonaws.com/67f7d684008c18950ebb4ea1f2db230d.jpg
        item.addEventListener("mouseover", function () {
          if (checkVideoPaused[key] == false && checkVideoEnded[key] == false) {
            this.play();
            playDiv.style.display = "none";
            pauseDiv.style.display = "flex";
            checkVideoPaused[key] = false;
            videoCards.setAttribute("class", `video-cards video-cards-show`);
            videoHeaders.setAttribute(
              "class",
              `video-header video-header-hide`
            );
          }
        });
        if (item.paused) {
          videoCards.setAttribute("class", `video-cards video-cards-hide`);
          videoHeaders.setAttribute("class", `video-header video-header-show`);
        }
        // item.addEventListener("click", function () {
        //   if (checkVideoEnded[key] == false) {
        //     this.pause();
        //     playDiv.style.display = "flex";
        //     pauseDiv.style.display = "none";
        //     checkVideoPaused[key] = true;
        //     videoCards.setAttribute("class", `video-cards video-cards-hide`);
        //     videoHeaders.setAttribute(
        //       "class",
        //       `video-header video-header-show`
        //     );
        //   }
        // });
      }

      // mobile view
      if (window.innerWidth <= 600) {
        if (item.paused) {
          videoCards.setAttribute("class", `video-cards video-cards-hide`);
          videoHeaders.setAttribute("class", `video-header video-header-show`);
        }
        playButton.addEventListener("click", () => {
          item.play();
          checkVideoPausedMobile[key] = false;
          playDiv.style.display = "none";
          pauseDiv.style.display = "flex";
          videoCards.setAttribute("class", `video-cards video-cards-show`);
          videoHeaders.setAttribute("class", `video-header video-header-hide`);
        });

        pauseButton.addEventListener("click", () => {
          item.pause();
          playDiv.style.display = "flex";
          pauseDiv.style.display = "none";
          checkVideoPausedMobile[key] = true;
          videoCards.setAttribute("class", `video-cards video-cards-hide`);
          videoHeaders.setAttribute("class", `video-header video-header-show`);
        });
        item.addEventListener("click", function () {
          if (this.paused && checkVideoEnded[key] == false) {
            this.play();
            checkVideoPausedMobile[key] = false;
            playDiv.style.display = "none";
            pauseDiv.style.display = "flex";
            videoCards.setAttribute("class", `video-cards video-cards-show`);
            videoHeaders.setAttribute(
              "class",
              `video-header video-header-hide`
            );
          } else if (checkVideoEnded[key] == false) {
            this.pause();
            checkVideoPausedMobile[key] = true;
            playDiv.style.display = "flex";
            pauseDiv.style.display = "none";
            videoCards.setAttribute("class", `video-cards video-cards-hide`);
            videoHeaders.setAttribute(
              "class",
              `video-header video-header-show`
            );
          }
        });
      }

      // progress bar
      var timeUpdate = 0;
      item.addEventListener("timeupdate", function () {
        var getVideo = document.getElementById(`video-${key}`);
        var videoUrl = getVideo.getAttribute("src");
        const strs = videoUrl.split("?id=");
        const videoId = parseInt(strs.at(-1));
        // console.log(as.getAttribute("src"));
        var v = document.getElementById(`video-${key}`);
        var progress = document.getElementById(`progress-bar-${key}`);
        progress.style.width = "10%";
        if ((v.currentTime / v.duration) * 100 > 10) {
          progress.style.width = `${(v.currentTime / v.duration) * 100}%`;
        }

        // console.log((v.currentTime / v.duration) * 100);
        if (parseInt(v.currentTime) % 4 != 0) {
          timeUpdate = 0;
        }
        if (parseInt(v.currentTime) % 4 == 0 && parseInt(v.currentTime) !== 0) {
          timeUpdate += 1;
          // tempOne = parseInt(v.currentTime);
          // if(abc != )
          if (timeUpdate === 1) {
            // if (!navigator.sendBeacon) return;
            const progressEvent = {
              ...baseEvent,
              timestamp: new Date().toISOString(),
              type: "progress",
              videoId: videoId,
              watch_time: v.currentTime,
              seek: v.currentTime,
            };
            events.push(progressEvent);
            // navigator.sendBeacon(url, dataHistoryBlob);
            console.log("fourseconds", progressEvent);
          }
        }
      });

      var a = 0;
      // restart button
      item.addEventListener("ended", function () {
        restartDiv.style.display = "flex";
        videoCards.setAttribute("class", `video-cards video-cards-hide`);
        videoHeaders.setAttribute("class", `video-header video-header-show`);
        checkVideoEnded[key] = true;
        playDiv.style.display = "none";
        pauseDiv.style.display = "none";
        a = 0;
        // if (!navigator.sendBeacon) return;

        // navigator.sendBeacon(
        //   "https://dev.vudoo.zymmo.com/play/v1/events",
        //   dataHistoryBlob
        // );
      });

      // video started
      // item.addEventListener("playing", function () {
      //   a += 1;
      //   if (a == 1) {
      //     // if (!navigator.sendBeacon) return;
      //     const dataHistoryBlob = JSON.stringify({
      //       videoStarted: true,
      //       videoEnded: false,
      //       fourSeconds: false,
      //       videoLoaded: false,
      //     });
      //     console.log("started", dataHistoryBlob);

      //     // navigator.sendBeacon(url, dataHistoryBlob);
      //   }
      // });
    });
  });

// cta event
const ctaEvent = (url, id) => {
  const conversionEvent = {
    ...baseEvent,
    timestamp: new Date().toISOString(),
    type: "conversion",
    videoId: id,
  };
  console.log("ctaEvent", conversionEvent);
  fetch("https://dev.vudoo.zymmo.com/play/v1/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(conversionEvent),
  }).then((res) => (window.location = url));
  // .then((res) => {
  //   console.log(res);
  //   window.location = url;
  // });
};

setInterval(sendEvents, 10000);
function sendEvents() {
  if (events.length) {
    // if (!navigator.sendBeacon) return;
    // navigator.sendBeacon(
    //   "https://dev.vudoo.zymmo.com/play/v1/events",
    //   JSON.stringify(events)
    // );
    fetch("https://dev.vudoo.zymmo.com/play/v1/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(events),
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  }
}
