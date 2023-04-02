document.getElementById('form-container').style.display = 'none';

async function updateCssFromLatestJson() {
  try {
    const response = await fetch('content.json');
    const data = await response.json();

    const maxId = Math.max(...data.versions.map(version => version.id));
    const latestVersion = data.versions.find(version => version.id === maxId);

    document.documentElement.style.setProperty('--primary-color', latestVersion.color);
  } catch (error) {
    console.error('Error updating CSS from latest JSON:', error);
  }
}

updateCssFromLatestJson();

// counts items in json

let numItems = 0;

const fetchJSON = async () => {
  const response = await fetch('content.json');
  const data = await response.json();
  numItems = data.versions.length;
  console.log(numItems);
  return data;
};

fetchJSON();

// version selector

async function loadContent() {
  try {
    const response = await fetch('content.json');
    const data = await response.json();

    const select = document.getElementById('version-selector');
    const leftArrow = document.getElementById('right-arrow');
    const rightArrow = document.getElementById('left-arrow');

    let maxId = -1;
    let selectedIndex = 0;

    data.versions.forEach((version, index) => {
      if (version.id > maxId) {
        maxId = version.id;
        selectedIndex = index;
      }
      const option = document.createElement('option');
      option.value = index;
      option.textContent = version.name;
      select.appendChild(option);
    });

    select.selectedIndex = selectedIndex;
    displayContent(data.versions[selectedIndex].html);

    select.addEventListener('change', () => {
      const selectedVersion = data.versions[select.selectedIndex];
      displayContent(selectedVersion.html);
      updateColor(selectedVersion.color);
      checkArrows(select.selectedIndex, data.versions.length, leftArrow, rightArrow);
    });

    leftArrow.addEventListener('click', () => {
    if (select.selectedIndex > 0) {
      select.selectedIndex--;
      const selectedVersion = data.versions[select.selectedIndex];
      displayContent(selectedVersion.html);
      updateColor(selectedVersion.color);
      checkArrows(select.selectedIndex, data.versions.length, leftArrow, rightArrow);
    }
  });

  rightArrow.addEventListener('click', () => {
    if (select.selectedIndex < data.versions.length - 1) {
      select.selectedIndex++;
      const selectedVersion = data.versions[select.selectedIndex];
      displayContent(selectedVersion.html);
      updateColor(selectedVersion.color);
      checkArrows(select.selectedIndex, data.versions.length, leftArrow, rightArrow);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      if (select.selectedIndex > 0) {
        select.selectedIndex--;
        const selectedVersion = data.versions[select.selectedIndex];
        displayContent(selectedVersion.html);
        updateColor(selectedVersion.color);
        checkArrows(select.selectedIndex, data.versions.length, leftArrow, rightArrow);
      }
    } else if (event.key === 'ArrowLeft') {
      if (select.selectedIndex < data.versions.length - 1) {
        select.selectedIndex++;
        const selectedVersion = data.versions[select.selectedIndex];
        displayContent(selectedVersion.html);
        updateColor(selectedVersion.color);
        checkArrows(select.selectedIndex, data.versions.length, leftArrow, rightArrow);
      }
    }
  });


    checkArrows(selectedIndex, data.versions.length, leftArrow, rightArrow);

  } catch (error) {
    console.error('Error loading content:', error);
  }
}

function checkArrows(selectedIndex, numItems, leftArrow, rightArrow) {
  if (selectedIndex === 0) {
    leftArrow.style.visibility = 'hidden';
  } else {
    leftArrow.style.visibility = 'visible';
  }

  if (selectedIndex === numItems - 1) {
    rightArrow.style.visibility = 'hidden';
  } else {
    rightArrow.style.visibility = 'visible';
  }
}


function displayContent(html) {
  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = html;
}

function updateColor(color) {
  document.documentElement.style.setProperty('--primary-color', color);
}

async function generateJSON() {
  const name = document.getElementById('name').value;
  const color = document.getElementById('color').value;
  const watching = document.getElementById('watching').value;
  const watchingurl = document.getElementById('watching-url').value;
  const listening = document.getElementById('listening').value;
  const listeningurl = document.getElementById('listening-url').value;
  const reading = document.getElementById('reading').value;
  const readingurl = document.getElementById('reading-url').value;
  const eating = document.getElementById('eating').value;
  const eatingurl = document.getElementById('eating-url').value;
  const bestMeal = document.getElementById('best-meal').value;
  const bestMealurl = document.getElementById('best-meal-url').value;

  const response = await fetch('content.json');
  const data = await response.json();

  // json export

  const jsonEntry = {
      id: numItems + 1,
      name,
      color,
      html: `<p class='p1'>hi, its me, reese oxner</p><p class='p1'><strong>here's what i'm up to</p></strong><p class='p1'>what i'm watching <strong><a href='${watchingurl}' target='_blank' style='text-decoration: none;'>→</a> ${watching}</strong></p><p class='p1'>what i'm listening to <strong><a href='${listeningurl}'>→</a>${listening}</strong></p><p class='p1'>what i'm reading <strong><a href='${readingurl}’' target='_blank' style='text-decoration: none;'>→</a> ${reading}'</strong></p><p class='p1'>what i'm eating <strong><a href='${eatingurl}' target='_blank' style='text-decoration: none;'>→</a> ${eating}</strong></p><p class='p1'>the best meal i've had recently <strong><a href='${bestMealurl}' target='_blank' style='text-decoration: none;'>→</a> ${bestMeal}</strong></p>`
  };

  return jsonEntry;
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    const formContainer = document.getElementById('form-container');
    if (formContainer.style.display === 'none') {
      formContainer.style.display = 'flex';
    } else {
      formContainer.style.display = 'none';
    }
  }
});

function formatDate(date) {
  const monthNames = [
    'jan', 'feb', 'mar', 'april', 'may', 'june',
    'july', 'aug', 'sept', 'oct', 'nov', 'dec'
  ];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

document.getElementById('name').value = formatDate(new Date());

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

document.getElementById('json-entry-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const output = await generateJSON();
  document.getElementById('json-output').textContent = JSON.stringify(output, null, 2);
});

document.getElementById('copy-json').addEventListener('click', async function () {
  const output = await generateJSON();
  copyToClipboard(JSON.stringify(output, null, 2));
});

loadContent();
