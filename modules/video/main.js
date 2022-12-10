let video = document.querySelectorAll(`video`);

video.forEach(index => {
    index.insertAdjacentHTML(`afterend`, `<div class="video__wrapper" data-video-state="paused">${index.outerHTML}</div>`);
    index.parentNode.removeChild(index);
});

video = document.querySelectorAll(`.video__wrapper`);

video.forEach(index => {
    index.insertAdjacentHTML(`beforeend`, `<div class="video__footer"><button class="video__play"></button><p class="video__time">00:00 / ${index.querySelector("video").duration}</p><input type="range" min="1" max="100" value="0" class="video__progress-bar"></div></div>`);
    index.querySelector(".video__play").addEventListener("click", function () {
        let videoState = index.getAttribute("data-video-state");
        if (videoState === "playing") {
            index.setAttribute("data-video-state", "paused");
            index.querySelector("video").pause();

        } else if (videoState === "paused") {
            index.setAttribute("data-video-state", "playing");
            index.querySelector("video").play();
        }
    });
});
