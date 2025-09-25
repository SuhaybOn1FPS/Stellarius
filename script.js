document.addEventListener("DOMContentLoaded", () => {

  // Smooth scrolling
  document.querySelectorAll('header nav a').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Last.fm Now Playing
  const apiKey = "09f6d36674db4c07e36a1fa2c44a38f0";
  const username = "suhaybon1fps";

  async function loadNowPlaying() {
    const container = document.getElementById("lastfm-nowplaying");
    if (!container) return;

    container.innerHTML = `<p>Loading your recent track...</p>`;

    try {
      const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`
      );
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);

      const data = await response.json();
      const track = data.recenttracks.track?.[0];

      if (!track) {
        container.innerHTML = `<p>No recent track found.</p>`;
        return;
      }

      const albumArt = track.image?.[2]?.['#text'] || 'Images/placeholder.png';

      container.innerHTML = `
        <div class="now-playing">
          <img src="${albumArt}" alt="Album Art">
          <h3>${track.name}</h3>
          <p>by ${track.artist['#text']}</p>
        </div>
      `;
    } catch (err) {
      console.error("Error fetching Last.fm data:", err);
      container.innerHTML = `<p style="color:red;">Failed to load data.</p>`;
    }
  }

  loadNowPlaying();
  setInterval(loadNowPlaying, 30000);

  // Smooth Age Counter
  const ageElement = document.getElementById("age");
  if (ageElement) {
    const birthday = new Date("2011-06-17");
    const msInYear = 365.25 * 24 * 60 * 60 * 1000;
    let displayedAge = 0;

    function updateAgeSmooth() {
      const currentDate = new Date();
      const age = (currentDate - birthday) / msInYear;
      displayedAge += (age - displayedAge) * 0.1;
      ageElement.textContent = displayedAge.toFixed(10);
      requestAnimationFrame(updateAgeSmooth);
    }

    updateAgeSmooth();
  }

});
