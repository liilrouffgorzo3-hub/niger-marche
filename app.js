const demoListings = [
 {id:1,category:"Parcelles",offer:"Vente",title:"Parcelle de 400 m² clôturée",city:"Niamey",area:"Yantala",price:18000000,icon:"🌱",desc:"Parcelle accessible, proche des commodités. Vérifiez les documents fonciers avant toute transaction."},
 {id:2,category:"Maisons",offer:"Vente",title:"Villa familiale de 4 chambres",city:"Dosso",area:"Centre-ville",price:42000000,icon:"🏡",desc:"Villa spacieuse avec cour et accès facile. Exemple de fiche de démonstration."},
 {id:3,category:"Locations",offer:"Location",title:"Appartement 2 chambres",city:"Niamey",area:"Plateau",price:175000,period:"mois",icon:"🔑",desc:"Appartement lumineux. Loyer mensuel à confirmer auprès du propriétaire."},
 {id:4,category:"Hôtels",offer:"Hébergement",title:"Case de passage confortable",city:"Maradi",area:"Centre",price:15000,period:"nuit",icon:"🛎️",desc:"Hébergement de passage. Tarif indicatif par nuit, disponibilité à confirmer."},
 {id:5,category:"Voitures",offer:"Vente",title:"Toyota Corolla — bon état",city:"Niamey",area:"Koubia",price:6500000,icon:"🚘",desc:"Véhicule d'occasion. Contrôlez les papiers, le kilométrage et l'état mécanique avant achat."},
 {id:6,category:"Motos",offer:"Vente",title:"Moto TVS — très bon état",city:"Zinder",area:"Route de Tanout",price:450000,icon:"🏍️",desc:"Moto d'occasion. Inspection et essai recommandés avant paiement."},
 {id:7,category:"Maisons",offer:"Location",title:"Maison de 3 chambres à louer",city:"Tahoua",area:"Nouveau quartier",price:120000,period:"mois",icon:"🏠",desc:"Maison avec cour. Loyer mensuel indicatif."},
 {id:8,category:"Hôtels",offer:"Hébergement",title:"Hôtel — chambre climatisée",city:"Dosso",area:"Route nationale",price:22000,period:"nuit",icon:"🏨",desc:"Chambre climatisée. Disponibilité et services à confirmer."},
 {id:9,category:"Parcelles",offer:"Vente",title:"Terrain de 600 m²",city:"Maradi",area:"Zone résidentielle",price:12500000,icon:"🌿",desc:"Exemple d'annonce de terrain. Vérifiez le titre foncier et les limites avec les autorités compétentes."}
];
const OFFICIAL_WHATSAPP = "22791634827";
let listings = [...demoListings, ...JSON.parse(localStorage.getItem("nm_listings") || "[]")];
let activeCat = "Tous";
const $ = id => document.getElementById(id);
const fmt = n => Number(n).toLocaleString("fr-FR") + " FCFA";
function render(){
 const q=$("keyword").value.toLowerCase().trim(), region=$("region").value, type=$("type").value, sort=$("sort").value;
 let data=listings.filter(x=>(activeCat==="Tous" || x.category===activeCat) && (!region||x.city===region) && (!type||x.offer===type) && (!q||`${x.title} ${x.city} ${x.area} ${x.category}`.toLowerCase().includes(q)));
 if(sort==="low")data.sort((a,b)=>a.price-b.price); if(sort==="high")data.sort((a,b)=>b.price-a.price);
 $("resultCount").textContent=`${data.length} annonce${data.length>1?"s":""}`;
 $("empty").classList.toggle("hidden",data.length>0);
 $("listingGrid").innerHTML=data.map(x=>`<article class="listing-card"><div class="card-photo">${x.photo?`<img src="${escapeAttr(x.photo)}" alt="">`:`<span class="photo-placeholder">${x.icon||"📍"}</span>`}<span class="tag">${x.offer}</span></div><div class="card-body"><h3 class="card-title">${escapeHtml(x.title)}</h3><div class="card-location">⌖ ${escapeHtml(x.area||"")} · ${escapeHtml(x.city)} · ${escapeHtml(x.category)}</div><div class="card-bottom"><div class="price">${fmt(x.price)}${x.period?`<small> / ${x.period}</small>`:""}</div><button class="details-btn" data-id="${x.id}">Voir détails →</button></div></div></article>`).join("");
 document.querySelectorAll(".details-btn").forEach(b=>b.addEventListener("click",()=>showDetails(Number(b.dataset.id))));
}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function escapeAttr(s=""){return escapeHtml(s);}
function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),3200);}
function showDetails(id){
 const x=listings.find(a=>a.id===id); if(!x)return;
 const phone=(x.phone||OFFICIAL_WHATSAPP);
 const message=`Bonjour, je suis intéressé(e) par votre annonce : ${x.title} (${x.city}). Est-elle toujours disponible ?`;
 const wa=phone?`https://wa.me/${phone.replace(/\D/g,"")}?text=${encodeURIComponent(message)}`:`https://wa.me/?text=${encodeURIComponent(message)}`;
 alert(`${x.title}\n${x.city}${x.area?", "+x.area:""}\n${fmt(x.price)}${x.period?" / "+x.period:""}\n\n${x.desc||"Contactez l'annonceur pour plus d'informations."}\n\nDémonstration : vérifiez les informations et les documents avant tout paiement.`);
 if(confirm("Ouvrir WhatsApp pour contacter l'annonceur ?")) window.open(wa,"_blank");
}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));b.classList.add("active");activeCat=b.dataset.cat;render();}));
["keyword","region","type","sort"].forEach(id=>$(id).addEventListener(id==="keyword"?"input":"change",render));
$("reset").addEventListener("click",()=>{$("keyword").value="";$("region").value="";$("type").value="";$("sort").value="recent";activeCat="Tous";document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.cat==="Tous"));render();});
$("listingForm").addEventListener("submit",e=>{
 e.preventDefault();const f=new FormData(e.target),x=Object.fromEntries(f.entries());
 x.id=Date.now();x.price=Number(x.price);x.phone=(x.phone||"").replace(/[^0-9+]/g,"");x.icon=({Parcelles:"🌱",Maisons:"🏠",Locations:"🔑",Hôtels:"🛎️",Voitures:"🚘",Motos:"🏍️"})[x.category]||"📍";
 listings.push(x);const custom=listings.filter(a=>a.id>Date.now()-86400000);localStorage.setItem("nm_listings",JSON.stringify(custom));
 const message=`Bonjour, je souhaite publier cette annonce sur Niger Marché :\n${x.title}\nCatégorie : ${x.category}\nVille : ${x.city}\nPrix : ${fmt(x.price)}\nTéléphone : ${x.phone}\nDescription : ${x.description||"—"}`;
 render();e.target.reset();toast("Annonce ajoutée sur cet appareil. Préparez son partage.");
 if(confirm("Envoyer les informations de l'annonce par WhatsApp ?"))window.open(`https://wa.me/?text=${encodeURIComponent(message)}`,"_blank");
});
$("menuBtn").addEventListener("click",()=>$("nav").classList.toggle("open"));
render();

