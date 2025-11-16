document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('scheduleContainer');
  const searchInput = document.getElementById('searchInput');
  let talks = [];

  fetch('talks.json')
    .then(response => response.json())
    .then(data => {
      talks = data;
      renderSchedule(talks);
    });

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTalks = talks.filter(talk => 
      talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
    );
    renderSchedule(filteredTalks);
  });

  function renderSchedule(talksToRender) {
    scheduleContainer.innerHTML = '';
    let currentTime = new Date();
    currentTime.setHours(10, 0, 0, 0);

    talksToRender.forEach((talk, index) => {
      if (index === 3) {
        const lunchBreak = document.createElement('div');
        lunchBreak.className = 'schedule-item';
        const lunchTime = new Date(currentTime.getTime());
        lunchBreak.innerHTML = `
          <div class="time">${formatTime(lunchTime)} - ${formatTime(new Date(lunchTime.getTime() + 60 * 60 * 1000))}</div>
          <h2>Lunch Break</h2>
        `;
        scheduleContainer.appendChild(lunchBreak);
        currentTime.setMinutes(currentTime.getMinutes() + 60);
      }

      const talkElement = document.createElement('div');
      talkElement.className = 'schedule-item';

      const startTime = new Date(currentTime.getTime());
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      talkElement.innerHTML = `
        <div class="time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
        <h2>${talk.title}</h2>
        <p><strong>Speakers:</strong> ${talk.speakers.join(', ')}</p>
        <p class="category"><strong>Category:</strong> ${talk.category.join(', ')}</p>
        <p>${talk.description}</p>
      `;

      scheduleContainer.appendChild(talkElement);

      currentTime.setMinutes(currentTime.getMinutes() + 70); // 60 min talk + 10 min break
    });
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
});
