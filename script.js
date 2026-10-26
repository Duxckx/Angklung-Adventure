const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
$("#year").textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = $("#menuToggle"), mainNav = $("#mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "×" : "☰";
});
$$(".nav-link").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open"); menuToggle.setAttribute("aria-expanded","false"); menuToggle.textContent="☰";
  $$(".nav-link").forEach(n => n.classList.toggle("active", n === link));
}));
const sections = ["beranda","jelajahi","sound-lab","memory-game","kuis"].map(id => $("#"+id));
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) $$(".nav-link").forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#"+entry.target.id));
  }), {rootMargin:"-35% 0px -55% 0px"});
  sections.forEach(section => observer.observe(section));
}

// Cultural learning cards
const modalContent = {
  sejarah: {icon:"📜",title:"Jejak sejarah angklung",body:`<p>Angklung merupakan alat musik tradisional berbahan bambu yang lekat dengan budaya Sunda, terutama di Jawa Barat. Dalam berbagai tradisi masyarakat, angklung pernah berkaitan dengan kegiatan pertanian, upacara adat, dan hiburan masyarakat.</p><p>Sejarah angklung berkembang melalui beragam bentuk dan kebiasaan daerah. Karena itu, cerita asal-usulnya dapat berbeda menurut tradisi lisan setempat.</p><ul><li>Angklung dibuat dari tabung-tabung bambu yang dirangkai.</li><li>UNESCO memasukkan “Indonesian Angklung” ke Daftar Representatif Warisan Budaya Takbenda Kemanusiaan pada 2010.</li></ul>`},
  cara: {icon:"🎶",title:"Bagaimana angklung berbunyi?",body:`<p>Angklung dimainkan dengan menggoyangkan rangkanya. Tabung bambu bergetar dan menghasilkan bunyi dengan nada tertentu, bergantung pada ukuran serta penyetelan tabungnya.</p><ul><li>Pegang bagian rangka angklung dengan mantap.</li><li>Goyangkan ke kiri dan kanan secara teratur.</li><li>Ikuti aba-aba atau pola nada agar permainan terdengar selaras.</li></ul><p>Dalam ansambel, pemain biasanya memainkan nada berbeda sehingga kerja sama menjadi penting.</p>`},
  budaya: {icon:"🤝",title:"Musik yang menyatukan",body:`<p>Permainan angklung secara berkelompok menunjukkan pentingnya mendengarkan satu sama lain, menjaga tempo, dan menunggu giliran nada. Setiap bagian berkontribusi pada melodi yang utuh.</p><p>Tradisi angklung diwariskan melalui keluarga, komunitas, sekolah, sanggar, dan pertunjukan. UNESCO menekankan peran pendidikan, kerja sama, serta pewarisan pengetahuan dalam menjaga tradisi ini.</p>`}
};
const modal = $("#infoModal");
function openModal(key){const item=modalContent[key];$("#modalIcon").textContent=item.icon;$("#modalTitle").textContent=item.title;$("#modalBody").innerHTML=item.body;modal.classList.remove("hidden");$("#closeModal").focus();document.body.style.overflow="hidden";}
function closeModal(){modal.classList.add("hidden");document.body.style.overflow="";}
$$("[data-modal]").forEach(btn=>btn.addEventListener("click",()=>openModal(btn.dataset.modal)));
$("#closeModal").addEventListener("click",closeModal);$("#modalDone").addEventListener("click",closeModal);
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!modal.classList.contains("hidden"))closeModal()});