// Service worker : permet l'installation comme application web sur Android après hébergement HTTPS.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}

const transactionForm = document.getElementById("transactionForm");
if (transactionForm) transactionForm.addEventListener("submit", e => {
 e.preventDefault(); const f = new FormData(transactionForm);
 const kind=f.get("transactionType"), amount=Number(f.get("amount")||0); let rate=0, label="";
 if(kind==="Voiture"){rate=.01;label="1 %"} else if(kind==="Moto"){rate=.015;label="1,5 %"} else if(kind==="Parcelle"||kind==="Maison"){rate=.005;label="0,5 %"} else if(kind==="Hôtel"){rate=.075;label="7,5 % indicatif (plage 5–10 %)";}
 let estimate=kind==="Location"?"Frais proposés : 5 000 à 15 000 FCFA (à confirmer).":`Commission indicative (${label}) : ${Math.round(amount*rate).toLocaleString("fr-FR")} FCFA.`;
 const message=`Déclaration NIGER MARCHÉ\nType : ${kind}\nMontant : ${amount.toLocaleString("fr-FR")} FCFA\n${estimate}\nAnnonce : ${f.get("listingRef")}\nTéléphone : ${f.get("contact")}\nPrécisions : ${f.get("notes")||"—"}`;
 const result=document.getElementById("commissionResult");
 result.innerHTML=`<b>Estimation indicative</b><br>${escapeHtml(estimate)}<br><br>Aucun montant n'est prélevé automatiquement.`;
 result.classList.remove("hidden");
 if(confirm("Envoyer la déclaration à NIGER MARCHÉ par WhatsApp ?")) window.open("https://wa.me/22791634827?text="+encodeURIComponent(message),"_blank");
});
