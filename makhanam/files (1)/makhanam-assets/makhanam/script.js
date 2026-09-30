/* MAKHANAM – script.js
   Integrated grading system
   Required images:
   images/makhana-7.png
   images/makhana-6.png
   images/makhana-5.png
   images/makhana-4.png
   images/makhana-medium.png
   images/makhana-small.png
*/

const $ = id => document.getElementById(id);

const IMG = key => ({
  '7': 'images/makhana-7.png',
  '6': 'images/makhana-6.png',
  '5': 'images/makhana-5.png',
  '4': 'images/makhana-4.png',
  'medium': 'images/makhana-medium.png',
  'small': 'images/makhana-small.png'
}[key] || '');

const GRADES = [
  {
    key:'7', tag:'GRADE 7 SUTA (SUPER JUMBO)', badge:'7+ Suta (21mm+)',
    label:'Handpicked Super', size:'21mm+', mm:21, gold:0,
    name:'Handpicked Super Premium Foxnut', range:'Greater than 21 mm',
    count:'75 - 85 pieces', moisture:'< 7.5%', yield:'98% Fully Opened',
    density:'65 - 70 g/L', usage:'Top-tier export quality and specialty packaging.'
  },
  {
    key:'6', tag:'GRADE 6+ SUTA (JUMBO)', badge:'6+ Suta (19mm+)',
    label:'Jumbo Export', size:'19mm+', mm:19, gold:1,
    name:'6+ Suta Jumbo Foxnut', range:'19 – 26 mm',
    count:'95 - 105 pieces', moisture:'< 7.5%', yield:'97% Fully Opened',
    density:'68 - 73 g/L', usage:'High-end gourmet markets, luxury gifting, and international exports.'
  },
  {
    key:'5', tag:'GRADE 5 SUTA (ROYAL)', badge:'5+ Suta (16mm+)',
    label:'Premium Select', size:'16mm+', mm:16, gold:1,
    name:'5 Suta Royal Foxnut', range:'16 – 19 mm',
    count:'120 - 135 pieces', moisture:'< 8%', yield:'96% Fully Opened',
    density:'72 - 77 g/L', usage:'Premium retail packs, flavored makhana D2C brands, and snacking.'
  },
  {
    key:'4', tag:'GRADE 4 SUTA (CLASSIC)', badge:'4+ Suta (13mm+)',
    label:'Standard Commercial', size:'13mm+', mm:13, gold:0,
    name:'4 Suta Classic Foxnut', range:'13 – 15.8 mm',
    count:'160 - 180 pieces', moisture:'< 8%', yield:'95% Fully Opened',
    density:'76 - 82 g/L', usage:'Everyday roasting, snacking, and household cooking.'
  },
  {
    key:'medium', tag:'MEDIUM SUTA (PEARL)', badge:'Medium (10mm+)',
    label:'Medium Processing', size:'10mm+', mm:10, gold:0,
    name:'Medium Processing Foxnut', range:'10 – 12.7 mm',
    count:'220 - 250 pieces', moisture:'< 8.5%', yield:'93% Fully Opened',
    density:'80 - 87 g/L', usage:'Industrial processing, makhana flour, or sweets.'
  },
  {
    key:'small', tag:'SMALL INDUSTRIAL', badge:'Small (<10mm)',
    label:'Small Industrial', size:'<10mm', mm:8, gold:0,
    name:'Small Industrial Foxnut', range:'Below 10 mm',
    count:'300+ pieces', moisture:'< 9%', yield:'90% Fully Opened',
    density:'88 - 96 g/L', usage:'Makhana flour, powder, kheer and sweet-dish ingredients, and other further-processed products.'
  }
];

let current = 0;

function preloadGradeImages() {
  GRADES.forEach(g => {
    const src = IMG(g.key);
    if (src) {
      const image = new Image();
      image.src = src;
    }
  });
}

