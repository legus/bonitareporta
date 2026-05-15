
 // Reemplazar datos dummy por fetch cuando el API esté listo
// fetch('http://localhost:[puerto]/logica/controllers/IncidenciaController.php', {
//   method: 'POST',
//   body: JSON.stringify({ "operation": "SELECT", "table": "incidencias" })
// })
// .then(res => res.json())
// .then(res => { /* poblar K1, K2, K4, K5 con res.data */ });

// Datos dummy actuales---

  const K1=[
  {tipo:'Hueco',a:6,p:3},{tipo:'Luz dañada',a:4,p:2},{tipo:'Basura',a:3,p:3},{tipo:'Otro',a:2,p:1},
];
const K2=[
  {tipo:'Hueco',h:8.4,e:'c'},{tipo:'Luz dañada',h:6.1,e:'w'},{tipo:'Basura',h:4.2,e:'ok'},{tipo:'Otro',h:3.8,e:'ok'},
];
 
// Coordenadas reales de barrios de Bucaramanga
const K4=[
  {id:1, zona:'Norte',     barrio:'Cabecera del Llano', count:9,  lat:7.0980, lng:-73.1050},
  {id:2, zona:'Centro',    barrio:'Girardot',           count:7,  lat:7.1180, lng:-73.1220},
  {id:3, zona:'Sur',       barrio:'Sotomayor',          count:6,  lat:7.1280, lng:-73.1190},
  {id:4, zona:'Occidente', barrio:'Provenza',           count:5,  lat:7.1070, lng:-73.1320},
  {id:5, zona:'Norte',     barrio:'La Flora',           count:4,  lat:7.0890, lng:-73.1070},
  {id:6, zona:'Centro',    barrio:'La Aurora',          count:3,  lat:7.1150, lng:-73.1170},
  {id:7, zona:'Sur',       barrio:'El Poblado',         count:3,  lat:7.1320, lng:-73.1250},
  {id:8, zona:'Oriente',   barrio:'Diamante II',        count:2,  lat:7.1020, lng:-73.0890},
  {id:9, zona:'Occidente', barrio:'Colón',              count:2,  lat:7.1230, lng:-73.1380},
  {id:10,zona:'—',         barrio:'Sin ubicación',      count:2,  lat:7.1100, lng:-73.1130},
];
 
const K5=[
  {t:'Hueco',c:16},{t:'Basura',c:12},{t:'Luz dañada',c:9},{t:'Otro',c:5},
];
 
// KPI 1 — Barras activas por categoría
const mx1=Math.max(...K1.map(d=>d.a+d.p));
document.getElementById('bars-kpi1').innerHTML=K1.map(d=>{
  const pa=Math.round(d.a/mx1*100),pp=Math.round(d.p/mx1*100);
  return `<div style="margin-bottom:8px">
    <div style="font-size:.7rem;font-weight:500;margin-bottom:3px">${d.tipo}</div>
    <div class="bar-row" style="margin-bottom:2px"><div class="bt"><div class="bf a" style="width:${pa}%">${d.a}</div></div></div>
    <div class="bar-row" style="margin-bottom:0"><div class="bt"><div class="bf p" style="width:${pp}%">${d.p}</div></div></div>
  </div>`;
}).join('');
 
// KPI 2 — Tiempo promedio atención
const c2={ok:'#2ec9a0',w:'#f0a928',c:'#e05252'};
const b2={ok:'<span class="bk-ok">Dentro de meta</span>',w:'<span class="bk-w">Sobre meta</span>',c:'<span class="bk-c">Crítico</span>'};
document.getElementById('tc-kpi2').innerHTML=K2.map(d=>`
  <div class="tc">
    <div class="tc-tipo">${d.tipo}</div>
    <div class="tc-val" style="color:${c2[d.e]}">${d.h}h</div>
    ${b2[d.e]}
    <div class="tc-bar"><div class="tc-prog" style="width:${Math.min(d.h/10*100,100)}%;background:${c2[d.e]}"></div></div>
  </div>`).join('');
 
// KPI 3 — Tasa de resolución
new Chart(document.getElementById('donut3'),{type:'doughnut',data:{labels:['Resueltas','Pendientes'],datasets:[{data:[11,7],backgroundColor:['#2ec9a0','#252525'],borderColor:'#1a1a1a',borderWidth:3}]},options:{responsive:true,maintainAspectRatio:false,cutout:'74%',plugins:{legend:{display:false}}}});
new Chart(document.getElementById('line3'),{type:'line',data:{labels:['S-3','S-2','S-1','Hoy'],datasets:[{data:[45,58,52,61],borderColor:'#2ec9a0',backgroundColor:'rgba(46,201,160,.08)',borderWidth:2,fill:true,tension:0.4,pointBackgroundColor:'#2ec9a0',pointRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{color:'#252525'},ticks:{color:'#5a6270',font:{size:9}}},y:{grid:{color:'#252525'},ticks:{color:'#5a6270',font:{size:9},callback:v=>v+'%'},min:0,max:100}}}});
 
