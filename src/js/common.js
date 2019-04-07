window.onload = function () {

  const rootEl = document.querySelector('.wrapper');
  const prvEl = document.querySelector('#previous');
  const nxtEl = document.querySelector('#next');
  const currPageEl = document.querySelector('#currentPage');
  let page = +sessionStorage.getItem('page') || 1;

  initCurrentPage();

  prvEl.addEventListener('click', (e) => {
    e.preventDefault();
    if (page <= 2) {prvEl.classList.add('disabled');} 
    
    if (page > 1) {
      page--;
      sessionStorage.setItem('page', page);
      rootEl.innerHTML = '';
      initCurrentPage();
    }
  });

  nxtEl.addEventListener('click', (e) => {
    e.preventDefault();
    if(page == 1) {
      prvEl.classList.remove('disabled');
    }
    page++;
    sessionStorage.setItem('page', page);
    rootEl.innerHTML = '';
    initCurrentPage();
  });

  function initCurrentPage() {
    let plyaersData = JSON.parse(sessionStorage.getItem(page));
    if (page == 1)
      prvEl.classList.add('disabled');

    currPageEl.innerText = page;
    
      if (plyaersData) {
      plyaersData.forEach(player => {
        const card = createCard(player);
        rootEl.appendChild(card);
      })
    } else {
      getPlayersData(page).then(data => {
        plyaersData = data;
        sessionStorage.setItem(page, JSON.stringify(data));
        plyaersData.forEach(player => {
          const card = createCard(player);
          rootEl.appendChild(card);
        })
      });
    }
  }
}


function createCard(player) {
  const card = document.createElement('div');
  card.innerHTML = `
    <div class="card">
      <div class="card-header">
        ${player.name}
      </div>
      <div class="card-body">
        <table class="table table-hover table-sm">
          <tbody>
            <tr>
              <td>height:</td>
              <td>${player.height} cm</td>
            </tr>
            <tr>
              <td>weight:</td>
              <td>${player.weight} kg</td>
            </tr>
            <tr>
              <td>team:</td>
              <td>${player.team}</td>
            </tr>
            <tr>
              <td>city:</td>
              <td>${player.city}</td>
            </tr>
            <tr>
              <td>position:</td>
              <td>${player.position}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>`;

  return card;
}

function getPlayersData(page) {
  const url = `https://www.balldontlie.io/api/v1/players?per_page=24&page=${page}`;
  const promise = new Promise((resolve) => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const playerData = data.data.map(item => {          
          return {
            name: item.first_name + ' ' + item.last_name,
            height: Math.round(item.height_feet * 30.48 + item.height_inches * 2.54) || 'n/a',
            position: item.position,
            city: item.team.city,
            team: item.team.name,
            weight: Math.round(item.weight_pounds * 0.453) || 'n/a'
          }   
        });

        resolve(playerData);
      });
  });
  return promise;
}

