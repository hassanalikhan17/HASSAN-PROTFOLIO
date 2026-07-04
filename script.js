// mobile menu
const burger = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
burger.addEventListener('click', ()=> mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', ()=> mobileMenu.classList.remove('open'));
mobileMenu.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> mobileMenu.classList.remove('open')));

// active nav link
const sections = document.querySelectorAll('section[id]');
const navA = document.querySelectorAll('.nav-links a');
const pageName = window.location.pathname.split('/').pop();

function updateActiveNav() {
  if (pageName === 'about.html') {
    navA.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href').includes('about.html'));
    });
    return;
  }

  let current = window.location.hash || '#home';
  if (current === '#') current = '#home';
  sections.forEach(sec => {
    const top = sec.offsetTop - 140;
    if (window.scrollY >= top) current = '#'+sec.getAttribute('id');
  });
  navA.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === current);
  });
}

window.addEventListener('load', updateActiveNav);
window.addEventListener('scroll', updateActiveNav);
window.addEventListener('hashchange', updateActiveNav);

// typing effect
const phrases = ["Full Stack Development", "Clean, Scalable Code", "Agile & Scrum Delivery", "REST API Integration"];
const typeTarget = document.getElementById('typeTarget');
let pIndex = 0, cIndex = 0, deleting = false;
function typeLoop(){
  const current = phrases[pIndex];
  if(!deleting){
    cIndex++;
    typeTarget.textContent = current.slice(0, cIndex);
    if(cIndex === current.length){ deleting = true; setTimeout(typeLoop, 1400); return; }
  } else {
    cIndex--;
    typeTarget.textContent = current.slice(0, cIndex);
    if(cIndex === 0){ deleting = false; pIndex = (pIndex+1) % phrases.length; }
  }
  setTimeout(typeLoop, deleting ? 35 : 65);
}
typeLoop();

// reveal on scroll + language bars
const revealEls = document.querySelectorAll('.reveal');
const barFills = document.querySelectorAll('.bar-fill');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      if(entry.target.classList.contains('panel-soft')){
        barFills.forEach(b=> b.style.width = b.dataset.width);
      }
    }
  });
}, {threshold:0.15});
revealEls.forEach(el=> io.observe(el));
document.querySelectorAll('.panel-soft').forEach(el=> io.observe(el));

// header shadow on scroll
const headerEl = document.getElementById('siteHeader');
window.addEventListener('scroll', ()=>{
  headerEl.style.boxShadow = window.scrollY > 40 ? '0 8px 32px rgba(255,212,0,0.2)' : '0 4px 20px rgba(255,212,0,0.1)';
});

// back to top button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', ()=>{
  backToTop.classList.toggle('show', window.scrollY > 500);
});
backToTop.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

