import axios from "axios";
import * as $ from "jquery";

const $showsList: JQuery = $("#showsList");
const $episodesArea: JQuery = $("#episodesArea");
const $searchForm: JQuery = $("#searchForm");

const BASE_URL = "https://api.tvmaze.com";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

interface showFromAPI {
  show: {
    id: number;
    name: string;
    summary: string;
    image?: { original: string };
  };
}

interface showInterface {
  id: number;
  name: string;
  summary: string;
  image: string;
}

interface episodeInterface {
  id: number;
  name: string;
  season: string;
  number: string;
}

async function getShowsByTerm(term: string): Promise<showInterface[]> {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(`${BASE_URL}/search/shows?q=${term}`);
  const shows: showFromAPI[] = res.data;
  console.log(res.data);

  return shows.map((s: showFromAPI) => ({
    id: s.show.id,
    name: s.show.name,
    summary: s.show.summary,
    image: s.show.image?.original || "https://tinyurl.com/tv-missing",
  }));
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows: showInterface[]): void {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt='image of ${show.name}'
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay(): Promise<void> {
  const term = $("#searchForm-term").val() as string;
  const shows: showInterface[] = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id: number): Promise<episodeInterface[]> {
  const resp = await axios.get(`${BASE_URL}/shows/${id}/episodes`);
  const episodes = resp.data;
}

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