// KPI 5 — Tipo más frecuente
const tot5=K5.reduce((s,d)=>s+d.c,0);
let rp=K5.map(d=>Math.round(d.c/tot5*100));
rp[rp.indexOf(Math.max(...rp))]+=100-rp.reduce((s,v)=>s+v,0);
document.getElementById('tipos-kpi5').innerHTML=K5.map((d,i)=>`
  <div class="tipo-row">
    <div class="ti-info">
      <div class="ti-name">${d.t}${i===0?'<span class="mf-badge">mayor</span>':''}</div>
      <div class="ti-bar-row">
        <div class="ti-track"><div class="ti-fill" style="width:${rp[i]}%"></div></div>
        <div class="ti-pct">${rp[i]}%</div>
        <div class="ti-abs">${d.c} rep</div>
      </div>
    </div>
  </div>`).join('');
new Chart(document.getElementById('pie5'),{type:'doughnut',data:{labels:K5.map(d=>d.t),datasets:[{data:rp,backgroundColor:['#2ec9a0','rgba(46,201,160,.5)','rgba(46,201,160,.28)','#333'],borderColor:'#1a1a1a',borderWidth:3}]},options:{responsive:true,maintainAspectRatio:false,cutout:'58%',plugins:{legend:{display:false}}}});
 
// KPI 4 — Mapa de zonas
function incColor(count){
  const t=count/K4[0].count;
  if(t>=.85)return '#2ec9a0';
  if(t>=.60)return '#1d9e75';
  if(t>=.40)return '#0f6e56';
  if(t>=.20)return '#085041';
  return '#1a3a2e';
}
 
const lmap=L.map('leafmap',{zoomControl:true}).setView([7.110,-73.113],13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{attribution:'&copy; OSM &copy; CARTO',subdomains:'abcd',maxZoom:19}).addTo(lmap);
 
K4.forEach(d=>{
  const color=incColor(d.count);
  const r=9+Math.round((d.count/K4[0].count)*14);
  const m=L.circleMarker([d.lat,d.lng],{radius:r,fillColor:color,color:'#0f0f0f',weight:2,fillOpacity:.88}).addTo(lmap);
  m.bindTooltip(`<b style="font-family:'Syne',sans-serif">${d.barrio}</b><br><span style="color:#2ec9a0;font-weight:700">${d.count} incidencias</span>`,{direction:'top',offset:[0,-r]});
  m.on('click',()=>showDetail(d));
});
 
const rnkEl=document.getElementById('rnk-list');
K4.forEach((d,i)=>{
  const pct=Math.round(d.count/K4[0].count*100);
  const color=incColor(d.count);
  const div=document.createElement('div');
  div.className='rnk';div.id='ri'+d.id;
  div.innerHTML=`<div class="rn${i<3?' top':''}">${String(i+1).padStart(2,'0')}</div>
    <div class="rz"><div class="rz-name">${d.barrio}</div><div class="rz-sub">${d.zona}</div>
    <div class="rz-bar"><div class="rz-fill" style="width:${pct}%;background:${color}"></div></div></div>
    <div class="rc" style="color:${color}">${d.count}</div>`;
  div.addEventListener('click',()=>showDetail(d));
  rnkEl.appendChild(div);
});
 
function showDetail(d){
  document.querySelectorAll('.rnk').forEach(e=>e.classList.remove('active'));
  const el=document.getElementById('ri'+d.id);
  if(el)el.classList.add('active');
  document.getElementById('map-detail').innerHTML=`
    <div style="font-family:'Syne',sans-serif;font-size:.82rem;font-weight:800;color:#e8eaf0">${d.zona} · ${d.barrio}</div>
    <div style="font-family:'Syne',sans-serif;font-size:1.2rem;font-weight:800;color:#2ec9a0;line-height:1;margin-top:3px">${d.count}</div>
    <div style="font-size:.62rem;color:#5a6270">incidencias activas</div>`;
  lmap.setView([d.lat,d.lng],15,{animate:true});
}

setTimeout(()=>lmap.invalidateSize(),200);