// Sound Lab: individual reference notes use Web Audio; authentic ensemble recording is played from a CC0 Wikimedia Commons source.
let audioContext;
function playTone(freq, duration=0.65){
  const Ctx=window.AudioContext||window.webkitAudioContext;
  if(!Ctx){showToast("Browser ini belum mendukung audio digital.");return}
  audioContext ||= new Ctx();
  if(audioContext.state==="suspended") audioContext.resume();
  const now=audioContext.currentTime;
  const master=audioContext.createGain(); master.gain.setValueAtTime(.0001,now); master.gain.exponentialRampToValueAtTime(.22,now+.015); master.gain.exponentialRampToValueAtTime(.0001,now+duration); master.connect(audioContext.destination);
  const fundamental=audioContext.createOscillator(), overtone=audioContext.createOscillator(), mix=audioContext.createGain();
  fundamental.type="sine";fundamental.frequency.setValueAtTime(Number(freq),now);
  overtone.type="triangle";overtone.frequency.setValueAtTime(Number(freq)*2.01,now);mix.gain.value=.17;
  fundamental.connect(master);overtone.connect(mix);mix.connect(master);
  fundamental.start(now);overtone.start(now);fundamental.stop(now+duration+.03);overtone.stop(now+duration+.03);
}
$$(".note-key").forEach(key=>key.addEventListener("click",()=>{
  $$(".note-key").forEach(k=>k.classList.remove("active"));key.classList.add("active");
  const realAudio=$("#authenticAngklung"); if(!realAudio.paused){realAudio.pause();realAudio.currentTime=0;}
  playTone(key.dataset.note,.55);$("#soundStatus").textContent=`Nada ${key.dataset.name} · referensi digital (bukan sampel nada angklung asli)`;
}));
const authenticAngklung=$("#authenticAngklung");
const melodyButton=$("#playMelody");
melodyButton.addEventListener("click",async()=>{
  if(!authenticAngklung.paused){authenticAngklung.pause();melodyButton.textContent="▶ Dengarkan angklung asli";$("#soundStatus").textContent="Rekaman dijeda";return;}
  try{
    $$(".note-key").forEach(k=>k.classList.remove("active"));
    authenticAngklung.currentTime=0;
    await authenticAngklung.play();
    melodyButton.textContent="Ⅱ Jeda rekaman";
    $("#soundStatus").textContent="Memutar rekaman angklung asli · sumber Wikimedia Commons (CC0)";
  }catch(error){
    $("#soundStatus").textContent="Rekaman perlu internet. Coba buka tautan sumber di bawah untuk mendengarkannya.";
    showToast("Rekaman asli tidak dapat dimuat. Periksa koneksi internet.");
  }
});
authenticAngklung.addEventListener("ended",()=>{melodyButton.textContent="▶ Dengarkan angklung asli";$("#soundStatus").textContent="Rekaman selesai · coba tombol nada referensi Do–Si";});
authenticAngklung.addEventListener("error",()=>{melodyButton.textContent="▶ Coba rekaman lagi";});