function renderGrid() {
  const grid = $('makhana-grid');
  if (!grid) return;

  grid.innerHTML = GRADES.map((g,i) => `
    <button type="button"
      class="grade-card ${g.gold ? 'gold' : ''} ${i === current ? 'active' : ''}"
      data-i="${i}" aria-pressed="${i === current}">
      <span class="grade-pill">${g.badge}</span>
      <span class="grade-img">
        <img src="${IMG(g.key)}"
             alt="${g.label} makhana, ${g.size}"
             loading="${i === 0 ? 'eager' : 'lazy'}"
             onerror="this.closest('.grade-img').classList.add('image-missing')">
      </span>
      <span class="grade-name">${g.label}</span>
      <span class="grade-size">${g.size}</span>
    </button>
  `).join('');

  grid.querySelectorAll('.grade-card').forEach(button => {
    button.addEventListener('click', () => selectGrade(Number(button.dataset.i)));
  });
}

function selectGrade(i) {
  if (!GRADES[i]) return;
  current = i;
  const g = GRADES[i];

  document.querySelectorAll('.grade-card').forEach((b,n) => {
    b.classList.toggle('active', n === i);
    b.setAttribute('aria-pressed', n === i);
  });

  if ($('detail-grade-tag')) $('detail-grade-tag').textContent = g.tag;
  if ($('detail-name')) $('detail-name').textContent = g.name;
  if ($('detail-subtitle')) $('detail-subtitle').textContent =
    `MM Size: ${g.range} | Millimeter Caliper Scaled`;
  if ($('detail-count')) $('detail-count').textContent = g.count;
  if ($('detail-moisture')) $('detail-moisture').textContent = g.moisture;
  if ($('detail-yield')) $('detail-yield').textContent = g.yield;
  if ($('detail-density')) $('detail-density').textContent = g.density;
  if ($('detail-usage')) $('detail-usage').textContent = g.usage;

  if ($('rfq-grade-name')) $('rfq-grade-name').textContent =
    g.label;

  const sphere = $('detail-sphere');
  if (sphere) {
    sphere.style.backgroundImage = `url("${IMG(g.key)}")`;
    sphere.style.backgroundSize = 'contain';
    sphere.style.backgroundPosition = 'center';
    sphere.style.backgroundRepeat = 'no-repeat';
    sphere.setAttribute('role','img');
    sphere.setAttribute('aria-label',`${g.label} makhana`);
  }

  const line = document.querySelector('.diameter-line');
  if (line) line.style.width = `${Math.min(g.mm / 30 * 100,100)}%`;

  if ($('detail-diameter-label')) $('detail-diameter-label').textContent = g.range;
}

