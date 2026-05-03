const fs = require('fs');
const d = JSON.parse(fs.readFileSync('D:/organizar recursos/organizado/inventario_maestro.json', 'utf8'));
const ids = d.map(r => r.id);
const seen = {};
const dupes = [];
ids.forEach(id => {
  seen[id] = (seen[id] || 0) + 1;
});
Object.entries(seen).forEach(([id, count]) => {
  if (count > 1) dupes.push({ id, count });
});
console.log(`Total items en JSON: ${d.length}`);
console.log(`IDs unicos: ${Object.keys(seen).length}`);
console.log(`IDs duplicados: ${dupes.length}\n`);
dupes.forEach(({ id, count }) => {
  console.log(`${id} (x${count}):`);
  d.filter(r => r.id === id).forEach(r => console.log(`  - ${r.nombre_ui}`));
});
