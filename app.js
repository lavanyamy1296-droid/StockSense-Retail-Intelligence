const seed = [
 {name:"Wireless Earbuds",category:"Electronics",sold:248,price:1499,stock:18,icon:"🎧"},
 {name:"Cotton T-Shirt",category:"Apparel",sold:192,price:599,stock:74,icon:"👕"},
 {name:"Steel Water Bottle",category:"Lifestyle",sold:165,price:449,stock:12,icon:"🧴"},
 {name:"Running Shoes",category:"Footwear",sold:143,price:2299,stock:9,icon:"👟"},
 {name:"Desk Lamp",category:"Home",sold:118,price:899,stock:41,icon:"💡"},
 {name:"Backpack",category:"Accessories",sold:106,price:1299,stock:6,icon:"🎒"},
 {name:"Bluetooth Speaker",category:"Electronics",sold:94,price:1899,stock:28,icon:"🔊"},
 {name:"Ceramic Mug",category:"Home",sold:87,price:299,stock:3,icon:"☕"},
 {name:"Yoga Mat",category:"Fitness",sold:73,price:799,stock:35,icon:"🧘"},
 {name:"Notebook Set",category:"Stationery",sold:62,price:249,stock:2,icon:"📓"}
];
let products = seed.map(x=>({...x}));
const fmt = n => "₹"+Math.round(n).toLocaleString("en-IN");
const status = p => p.stock<=5?"Critical":p.stock<=15?"Low stock":"Healthy";
function render(){
 const revenue=products.reduce((s,p)=>s+p.sold*p.price,0), units=products.reduce((s,p)=>s+p.sold,0);
 const healthy=products.filter(p=>status(p)==="Healthy").length, low=products.filter(p=>status(p)==="Low stock").length, critical=products.length-healthy-low, alerts=low+critical;
 document.getElementById("revenue").textContent=fmt(revenue);document.getElementById("units").textContent=units.toLocaleString("en-IN");document.getElementById("active").textContent=products.length;document.getElementById("alerts").textContent=alerts;
 document.getElementById("healthy-pct").textContent=products.length?Math.round(healthy/products.length*100)+"%":"0%";
 document.getElementById("healthy-count").textContent=healthy;document.getElementById("low-count").textContent=low;document.getElementById("critical-count").textContent=critical;
 const a=products.length?healthy/products.length*100:0,b=products.length?low/products.length*100:0;
 document.getElementById("donut").style.background=`conic-gradient(#18a77b 0 ${a}%,#f1bd54 ${a}% ${a+b}%,#e76c73 ${a+b}% 100%)`;
 const top=[...products].sort((x,y)=>y.sold*y.price-x.sold*x.price).slice(0,5);
 document.getElementById("top-products").innerHTML=top.map(p=>`<tr><td><div class="product-cell"><span class="product-icon">${p.icon||"📦"}</span>${esc(p.name)}</div></td><td>${p.sold}</td><td><b>${fmt(p.sold*p.price)}</b></td></tr>`).join("");
 const needing=products.filter(p=>status(p)!=="Healthy").sort((x,y)=>x.stock-y.stock).slice(0,4);
 document.getElementById("alerts-list").innerHTML=needing.length?needing.map(p=>`<div class="alert-item"><span class="alert-symbol">!</span><div><b>${esc(p.name)}</b><small>${p.stock} units left · ${status(p)}</small></div></div>`).join(""):`<p class="muted">All products have healthy stock.</p>`;
 document.getElementById("alert-count").textContent=alerts+" alerts";
 document.getElementById("all-products").innerHTML=products.map(p=>`<tr><td><div class="product-cell"><span class="product-icon">${p.icon||"📦"}</span>${esc(p.name)}</div></td><td>${esc(p.category)}</td><td>${p.sold}</td><td>${fmt(p.sold*p.price)}</td><td>${p.stock}</td><td><span class="badge ${status(p)==="Healthy"?"healthy":status(p)==="Low stock"?"low":"critical"}">${status(p)}</span></td></tr>`).join("");
 document.getElementById("chart-total").textContent=fmt(revenue)+" total";
 renderForecast();drawChart();
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderForecast(){
 const total=products.reduce((s,p)=>s+p.sold,0),daily=total/30;
 document.getElementById("forecast-cards").innerHTML=`<article class="forecast-card"><small>PROJECTED 7-DAY UNITS</small><strong>${Math.round(daily*7).toLocaleString("en-IN")}</strong><p>Based on recent average sales</p></article><article class="forecast-card"><small>PRODUCTS TO RESTOCK</small><strong>${products.filter(p=>Math.max(0,Math.ceil(p.sold/30*7*1.2)-p.stock)>0).length}</strong><p>Including 20% safety buffer</p></article><article class="forecast-card"><small>AVERAGE DAILY UNITS</small><strong>${daily.toFixed(1)}</strong><p>Units sold per day (30-day basis)</p></article>`;
 document.getElementById("restock-table").innerHTML=products.map(p=>{let avg=p.sold/30,demand=Math.ceil(avg*7),qty=Math.max(0,Math.ceil(demand*1.2)-p.stock);return `<tr><td>${esc(p.name)}</td><td>${avg.toFixed(1)}</td><td>${demand}</td><td>${p.stock}</td><td><b style="color:${qty?"#6658e8":"#159b72"}">${qty?qty+" units":"No restock"}</b></td></tr>`}).join("");
}
function drawChart(){
 const c=document.getElementById("sales-chart"),r=c.getBoundingClientRect(),dpr=window.devicePixelRatio||1;c.width=r.width*dpr;c.height=r.height*dpr;const x=c.getContext("2d");x.scale(dpr,dpr);
 const w=r.width,h=r.height,pad={l:38,r:12,t:12,b:24};const vals=[.54,.68,.59,.82,.72,.91,1].map(v=>v*products.reduce((s,p)=>s+p.sold*p.price,0)/7);const max=Math.max(...vals)*1.15;
 x.font="10px DM Sans";x.fillStyle="#a0a8b7";x.strokeStyle="#edf0f5";x.lineWidth=1;
 for(let i=0;i<4;i++){let y=pad.t+(h-pad.t-pad.b)*i/3;x.beginPath();x.moveTo(pad.l,y);x.lineTo(w-pad.r,y);x.stroke();x.fillText(fmt(max*(1-i/3)).replace("₹","₹"),2,y+3)}
 const pts=vals.map((v,i)=>({x:pad.l+(w-pad.l-pad.r)*i/6,y:pad.t+(h-pad.t-pad.b)*(1-v/max)}));
 const grad=x.createLinearGradient(0,pad.t,0,h-pad.b);grad.addColorStop(0,"rgba(102,88,232,.22)");grad.addColorStop(1,"rgba(102,88,232,0)");
 x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y));x.lineTo(pts[6].x,h-pad.b);x.lineTo(pts[0].x,h-pad.b);x.closePath();x.fillStyle=grad;x.fill();
 x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y));x.strokeStyle="#6658e8";x.lineWidth=2.5;x.stroke();
 const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];pts.forEach((p,i)=>{x.beginPath();x.arc(p.x,p.y,3.5,0,Math.PI*2);x.fillStyle="#6658e8";x.fill();x.fillStyle="#929bad";x.font="10px DM Sans";x.textAlign="center";x.fillText(days[i],p.x,h-5)});
}
document.querySelectorAll(".nav").forEach(btn=>btn.addEventListener("click",()=>showView(btn.dataset.view)));
document.querySelectorAll("[data-go]").forEach(btn=>btn.addEventListener("click",()=>showView(btn.dataset.go)));
function showView(v){["overview","products","forecast"].forEach(k=>document.getElementById(k+"-view").classList.toggle("hidden",k!==v));document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.view===v));document.getElementById("page-title").textContent=({overview:"Overview",products:"Product insights",forecast:"Demand forecast"})[v];if(v==="overview")setTimeout(drawChart,20);}
document.getElementById("reset").addEventListener("click",()=>{products=seed.map(x=>({...x}));document.getElementById("data-note").textContent="Showing built-in sample dataset · Import a CSV to analyse your own store data.";render();});
document.getElementById("product-search").addEventListener("input",e=>{const q=e.target.value.toLowerCase();document.querySelectorAll("#all-products tr").forEach(row=>row.style.display=row.textContent.toLowerCase().includes(q)?"":"none");});
document.getElementById("csv-file").addEventListener("change",async e=>{
 const file=e.target.files[0];if(!file)return;try{const text=await file.text(),rows=parseCSV(text);if(rows.length<2)throw Error("CSV needs a header row and at least one data row.");
 const headers=rows[0].map(s=>s.trim().toLowerCase());const find=(names)=>headers.findIndex(h=>names.includes(h));
 const ni=find(["product","product_name","name"]),ci=find(["category"]),si=find(["units_sold","sold","quantity","units"]),pi=find(["price","unit_price"]),sti=find(["stock","stock_left","inventory"]);
 if([ni,si,pi,sti].some(i=>i<0))throw Error("Required columns: product, units_sold, price, stock. category is optional.");
 const imported=rows.slice(1).filter(r=>r.length>1).map(r=>({name:r[ni],category:ci>=0?r[ci]:"Other",sold:Number(r[si]),price:Number(r[pi]),stock:Number(r[sti]),icon:"📦"}));
 if(imported.some(p=>!p.name||![p.sold,p.price,p.stock].every(Number.isFinite)||p.sold<0||p.price<0||p.stock<0))throw Error("Check that product names and numeric values are valid.");
 products=imported;document.getElementById("data-note").textContent=`Analysing ${file.name} · ${products.length} products imported from your CSV.`;render();showView("overview");
 }catch(err){alert("Could not import CSV: "+err.message);}e.target.value="";
});
function parseCSV(t){const rows=[];let row=[],cell="",q=false;for(let i=0;i<t.length;i++){let c=t[i];if(c==='"'&&q&&t[i+1]==='"'){cell+='"';i++;}else if(c==='"')q=!q;else if(c===','&&!q){row.push(cell);cell="";}else if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&t[i+1]==='\n')i++;row.push(cell);if(row.some(v=>v.trim()))rows.push(row);row=[];cell="";}else cell+=c;}row.push(cell);if(row.some(v=>v.trim()))rows.push(row);return rows;}
window.addEventListener("resize",()=>{if(!document.getElementById("overview-view").classList.contains("hidden"))drawChart();});
render();
