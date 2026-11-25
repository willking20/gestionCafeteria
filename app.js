'use strict';
// Datos ficticios para el prototipo; se pueden sustituir por una API.
const products = [
 {name:'Cappuccino clásico',category:'Cafés calientes',price:24,art:'cappuccino',desc:'Espresso intenso, leche vaporizada y una delicada capa de espuma.'},
 {name:'Latte de vainilla',category:'Cafés calientes',price:28,art:'latte',desc:'Café espresso con leche cremosa y un toque aromático de vainilla.'},
 {name:'Espresso doble',category:'Cafés calientes',price:18,art:'espresso',desc:'Dos cargas de espresso para disfrutar un sabor concentrado.'},
 {name:'Cold brew',category:'Bebidas frías',price:30,art:'cold',desc:'Café de extracción en frío, refrescante y de sabor suave.'},
 {name:'Frappé de moka',category:'Bebidas frías',price:35,art:'frappe',desc:'Café, chocolate y hielo batidos con una textura cremosa.'},
 {name:'Limonada artesanal',category:'Bebidas frías',price:20,art:'lemon',desc:'Limón fresco, hielo y un toque de hierbabuena.'},
 {name:'Croissant de mantequilla',category:'Repostería',price:18,art:'croissant',desc:'Hojaldre dorado y crujiente, perfecto para acompañar tu café.'},
 {name:'Pastel de chocolate',category:'Repostería',price:32,art:'cake',desc:'Una porción de pastel de chocolate con cobertura cremosa.'},
 {name:'Cheesecake de frutos rojos',category:'Repostería',price:34,art:'cheesecake',desc:'Tarta de queso sobre base de galleta y salsa de frutos rojos.'},
 {name:'Sándwich de pollo',category:'Alimentos',price:42,art:'sandwich',desc:'Pan artesanal, pollo, vegetales frescos y aderezo de la casa.'},
 {name:'Tostadas de aguacate',category:'Alimentos',price:38,art:'toast',desc:'Pan tostado con aguacate, tomate y un toque de limón.'},
 {name:'Desayuno Encanto',category:'Alimentos',price:48,art:'breakfast',desc:'Huevos al gusto, pan artesanal, fruta y acompañamientos.'}
];
const money = n => 'Q' + Number(n).toLocaleString('es-GT',{minimumFractionDigits:2,maximumFractionDigits:2});
const $ = id => document.getElementById(id);
function makeCard(p){const el=document.createElement('article');el.className='product';el.innerHTML=`<div class="product-art"><img src="assets/${p.art}.svg" alt="Ilustración de ${p.name}" loading="lazy"><span class="product-cat">${p.category}</span></div><div class="product-body"><h3>${p.name}</h3><p>${p.desc}</p><span class="product-price">${money(p.price)}</span></div>`;return el;}
$('featured').replaceChildren(...[products[0],products[6],products[7]].map(makeCard));
let category='Todos';const categories=['Todos',...new Set(products.map(p=>p.category))];
for(const name of categories){const b=document.createElement('button');b.type='button';b.className='filter';b.textContent=name;b.setAttribute('aria-pressed',String(name===category));b.addEventListener('click',()=>{category=name;renderMenu();});$('categories').append(b);}
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function renderMenu(){const term=normalize($('search').value.trim());const selected=products.filter(p=>(category==='Todos'||p.category===category)&&normalize(p.name+' '+p.desc).includes(term));$('menu-grid').replaceChildren(...selected.map(makeCard));$('category-title').textContent=category==='Todos'?'Todos los productos':category;$('product-count').textContent=`${selected.length} producto${selected.length===1?'':'s'}`;$('empty-menu').hidden=selected.length!==0;for(const b of $('categories').children)b.setAttribute('aria-pressed',String(b.textContent===category));}
$('search').addEventListener('input',renderMenu);renderMenu();
const nav=$('nav'),toggle=document.querySelector('.mobile-toggle');
function closeNav(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir navegación');}
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar navegación':'Abrir navegación');});
const views=['inicio','menu','eventos'];
function navigate(){const route=location.hash.slice(1);if(route==='main')return;const active=views.includes(route)?route:'inicio';for(const view of document.querySelectorAll('[data-view]'))view.hidden=view.dataset.view!==active;for(const a of document.querySelectorAll('[data-nav]')){if(a.dataset.nav===active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');}document.title=({inicio:'Inicio',menu:'Menú',eventos:'Cotización de eventos'}[active])+' | Café Encanto';closeNav();window.scrollTo(0,0);}
window.addEventListener('hashchange',navigate);navigate();
// Parámetros comerciales de ejemplo. No representa tarifas ni disponibilidad reales.
const BASE_SPACE=300, EXTRA_HOUR=100, INCLUDED_HOURS=2;
const form=$('quote-form');const date=$('event-date');function localDate(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}date.min=localDate();
function getQuote(){const guests=Math.min(40,Math.max(0,Number($('guests').value)||0));const hours=Number($('hours').value);const unit=Number($('package').value);const space=BASE_SPACE+Math.max(0,hours-INCLUDED_HOURS)*EXTRA_HOUR;const extras=[...form.querySelectorAll('[name=extra]:checked')];const extra=extras.reduce((sum,e)=>sum+Number(e.value),0);return {guests,hours,space,food:guests*unit,extra,extras,total:space+guests*unit+extra};}
function updateQuote(){const q=getQuote();$('space-cost').textContent=money(q.space);$('food-label').textContent=`Alimentación (${q.guests} personas)`;$('food-cost').textContent=money(q.food);$('extra-cost').textContent=money(q.extra);$('total-cost').textContent=money(q.total);$('quote-result').hidden=true;$('print-quote').hidden=true;}
form.addEventListener('input',updateQuote);form.addEventListener('change',updateQuote);updateQuote();
form.addEventListener('submit',e=>{e.preventDefault();date.min=localDate();if(!form.reportValidity())return;const q=getQuote();const f=new FormData(form);const dateText=String(f.get('fecha')).split('-').reverse().join('/');const result=$('quote-result');result.textContent=`COTIZACIÓN PRELIMINAR · DEMOSTRACIÓN\nSolicitante: ${f.get('nombre')}\nEvento: ${f.get('tipo')}\nFecha: ${dateText} · ${f.get('hora')}\nInvitados: ${q.guests} · Duración: ${q.hours} horas\nPaquete: ${$('package').selectedOptions[0].textContent}\nExtras: ${q.extras.map(e=>e.dataset.label).join(', ')||'Ninguno'}\nTotal estimado: ${money(q.total)}\nSolicitud no enviada. Fecha no reservada.`;result.hidden=false;$('print-quote').hidden=false;if(window.innerWidth<680)result.scrollIntoView({behavior:'smooth',block:'center'});});
$('print-quote').addEventListener('click',()=>window.print());
