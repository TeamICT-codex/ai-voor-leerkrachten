// Het paspoort toont de stempels die de klas op dit toestel verdiende. Op
// papier vult elk kind zijn naam in. Gedeeld door alle graden.
export function vulPaspoort(stations, sleutel) {
  let stempels = new Set();
  try { stempels = new Set(JSON.parse(localStorage.getItem(sleutel) || '[]')); } catch { /* geen opslag: een leeg paspoort */ }
  const lijst = document.querySelector('.ll-paspoort-lijst');
  for (const s of stations) {
    const rij = document.createElement('div');
    rij.className = 'll-paspoort-rij';
    rij.innerHTML = '<span class="ll-cirkel"></span><div><h2></h2><p></p></div>';
    const cirkel = rij.querySelector('.ll-cirkel');
    cirkel.textContent = stempels.has(s.id) ? '✓' : s.nummer;
    cirkel.classList.toggle('gestempeld', stempels.has(s.id));
    rij.querySelector('h2').textContent = `${s.nummer} · ${s.naam}`;
    rij.querySelector('p').textContent = s.onthoud;
    lijst.append(rij);
  }
  document.querySelector('.ll-druk').addEventListener('click', () => print());
}
