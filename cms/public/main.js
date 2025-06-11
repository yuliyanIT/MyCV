// AOS animation
if (window.AOS) {
  AOS.init({
    duration: 700,
    once: true,
  });
}

// Download CV as PDF (jsPDF)
if (window.jspdf && window.html2pdf) {
  const { jsPDF } = window.jspdf;
  document.getElementById('downloadBtn')?.addEventListener('click', () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const lineHeight = 9;
    const colGap = 20;
    const colWidth = ((pageWidth - margin * 2 - colGap) / 2) * 0.9;
    let yLeft = 20;
    let yRight = 20;
    function addTitle(text, x, y) {
      doc.setFontSize(16);
      doc.setTextColor('#1d4ed8');
      doc.setFont('helvetica', 'bold');
      doc.text(text, x, y);
      y += 4;
      doc.setDrawColor('#60a5fa');
      doc.setLineWidth(1.5);
      doc.line(x, y, x + 30, y);
      y += 12;
      return y;
    }
    function addText(lines, x, y, maxWidth) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#111');
      lines.forEach(line => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(doc.splitTextToSize(line, maxWidth), x, y);
        y += lineHeight;
      });
      y += 10;
      return y;
    }
    const img = new Image();
    img.src = 'cv_photo.png';
    img.onload = function() {
      doc.addImage(img, 'PNG', pageWidth - margin - 35, 15, 30, 30);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor('#0ea5e9');
      doc.text('Yuliyan Georgiev', margin, yLeft);
      yLeft += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor('#475569');
      doc.text('Junior Database Developer • Plovdiv, Bulgaria', margin, yLeft);
      yLeft += 20;
      yLeft = 60;
      yRight = 60;
      yLeft = addTitle('Contact', margin, yLeft);
      yLeft = addText([
        'Phone: 0886753738',
        'Email: yuliyangit@gmail.com',
        'LinkedIn: linkedin.com/in/yuliyan-georgiev'
      ], margin, yLeft, colWidth);
      yLeft = addTitle('Tech Skills', margin, yLeft);
      yLeft = addText([
        'SQL / T-SQL, SSMS / SSRS, C#, ASP.NET Core, MVC, Unit Testing,',
        'JavaScript, Node.js, HTML / CSS, Git'
      ], margin, yLeft, colWidth);
      yLeft = addTitle('Soft Skills', margin, yLeft);
      yLeft = addText([
        'Self-Driven, Disciplined, Team-Oriented, Proactive,',
        'Multitasking, Adaptability'
      ], margin, yLeft, colWidth);
      yLeft = addTitle('Languages', margin, yLeft);
      yLeft = addText([
        'Bulgarian – Native',
        'English – Proficient'
      ], margin, yLeft, colWidth);
      yRight = addTitle('Summary', margin + colWidth + colGap, yRight);
      yRight = addText([
        'Disciplined and adaptable software developer with a strong ability',
        'to multitask and maintain a positive outlook. Proactive, efficient,',
        'and focused on achieving high-quality results. Enjoys collaboration,',
        'thrives in dynamic environments, and is committed to continuous learning.'
      ], margin + colWidth + colGap, yRight, colWidth);
      yRight = addTitle('Experience', margin + colWidth + colGap, yRight);
      yRight = addText([
        'Junior Database Developer – eDynamix (2024–Present), Stara Zagora',
        '- Designed and maintained relational databases and schemas.',
        '- Automated data workflows with T-SQL and SSIS.',
        '- Created SSRS reports and dashboards.',
        '- Performance tuning of stored procedures and queries.'
      ], margin + colWidth + colGap, yRight, colWidth);
      yRight = addTitle('Education', margin + colWidth + colGap, yRight);
      yRight = addText([
        'Technical University of Sofia – Computer Systems (2023–Present)',
        'SoftUni – Software Developer C# (2021–2022)',
        'Vocational HS of Electrical Engineering – Plovdiv (2018–2023)'
      ], margin + colWidth + colGap, yRight, colWidth);
      doc.save('Yuliyan-Georgiev-CV.pdf');
    };
  });
}

// Side menu download button triggers main download
document.getElementById('sideDownloadBtn')?.addEventListener('click', function() {
  document.getElementById('downloadBtn')?.click();
});

// Menu toggle
function toggleMenu() {
  const menu = document.getElementById('sideMenu');
  const menuToggle = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('closeMenuBtn');
  menu.classList.toggle('closed');
  if (menu.classList.contains('closed')) {
    if(menuToggle) menuToggle.style.display = 'flex';
    if(closeBtn) closeBtn.style.display = 'none';
  } else {
    if(menuToggle) menuToggle.style.display = 'none';
    if(closeBtn) closeBtn.style.display = 'block';
  }
}

// Side menu links scroll
document.querySelectorAll('#sideMenu a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 30,
        behavior: 'smooth'
      });
    }
    if (window.innerWidth < 900) {
      toggleMenu();
    }
  });
});

// Fun fact
const facts = [
  "Did you know? I love learning new tech!",
  "Fun fact: I built my first game at 15.",
  "Music helps me focus while coding.",
  "I’m always up for a new challenge!"
];
let factIdx = 0;
window.nextFact = function() {
  factIdx = (factIdx + 1) % facts.length;
  document.getElementById('factText').textContent = facts[factIdx];
};

// Progress bar on scroll
window.addEventListener('scroll', function() {
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollTop = window.scrollY || window.pageYOffset;
  const progress = docHeight > 0 ? (scrollTop / docHeight) : 0;
  const bar = document.getElementById('progressBarFill');
  if(bar) bar.style.height = (progress * 100) + '%';
});

// Vertical stars active state on scroll
window.addEventListener('scroll', function() {
  const stars = document.querySelectorAll('.vertical-stars .star');
  const sections = [
    '#summary', '#experience', '#skills', '#education', '#soft-skills', '#languages', '#contacts'
  ].map(id => document.querySelector(id));
  let activeIdx = 0;
  for (let i = 0; i < sections.length ; i++) {
    if (sections[i] && window.scrollY + 500 > sections[i].offsetTop) {
      activeIdx = i;
    }
  }
  stars.forEach((star, idx) => {
    if (idx === activeIdx) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
});

// Flip-card dynamic height for smooth animation
document.querySelectorAll('.flip-card').forEach(card => {
  const inner = card.querySelector('.flip-card-inner');
  const front = card.querySelector('.flip-card-front');
  const back = card.querySelector('.flip-card-back');
  card.addEventListener('mouseenter', () => {
    front.style.display = 'block';
    back.style.display = 'block';
    const frontHeight = front.offsetHeight;
    const backHeight = back.offsetHeight;
    const maxHeight = Math.max(frontHeight, backHeight);
    card.style.height = maxHeight + 'px';
    if(inner) inner.style.height = maxHeight + 'px';
  });
  card.addEventListener('mouseleave', () => {
    card.style.height = '';
    if(inner) inner.style.height = '';
    front.style.display = '';
    back.style.display = '';
  });
});

// Touch flip for mobile
if ('ontouchstart' in window) {
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', function () {
      this.classList.toggle('flipped');
    });
  });
}