// Mini game: listen to an automatically played sequence, then repeat it.
const rhythmFrequencies=[261.63,293.66,329.63,349.23,392.00,440.00,493.88];
const rhythmNames=["Do","Re","Mi","Fa","Sol","La","Si"];
let rhythmSequence=[],rhythmInputIndex=0,rhythmLevel=1,rhythmScore=0,rhythmPlaying=false,rhythmActive=false,rhythmBest=0,rhythmRunId=0;
const rhythmKeys=$$(".rhythm-key");
function setRhythmKeys(enabled){rhythmKeys.forEach(key=>key.disabled=!enabled)}
function rhythmWait(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
async function playRhythmSequence(){
  if(!rhythmActive||rhythmPlaying)return;
  rhythmPlaying=true;setRhythmKeys(false);$("#rhythmReplay").disabled=true;$("#rhythmStart").classList.add("hidden");
  $("#rhythmMessage").textContent=`Dengarkan baik-baik… ${rhythmSequence.length} nada akan dimainkan.`;
  const runId=++rhythmRunId;
  await rhythmWait(500);
  for(let i=0;i<rhythmSequence.length;i++){
    if(runId!==rhythmRunId||!rhythmActive)return;
    const noteIndex=rhythmSequence[i],key=rhythmKeys[noteIndex];
    key.classList.add("playing");playTone(rhythmFrequencies[noteIndex],.48);
    await rhythmWait(500);
    key.classList.remove("playing");
    await rhythmWait(190);
  }
  if(runId!==rhythmRunId||!rhythmActive)return;
  rhythmPlaying=false;rhythmInputIndex=0;setRhythmKeys(true);$("#rhythmReplay").disabled=false;
  $("#rhythmMessage").textContent="Sekarang giliranmu! Ulangi urutan nada tadi.";
}
function beginRhythmGame(){
  rhythmRunId++;rhythmActive=true;rhythmPlaying=false;rhythmSequence=[];rhythmInputIndex=0;rhythmLevel=1;rhythmScore=0;
  $("#rhythmResult").classList.add("hidden");$("#rhythmStart").classList.remove("hidden");$("#rhythmStart").textContent="Mulai dari awal ↻";
  updateRhythmStats();setRhythmKeys(false);$("#rhythmReplay").disabled=true;addRhythmNote();addRhythmNote();addRhythmNote();playRhythmSequence();
}
function addRhythmNote(){rhythmSequence.push(Math.floor(Math.random()*rhythmFrequencies.length))}
function updateRhythmStats(){$("#rhythmLevel").textContent=rhythmLevel;$("#rhythmScore").textContent=rhythmScore;$("#rhythmLength").textContent=`${rhythmSequence.length} nada`}
function handleRhythmInput(index){
  if(!rhythmActive||rhythmPlaying)return;
  const key=rhythmKeys[index];key.classList.add("playing");playTone(rhythmFrequencies[index],.42);setTimeout(()=>key.classList.remove("playing"),250);
  if(index!==rhythmSequence[rhythmInputIndex]){
    rhythmActive=false;rhythmPlaying=false;rhythmRunId++;setRhythmKeys(false);$("#rhythmReplay").disabled=true;
    $("#rhythmMessage").textContent="Belum tepat—tidak apa-apa, coba ingat urutannya lagi!";
    $("#rhythmResultTitle").textContent="Irama terhenti!";$("#rhythmResultText").textContent=`Kamu mencapai level ${rhythmLevel} dan mendapat ${rhythmScore} poin. Skor terbaik sesi ini: ${Math.max(rhythmBest,rhythmScore)}.`;
    rhythmBest=Math.max(rhythmBest,rhythmScore);$("#rhythmResult").classList.remove("hidden");$("#rhythmStart").classList.remove("hidden");$("#rhythmStart").textContent="Main lagi ↻";return;
  }
  rhythmInputIndex++;
  if(rhythmInputIndex===rhythmSequence.length){
    rhythmScore+=rhythmSequence.length*10;rhythmLevel++;updateRhythmStats();setRhythmKeys(false);$("#rhythmReplay").disabled=true;
    $("#rhythmMessage").textContent="Hebat! Urutannya benar. Siap untuk tantangan berikutnya?";
    rhythmSequence.push(Math.floor(Math.random()*rhythmFrequencies.length));
    setTimeout(()=>{if(rhythmActive)playRhythmSequence()},900);
  }
}
rhythmKeys.forEach(key=>key.addEventListener("click",()=>handleRhythmInput(Number(key.dataset.rhythmNote))));
$("#rhythmStart").addEventListener("click",beginRhythmGame);
$("#rhythmTryAgain").addEventListener("click",beginRhythmGame);
$("#rhythmReplay").addEventListener("click",()=>{if(rhythmActive&&!rhythmPlaying)playRhythmSequence()});

// Quiz: answer key and explanations are authored to be objective and age-appropriate.
const questions=[
 {tag:"KENALI ANGKLUNG",q:"Angklung dikenal sebagai alat musik tradisional dari daerah mana di Indonesia?",options:["Jawa Barat","Sumatra Barat","Sulawesi Selatan","Nusa Tenggara Timur"],answer:0,why:"Angklung sangat lekat dengan budaya Sunda di Jawa Barat."},
 {tag:"BAHAN PEMBUATAN",q:"Bahan utama yang digunakan untuk membuat angklung tradisional adalah…",options:["Bambu","Tanah liat","Kulit hewan","Batu"],answer:0,why:"Tabung-tabung angklung dibuat dari bambu dan dipasang pada sebuah rangka."},
 {tag:"CARA MEMAINKAN",q:"Bagaimana cara umum memainkan angklung?",options:["Dipukul dengan stik logam","Ditiup seperti seruling","Digoyangkan agar tabung bambu bergetar","Dipetik seperti gitar"],answer:2,why:"Angklung menghasilkan bunyi ketika rangkanya digoyangkan sehingga tabung bambunya bergetar."},
 {tag:"PENGENALAN NADA",q:"Apa yang membantu menentukan tinggi-rendah nada pada tabung angklung?",options:["Warna catnya","Ukuran dan penyetelan tabung bambu","Jumlah penonton","Bentuk panggung"],answer:1,why:"Ukuran dan penyetelan tabung berpengaruh pada frekuensi getaran, sehingga menentukan nada yang dihasilkan."},
 {tag:"WARISAN BUDAYA",q:"Pada tahun berapa UNESCO memasukkan Indonesian Angklung ke Daftar Representatif Warisan Budaya Takbenda Kemanusiaan?",options:["2001","2005","2010","2018"],answer:2,why:"UNESCO memasukkan Indonesian Angklung ke daftar tersebut pada 2010."},
 {tag:"MUSIK BERSAMA",q:"Mengapa kerja sama penting saat memainkan angklung dalam kelompok?",options:["Agar semua pemain bermain sekeras mungkin","Karena setiap pemain dapat memegang bagian nada yang berbeda dan perlu menjaga tempo","Agar hanya satu orang yang memainkan semua nada","Supaya angklung tidak perlu digoyangkan"],answer:1,why:"Pemain perlu mengikuti aba-aba dan tempo agar nada yang berbeda tersusun menjadi musik yang selaras."},
 {tag:"PENGETAHUAN BUDAYA",q:"Manakah pernyataan yang paling tepat tentang tradisi angklung?",options:["Hanya boleh dimainkan saat perlombaan","Tidak boleh diajarkan kepada generasi muda","Selalu memiliki bentuk dan fungsi yang sama di semua daerah","Dapat diwariskan melalui keluarga, komunitas, sanggar, dan pendidikan"],answer:3,why:"Tradisi angklung dapat diteruskan lewat berbagai lingkungan, termasuk keluarga, komunitas, sanggar, dan sekolah."},
 {tag:"DENGARKAN DENGAN SAKSAMA",q:"Dalam permainan ansambel angklung, apa yang sebaiknya dilakukan pemain ketika menunggu giliran nadanya?",options:["Mengikuti aba-aba dan mendengarkan pemain lain","Menggoyangkan angklung terus-menerus tanpa melihat aba-aba","Memainkan nada secara acak","Berhenti mendengarkan musik"],answer:0,why:"Mendengarkan dan mengikuti aba-aba membantu setiap pemain masuk pada waktu yang tepat."}
];
let quizIndex=0, score=0, locked=false, selectedAnswers=[];
const letters=["A","B","C","D"];
function startQuiz(){quizIndex=0;score=0;locked=false;selectedAnswers=[];$("#quizStart").classList.add("hidden");$("#quizResult").classList.add("hidden");$("#quizPlay").classList.remove("hidden");renderQuestion();$("#quizShell").scrollIntoView({behavior:"smooth",block:"center"})}
function renderQuestion(){
 locked=false;const q=questions[quizIndex];$("#questionCounter").textContent=`PERTANYAAN ${quizIndex+1} DARI ${questions.length}`;$("#liveScore").textContent=score;$("#progressBar").style.width=`${quizIndex/questions.length*100}%`;$("#questionTag").textContent=q.tag;$("#questionText").textContent=q.q;$("#answeredCount").textContent=`${selectedAnswers.length} dijawab`;$("#feedbackBox").className="feedback-box hidden";$("#feedbackBox").textContent="";$("#nextQuestion").disabled=true;$("#nextQuestion").innerHTML=quizIndex===questions.length-1?'Lihat hasil <span>→</span>':'Berikutnya <span>→</span>';
 const list=$("#answerList");list.innerHTML="";
 q.options.forEach((label,i)=>{const b=document.createElement("button");b.className="answer-option";b.innerHTML=`<span class="answer-letter">${letters[i]}</span><span></span>`;b.lastElementChild.textContent=label;b.addEventListener("click",()=>chooseAnswer(i,b));list.appendChild(b)});
}
function chooseAnswer(index,button){
 if(locked)return;locked=true;const q=questions[quizIndex],correct=index===q.answer;selectedAnswers.push(index);if(correct)score+=10;
 $$(".answer-option",$("#answerList")).forEach((b,i)=>{b.disabled=true;if(i===q.answer)b.classList.add("selected-correct");else if(i===index)b.classList.add("selected-wrong")});
 const feedback=$("#feedbackBox");feedback.classList.remove("hidden");feedback.classList.toggle("wrong",!correct);feedback.innerHTML=`<strong>${correct?"✓ Tepat!":"Belum tepat."}</strong> ${q.why}`;
 $("#liveScore").textContent=score;$("#answeredCount").textContent=`${selectedAnswers.length} dari ${questions.length} dijawab`;$("#progressBar").style.width=`${(quizIndex+1)/questions.length*100}%`;$("#nextQuestion").disabled=false;
}
function showResult(){
 $("#quizPlay").classList.add("hidden");$("#quizResult").classList.remove("hidden");$("#finalScore").textContent=score;$("#resultProgress").style.width=`${score/(questions.length*10)*100}%`;
 let medal,title,message,rank;
 if(score>=70){medal="🏆";title="Ahli Angklung!";message="Luar biasa! Kamu mengenal banyak hal tentang angklung dan budayanya.";rank="Gelar: Penjaga Warisan Budaya"}
 else if(score>=40){medal="🎋";title="Penjelajah Hebat!";message="Kamu sudah punya bekal bagus. Pelajari lagi beberapa fakta untuk memperdalam pengetahuanmu.";rank="Gelar: Penjelajah Bambu"}
 else{medal="🌱";title="Awal yang Bagus!";message="Setiap ahli berawal dari rasa ingin tahu. Jelajahi kartu materi, lalu coba lagi!";rank="Gelar: Tunas Penjelajah"}
 $("#resultMedal").textContent=medal;$("#resultTitle").textContent=title;$("#resultMessage").textContent=message;$("#resultRank").textContent=rank;$("#quizShell").scrollIntoView({behavior:"smooth",block:"center"});
}
$("#startQuiz").addEventListener("click",startQuiz);$("#retryQuiz").addEventListener("click",startQuiz);
$("#nextQuestion").addEventListener("click",()=>{if(!locked)return;if(quizIndex<questions.length-1){quizIndex++;renderQuestion()}else showResult()});
let toastTimer;function showToast(message){const toast=$("#toast");toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2500)}
