const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const moreButton = document.querySelector(".more-button");
const handler = document.querySelector(".handler");
let searchValue;
let page = 1;
let fetchLink;
let currentSearch;
//Event listener
searchInput.addEventListener("input", updateInput);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  page = 1;
  currentSearch = searchValue;
  searchImages(searchValue);
});

moreButton.addEventListener("click", loadMore);

function updateInput(e) {
  searchValue = e.target.value;
}

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();
  return data;
}

function generateImages(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `<div class="gallery-info">        
            <p>${photo.photographer}</p>
            <a href=${photo.src.original}>Original</a>
            </div>
            <img src=${photo.src.large}></img>`;
    gallery.appendChild(galleryImg);
  });
}

function generateError(query) {
  const errorMsg = document.createElement("div");
  errorMsg.classList.add("error-msg");
  errorMsg.innerHTML = `<p>Your search - ${query} - didn't match any images</p>`;
  handler.append(errorMsg);
  moreButton.classList.add("hide");
}

function removeError() {
  if (handler.hasChildNodes()) {
    console.log("IT HAS??");
    handler.children[0].remove();
  }
  moreButton.classList.remove("hide");
}

async function curatedPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated?per_page=20";
  const data = await fetchApi(fetchLink);
  generateImages(data);
}

async function searchImages(query) {
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=20`;
  const data = await fetchApi(fetchLink);
  console.log("Data after search");
  console.log(data);
  console.log(handler.childNodes);
  if (data.total_results) {
    removeError();
    generateImages(data);
  } else {
    generateError(query);
  }
}

async function loadMore() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=20&page=${page}`;
    console.log(fetchLink);
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=20&page=${page}`;
    console.log(fetchLink);
  }
  const data = await fetchApi(fetchLink);
  console.log(data);
  generateImages(data);
}

function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
}

curatedPhotos();
