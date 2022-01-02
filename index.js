/* ============ HTML SELECTION  ============ */

/* ============ API INFO  ============ */
const api_key = 'AIzaSyCK8nPNMY3aPHUHwqFU_U5HVfoljf8kg0I';
const videosUrl = 'https://www.googleapis.com/youtube/v3/videos?';
const channel_http = 'https://www.googleapis.com/youtube/v3/channels?';
// let watchVideo = 'https://www.youtube.com/watch?v=';
const imbedVideoSrc = 'https://www.youtube.com/embed/';
const goToChannel = 'https://www.youtube.com/channel/';
const searchLink = 'https://www.youtube.com/results?search_query=';
/* ============ SITE LOGIC  ============ */
const videos = [];
/* ============ START ============ */

window.onresize = function () {
  const main = document.querySelector('.main');
  const left = document.querySelector('.left');
  const commentsWrapper = document.querySelector('.comments');
  const screenWidth = window.innerWidth;
  if (screenWidth < 760) {
    main.append(commentsWrapper);
  } else {
    left.append(commentsWrapper);
  }
};

// fetch data

fetch(
  videosUrl +
    new URLSearchParams({
      key: api_key,
      part: 'snippet',
      chart: 'mostPopular',
      maxResults: 50,
      regionCode: 'FR',
    })
)
  .then((res) => res.json())
  .then((data) => {
    // console.log(data);
    data.items.forEach((item) => {
      const { channelTitle, channelId, title, description, publishedAt } =
        item.snippet;
      const id = item.id;
      const thumbnail = item.snippet.thumbnails.default.url;
      videos.push({
        channelTitle,
        description,
        publishedAt,
        title,
        thumbnail,
        id,
        channelId,
      });
    });
  })
  .then(() => {
    const video = getRandomVideo();
    updateLeftSideHtml(video);
    updateRightSideHtml();
    addEvents();
  })
  .catch((err) => console.log(err));

function getRandomVideo() {
  const r = Math.floor(Math.random() * videos.length);
  return videos[r];
}
// update html
function updateLeftSideHtml(video) {
  const iframe = document.querySelector('.video');
  const channelName = document.querySelector('.channel-name');
  const videoTitle = document.querySelector('.video-title');
  const channelIconLink = document.querySelector('.channel-icon-link');
  const videoDescription = document.querySelector('.description');
  const { channelTitle, description, title, id, channelId } = video;
  iframe.src = imbedVideoSrc + id;
  videoTitle.textContent = title;
  videoDescription.textContent = description;
  channelName.textContent = channelTitle;
  channelName.parentElement.href = goToChannel + channelId;
  updateChannelIcon(channelId);
  channelIconLink.href = goToChannel + channelId;
}

// updte right side
function updateRightSideHtml() {
  const videosContainer = document.querySelector('.videos-container');
  videos.forEach((video) => {
    const { thumbnail, channelTitle, publishedAt, title, channelId } = video;
    const linkToChannel = goToChannel + channelId;
    const vMiniature = document.createElement('div');
    vMiniature.classList.add(
      'd-flex',
      'justify-content-start',
      'align-items-start',
      'mb-2'
    );
    vMiniature.innerHTML = `<img class="c-pointer v-thumnail" src="${thumbnail}"></img>
  <div class="ms-1">
    <h6 class="mb-1 c-pointer v-title">${title}</h6>
    <a class="link-dark text-decoration-none" href="${linkToChannel}"><h6 class="text-secondary fs-90">${channelTitle}</h6></a>
    <p class="text-secondary">${publishedAt}</p>
  </div>`;
    videosContainer.append(vMiniature);
    const imgThumnail = vMiniature.querySelector('.v-thumnail');
    const vTitle = vMiniature.querySelector('.v-title');
    [imgThumnail, vTitle].forEach((elem) =>
      elem.addEventListener('click', () => {
        const subscribeBtn = document.querySelector('.subscribe-btn');
        const commentsContainer = document.querySelector('.comments-container');
        const span = document.querySelector('.n-comments');
        updateLeftSideHtml(video);
        subscribeBtn.textContent = "s'abonner";
        commentsContainer.innerHTML = '';
        span.textContent = 0;
      })
    );
  });
}

// add events
function addEvents() {
  const searchInput = document.querySelector('.search-input');
  const searchForm = document.querySelector('.search-form');
  const commentsContainer = document.querySelector('.comments-container');
  const videoDescription = document.querySelector('.description');
  const plusBtn = document.querySelector('.plus');
  const CommentForm = document.querySelector('.add-comment');
  const subscribeBtn = document.querySelector('.subscribe-btn');
  // subscribe btn
  subscribeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const txt = subscribeBtn.textContent;
    if (txt === "s'abonner") {
      subscribeBtn.textContent = 'abonné';
    } else {
      subscribeBtn.textContent = "s'abonner";
    }
  });
  // show more btn
  plusBtn.addEventListener('click', () => {
    videoDescription.classList.toggle('hideText');
  });
  // comment form
  CommentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('comment-input');
    const value = input.value;
    if (!value) return;
    const comment = document.createElement('div');
    comment.classList.add(
      'd-flex',
      'justify-content-start',
      'align-items-center',
      'mt-2'
    );
    comment.innerHTML = `<img class="me-1" src="./img/man.png" alt="" />
<div>
<h6>current user</h6>
<p class="text-secondary">${value}</p>
</div>
`;
    commentsContainer.prepend(comment);
    input.value = '';
    const span = document.querySelector('.n-comments');
    let numberOfComments = span.textContent;
    span.textContent = parseInt(numberOfComments) + 1;
  });
  // search bar
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = searchInput.value;
    if (value.length) {
      form.reset();
      location.href = searchLink + value;
    }
  });
}

function updateChannelIcon(chId) {
  const channelIcon = document.querySelector('.channel-icon');
  fetch(
    channel_http +
      new URLSearchParams({
        key: api_key,
        part: 'snippet',
        id: chId,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      const channelThumbnail = data.items[0].snippet.thumbnails.default.url;

      channelIcon.src = channelThumbnail;
    });
}
