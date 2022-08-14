const container = document.getElementById("content");
const searchBtn = document.getElementById("searchBtn");
const BASE_URL = "https://api.github.com/search";
const TOTAL_ITEMS = 20;

// this function talk to the github api for the data
const fetchRepos = async (url) => {
  try {
    const res = await fetch(url);
    const data = await res.json();
    const itemsRaw = data.items.splice(0, TOTAL_ITEMS);
    const items = itemsRaw.map((item) => ({
      id: item.id,
      name: item.name,
      languagelanguage: item.language,
      forks: item.forks,
      url: item.html_url,
      stars: item.stargazers_count,
      owner: {
        name: item.owner.login,
        type: item.owner.type,
        avatar: item.owner.avatar_url
      }
    }));
    return items;
  } catch (error) {
    console.log(error?.message);
  }
};

// This function renders items into the dom (#content div)
const renderItems = (items) => {
  container.innerHTML = "";
  let list = `
  <div class='flex flex-col justify-center align-center p-10'>
`;

  items.forEach((item) => {
    list = `${list} 
      <div class='flex flex-col justify-center align-center mb-8 bg-slate-100 p-4 rounded'>
        <h1 class='text-slate-800 mb-1'>Name:  <span class='text-gray-600'>${
          item.name
        } </span></h1>
        <h2 class=' text-slate-800 mb-1'>Langauge: <span class='text-gray-600'>${
          item.language || "N/A"
        } </span> </h2>
        <h2 class='text-slate-800 mb-1'>Stars: <span class='text-gray-600'>${
          item.stars || "0"
        } </span></h2>
        <h2 class='text-slate-800 mb-1'>Link: <a href=${item.url}> ${
      item.url
    }</a></h2>
        <div class='flex align-items mt-2'>
          <img src=${item.owner.avatar} class="w-12 h-12 rounded-full mb-2" />
          <div class="ml-4 >
          <p className="text-slate-800 text-sm">Name: <span class='text-gray-600'>${
            item.owner.name
          } </span><p>
          <p className="text-slate-800 text-sm">Type: <span class='text-gray-600'>${
            item.owner.type
          } </span><p>
          </div>
        </div>
      </div>
    `;
  });

  list = `${list} </div>`;

  container.innerHTML = list;
};

const renderLoading = () => {
  container.innerHTML = "";
  container.innerHTML = `<div class="flex justify-center align-center">
  <h2 class="mr-8 pb-2">loading...</h2>
  <svg
    class="h-5 w-5 text-sky-500 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    ></circle>
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
</div>`;
};

const fetchTopRepos = async () => {
  try {
    renderLoading();
    const items = await fetchRepos(
      `${BASE_URL}/repositories?q=stars:>=500+fork:true`
    );

    renderItems(items);
  } catch (error) {
    console.log(error?.message);
  }
};

const fetchReposByUsername = async () => {
  const username = document.getElementById("username").value;
  if (!username) {
    return;
  }
  try {
    renderLoading();
    const items = await fetchRepos(
      `${BASE_URL}/repositories?q=user:${username} `
    );
    renderItems(items);
  } catch (error) {
    console.log(error?.message);
  }
};

searchBtn.onclick = fetchReposByUsername;
window.onload = fetchTopRepos;