function toggleCompareMode() {
  const d = $('comparison-drawer');
  if (!d) return;

  d.classList.toggle('hidden');

  if (!d.classList.contains('hidden')) {
    const opts = GRADES.map((g,i) => `<option value="${i}">${g.tag}</option>`).join('');
    if ($('compare-select-1')) $('compare-select-1').innerHTML = opts;
    if ($('compare-select-2')) $('compare-select-2').innerHTML = opts;
    if ($('compare-select-1')) $('compare-select-1').value = current;
    if ($('compare-select-2')) $('compare-select-2').value = (current + 1) % GRADES.length;
    updateComparison();
    d.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
}

function updateComparison() {
  const grid = $('comparison-grid');
  const a = $('compare-select-1');
  const b = $('compare-select-2');
  if (!grid || !a || !b) return;

  grid.innerHTML = [Number(a.value),Number(b.value)].map(i => {
    const g = GRADES[i];
    return `
      <div class="compare-col">
        <div class="compare-img">
          <img src="${IMG(g.key)}" alt="${g.label}" loading="lazy">
        </div>
        <h4>${g.label}</h4>
        <dl>
          <dt>Size</dt><dd>${g.range}</dd>
          <dt>Count / 100g</dt><dd>${g.count}</dd>
          <dt>Moisture</dt><dd>${g.moisture}</dd>
          <dt>Popping yield</dt><dd>${g.yield}</dd>
          <dt>Bulk density</dt><dd>${g.density}</dd>
        </dl>
      </div>`;
  }).join('');
}

const CBM = {'20ft':33,'40ft':76};
const BAG = {'10kg':[10,0.0995],'12.5kg':[12.5,0.1244],'8kg':[8,0.0796]};
const GRADE_F = {'7':1.08,'6':1,'5':0.94,'4':0.90,'medium':0.86,'small':0.82};

function calculateFreight() {
  const bag = $('calc-bag-size');
  const grade = $('calc-grade');
  const container = $('calc-container-type');
  if (!bag || !grade || !container) return;

  const data = BAG[bag.value];
  if (!data) return;

  const [kg,vol0] = data;
  const vol = vol0 * (GRADE_F[grade.value] || 1);
  const total = CBM[container.value];
  if (!total) return;

  const bags = Math.floor(total * 0.95 / vol);

  if ($('res-bags')) $('res-bags').textContent = bags.toLocaleString() + ' Bags';
  if ($('res-weight')) $('res-weight').textContent = (bags * kg).toLocaleString() + ' KG';
  if ($('res-volume')) $('res-volume').textContent = (bags * vol / total * 100).toFixed(1) + '% CBM';
}

function openRFQModal() {
  const modal = $('rfq-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeRFQModal() {
  const modal = $('rfq-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function openRFQForGrade() {
  const select = $('rfq-grade-select');
  const key = GRADES[current].key;

  if (select) {
    select.value = ['7','6','5','4','medium','small'].includes(key) ? key : 'all';
  }

  if ($('rfq-grade-name')) $('rfq-grade-name').textContent = GRADES[current].label;
  openRFQModal();
}

function openRFQWithFreight() {
  if ($('rfq-grade-select') && $('calc-grade'))
    $('rfq-grade-select').value = $('calc-grade').value;

  const textarea = document.querySelector('#rfq-form textarea');
  if (textarea) {
    textarea.value =
      `Load: ${$('calc-container-type')?.value || ''} container, ` +
      `${$('res-bags')?.textContent || ''} ` +
      `(${$('res-weight')?.textContent || ''}), ` +
      `${$('calc-bag-size')?.selectedOptions?.[0]?.text || ''}.`;
  }

  openRFQModal();
}

function handleRFQSubmit(e) {
  e.preventDefault();
  const form = $('rfq-form');
  if (form) {
    form.innerHTML = '<p class="rfq-ok"><i class="fa-solid fa-circle-check"></i> Thank you. Our export team will reply within 24 hours.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  preloadGradeImages();
  renderGrid();
  selectGrade(0);
  calculateFreight();

  if ($('mobile-toggle')) $('mobile-toggle').onclick = () =>
    $('nav-menu')?.classList.toggle('open');

  if ($('nav-menu')) $('nav-menu').onclick = () =>
    $('nav-menu').classList.remove('open');

  if ($('compare-select-1')) $('compare-select-1').onchange = updateComparison;
  if ($('compare-select-2')) $('compare-select-2').onchange = updateComparison;

  if ($('calc-bag-size')) $('calc-bag-size').onchange = calculateFreight;
  if ($('calc-grade')) $('calc-grade').onchange = calculateFreight;
  if ($('calc-container-type')) $('calc-container-type').onchange = calculateFreight;

  if ($('rfq-form')) $('rfq-form').onsubmit = handleRFQSubmit;

  if ($('rfq-modal')) $('rfq-modal').onclick = e => {
    if (e.target.id === 'rfq-modal') closeRFQModal();
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeRFQModal();
  });

  if ($('navbar')) {
    window.addEventListener('scroll', () => {
      $('navbar').classList.toggle('scrolled', window.scrollY > 30);
    }, {passive:true});
  }
});