// certificate lightbox modal
const certModal = document.getElementById('certModal');
const certModalImg = document.getElementById('certModalImg');
const certModalClose = document.getElementById('certModalClose');
document.querySelectorAll('[data-cert-open]').forEach(el=>{
  el.addEventListener('click', ()=>{
    const img = el.closest('.cert-card').querySelector('img');
    certModalImg.src = img.src;
    certModalImg.alt = img.alt;
    certModal.classList.add('open');
  });
});
certModalClose.addEventListener('click', ()=> certModal.classList.remove('open'));
certModal.addEventListener('click', (e)=>{ if(e.target === certModal) certModal.classList.remove('open'); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') certModal.classList.remove('open'); });

// ---------- GitHub Projects: fetch, search, filter ----------
(function(){
  const GITHUB_USERNAME = 'hassanalikhan17';
  const projectGrid = document.getElementById('projectGrid');
  const projectStatus = document.getElementById('projectStatus');
  const projectSearch = document.getElementById('projectSearch');
  const projectFilters = document.getElementById('projectFilters');

  let allRepos = [];
  let activeLang = 'all';

  function timeAgo(dateStr){
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diffMs / 86400000);
    if(days < 1) return 'today';
    if(days === 1) return '1 day ago';
    if(days < 30) return days + ' days ago';
    const months = Math.floor(days/30);
    if(months < 12) return months + (months===1?' month ago':' months ago');
    const years = Math.floor(months/12);
    return years + (years===1?' year ago':' years ago');
  }

  function renderRepos(){
    const q = projectSearch.value.trim().toLowerCase();
    const filtered = allRepos.filter(r=>{
      const matchesLang = activeLang === 'all' || (r.language || 'Other') === activeLang;
      const matchesQuery = !q || r.name.toLowerCase().includes(q) || (r.description||'').toLowerCase().includes(q);
      return matchesLang && matchesQuery;
    });

    if(filtered.length === 0){
      projectGrid.innerHTML = '<div class="project-empty">No repositories match your search/filter.</div>';
      return;
    }

    projectGrid.innerHTML = filtered.map(r=>{
      const tags = [r.language, ...(r.topics||[]).slice(0,3)].filter(Boolean);
      return `
        <div class="proj-card">
          <div class="proj-top">
            <span class="proj-spec">Updated ${timeAgo(r.updated_at)}</span>
            <span class="proj-type">${r.language || 'Code'}</span>
          </div>
          <h3>${r.name.replace(/[-_]/g,' ')}</h3>
          <p>${r.description ? r.description : 'No description provided for this repository.'}</p>
          <div class="proj-tags">${tags.map(t=>`<span>${t}</span>`).join('')}</div>
          <div class="proj-links">
            <a href="${r.html_url}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Repo</a>
            ${r.homepage ? `<a href="${r.homepage}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>` : ''}
          </div>
        </div>`;
    }).join('');
  }

  function buildFilters(){
    const langs = Array.from(new Set(allRepos.map(r=> r.language || 'Other'))).sort();
    projectFilters.innerHTML = '<button class="filter-chip active" data-lang="all">All</button>' +
      langs.map(l=> `<button class="filter-chip" data-lang="${l}">${l}</button>`).join('');

    projectFilters.querySelectorAll('.filter-chip').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        activeLang = btn.dataset.lang;
        projectFilters.querySelectorAll('.filter-chip').forEach(b=> b.classList.remove('active'));
        btn.classList.add('active');
        renderRepos();
      });
    });
  }

  async function loadRepos(){
    const CACHE_KEY = 'gh_repos_' + GITHUB_USERNAME;
    const CACHE_TTL = 60 * 60 * 1000; // 1 hour

    let cached = null;
    try{
      const raw = localStorage.getItem(CACHE_KEY);
      if(raw) cached = JSON.parse(raw);
    }catch(e){ /* ignore corrupt cache / blocked storage */ }

    if(cached && Date.now() - cached.savedAt < CACHE_TTL){
      allRepos = cached.data;
      projectStatus.style.display = 'none';
      buildFilters();
      renderRepos();
      return;
    }

    try{
      const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
      if(!res.ok) throw new Error('GitHub API responded with ' + res.status);
      const data = await res.json();
      allRepos = data.filter(r=> !r.fork);
      try{
        localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data: allRepos }));
      }catch(e){ /* storage full or blocked */ }
      projectStatus.style.display = 'none';
      buildFilters();
      renderRepos();
    }catch(err){
      if(cached){
        allRepos = cached.data;
        projectStatus.style.display = 'none';
        buildFilters();
        renderRepos();
      }else{
        projectStatus.innerHTML = `More repositories will appear here shortly. <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener" style="color:var(--violet); text-decoration:underline;">View the full profile on GitHub</a> in the meantime.`;
      }
    }
  }

  loadRepos();
  projectSearch.addEventListener('input', renderRepos);
})();

// ---------- AI CHATBOT WIDGET WITH VOICE (speech-out) + MIC (speech-in) ----------
(function(){
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatbotVoiceToggle = document.getElementById('chatbotVoiceToggle');
  const chatbotMicToggle = document.getElementById('chatbotMicToggle');
  const chatbotContainer = document.querySelector('.chatbot-container');
  const chatbotMessages = document.getElementById('chatbotMessages');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSend = document.getElementById('chatbotSend');

  let voiceEnabled = false;
  const synth = window.speechSynthesis;

  const chatbotData = {
    'hello': 'Hi! 👋 I\'m Hassan\'s AI assistant. I can tell you about his skills, projects, experience, and more. What would you like to know?',
    'hi': 'Hey there! 👋 I\'m Hassan\'s AI assistant. Ask me anything about his portfolio, skills, or projects!',
    'skills': 'Hassan is skilled in:\n• Languages: C++, Java, JavaScript (ES6+)\n• Web: HTML5, CSS3, Responsive Design\n• Databases: SQL, Relational DB Design\n• Tools: Jira, Git, Figma, Confluence, MS Project, Appium, Wireshark\n• Testing: Manual Testing, Mobile Testing, Test Case Writing',
    'projects': 'Hassan has built several impressive projects:\n• ERP System - Multi-module business management\n• LMS - Learning Management System\n• POS System - Point of Sale solution\n• ER System - Employee Records management\n• Admin Dashboard\n• And more on his GitHub profile!',
    'experience': 'Hassan is currently a Full Stack Development Intern at Eziline Software House in Rawalpindi, Pakistan. He works with:\n• Agile/Scrum methodology\n• Jira for sprint planning\n• Full stack development\n• REST API integration\n• Git version control',
    'education': 'Hassan is pursuing a BS in Software Engineering at Foundation University (6th semester, CGPA 3.22/4.0). He previously completed:\n• FSC Pre-Engineering at Fouji Foundation College\n• Science Matriculation at Pak Land School & College',
    'resume': 'You can download Hassan\'s CV using the "Download CV" button on the home page. It contains his complete resume, achievements, and contact details.',
    'cv': 'You can download Hassan\'s CV using the "Download CV" button on the home page. It contains his complete resume, achievements, and contact details.',
    'contact': 'Hassan\'s contact details:\n📧 Email: hassanjaddon@gmail.com\n📱 Phone: 0333-5217746\n📍 Location: Gulshan E Khudadad, Rawalpindi, Pakistan\n🔗 LinkedIn: www.linkedin.com/in/hassan-ali-khan-9296b9374\n💻 GitHub: github.com/hassanalikhan17',
    'github': 'Hassan\'s GitHub profile: github.com/hassanalikhan17\nHe has multiple projects including ERP, LMS, POS systems and more!',
    'linkedin': 'Connect with Hassan on LinkedIn:\nwww.linkedin.com/in/hassan-ali-khan-9296b9374',
    'internship': 'Hassan is currently interning at Eziline Software House as a Full Stack Developer. He works on:\n• Feature development\n• API integration\n• Database management\n• Front-end UI components\n• Following Agile practices',
    'software engineering': 'Hassan is a 6th-semester Software Engineering student at Foundation University with a CGPA of 3.22/4.0. He combines academic learning with practical experience from his internship.',
    'work': 'Hassan is open to internships, freelance projects, and full-time Full Stack Developer roles. Contact him to discuss opportunities!',
    'freelance': 'Hassan is open to freelance projects! Contact him at hassanjaddon@gmail.com or call 0333-5217746 to discuss your project.',
    'about': 'Hassan Ali Khan is a Full Stack Developer and 6th-semester Software Engineering student at Foundation University. He\'s skilled in Java, JavaScript, HTML5, CSS3, and SQL with practical experience from his internship at Eziline Software House.',
    'thanks': 'You\'re welcome! 😊 Feel free to ask me anything else about Hassan\'s work, skills, or how to get in touch.',
    'help': 'I can help you with:\n• Skills & Technologies\n• Projects & Portfolio\n• Experience & Internship\n• Education & Background\n• Contact Information\n• Resume/CV\n• LinkedIn Profile\nJust ask me about any of these topics!',
    'default': 'That\'s an interesting question! 🤔 I can tell you about Hassan\'s skills, projects, experience, education, or contact details. What would you like to know?'
  };

  function sanitizeText(text){
    const textarea = document.createElement('textarea');
    textarea.textContent = text;
    return textarea.innerHTML;
  }

  function findAnswer(input){
    const lowerInput = input.toLowerCase();
    for(const [key, answer] of Object.entries(chatbotData)){
      if(key !== 'default' && lowerInput.includes(key)){
        return answer;
      }
    }
    return chatbotData.default;
  }

  function speakText(text){
    if(!voiceEnabled || !synth) return;
    synth.cancel();
    // strip emoji/bullets before speaking so it doesn't read out symbol names
    const clean = text.replace(/[•📧📱📍🔗💻👋😊🤔]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    synth.speak(utterance);
  }

  function addMessage(text, sender){
    const msgDiv = document.createElement('div');
    msgDiv.className = `chatbot-message ${sender}`;

    if(sender === 'bot'){
      msgDiv.innerHTML = `
        <div class="chatbot-message-avatar">🤖</div>
        <div class="chatbot-message-content">${sanitizeText(text)}</div>
      `;
    } else {
      msgDiv.innerHTML = `
        <div class="chatbot-message-content">${sanitizeText(text)}</div>
        <div class="chatbot-message-avatar">👤</div>
      `;
    }

    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function sendMessage(){
    const text = chatbotInput.value.trim();
    if(!text) return;

    addMessage(text, 'user');
    chatbotInput.value = '';

    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot';
    typingDiv.innerHTML = `
      <div class="chatbot-message-avatar">🤖</div>
      <div class="chatbot-message-content">
        <div class="chatbot-typing">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    setTimeout(()=>{
      typingDiv.remove();
      const response = findAnswer(text);
      addMessage(response, 'bot');
      speakText(response);
    }, 500 + Math.random() * 800);
  }

  chatbotVoiceToggle.addEventListener('click', ()=>{
    voiceEnabled = !voiceEnabled;
    chatbotVoiceToggle.classList.toggle('active', voiceEnabled);
    if(voiceEnabled){
      chatbotVoiceToggle.title = 'Voice enabled';
    } else {
      synth.cancel();
      chatbotVoiceToggle.title = 'Voice disabled';
    }
  });

  chatbotToggle.addEventListener('click', ()=>{
    chatbotContainer.classList.toggle('open');
    if(chatbotContainer.classList.contains('open')){
      chatbotInput.focus();
      if(chatbotMessages.children.length === 0){
        const greeting = 'Hello! 👋 I\'m Hassan\'s AI Assistant. Ask me about his skills, projects, experience, or anything else on this portfolio!';
        addMessage(greeting, 'bot');
        speakText(greeting);
      }
    }
  });

  chatbotClose.addEventListener('click', ()=>{
    chatbotContainer.classList.remove('open');
    synth.cancel();
  });

  chatbotSend.addEventListener('click', sendMessage);
  chatbotInput.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter') sendMessage();
  });

  document.addEventListener('click', (e)=>{
    if(!e.target.closest('.chatbot-widget')){
      chatbotContainer.classList.remove('open');
      synth.cancel();
    }
  });

  // ---- Mic input (speech-to-text), fix: this button existed in HTML but had no JS ----
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  let isListening = false;

  if (SpeechRecognitionAPI && chatbotMicToggle) {
    recognition = new SpeechRecognitionAPI();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.addEventListener('result', (e) => {
      chatbotInput.value = e.results[0][0].transcript;
      sendMessage();
    });
    recognition.addEventListener('end', () => {
      isListening = false;
      chatbotMicToggle.classList.remove('listening');
    });
    recognition.addEventListener('error', () => {
      isListening = false;
      chatbotMicToggle.classList.remove('listening');
    });

    chatbotMicToggle.addEventListener('click', () => {
      if (isListening) { recognition.stop(); return; }
      isListening = true;
      chatbotMicToggle.classList.add('listening');
      try { recognition.start(); } catch (err) { /* already started */ }
    });
  } else if (chatbotMicToggle) {
    // browser doesn't support speech recognition (e.g. Firefox) — hide the button
    chatbotMicToggle.style.display = 'none';
  }
})();