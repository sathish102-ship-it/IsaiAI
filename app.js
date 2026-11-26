const $=id=>document.getElementById(id);
const HOSTED="https://acemusic.ai/ace-step/";
const KEY="isai_v4_songs";
let songs=JSON.parse(localStorage.getItem(KEY)||"[]");

$("endpoint").value=localStorage.getItem("isai_v4_endpoint")||"";
$("apiKey").value=localStorage.getItem("isai_v4_key")||"";

function payload(){
 return {
  title:$("title").value.trim(),
  lyrics:$("lyrics").value.trim(),
  style:$("style").value.trim(),
  language:$("language").value,
  vocal:$("vocal").value,
  bpm:Number($("bpm").value||85),
  duration:Number($("duration").value||180),
  mode:$("mode").value
 };
}
function promptFor(p){
 return `${p.style}
Language: ${p.language}
Vocal: ${p.vocal}
Tempo: ${p.bpm} BPM
Target duration: about ${Math.round(p.duration/60)} minutes
Mode: ${p.mode}

TITLE:
${p.title}

LYRICS:
${p.lyrics}`;
}
function setStatus(msg,type="ready"){
 $("status").textContent=msg;
 $("status").className="status "+type;
}
async function copyPrompt(){
 const p=payload();
 if(!p.title||!p.lyrics){setStatus("Enter a title and lyrics first.","error");return}
 await navigator.clipboard.writeText(promptFor(p));
 setStatus("Full song prompt copied to clipboard.","success");
}
$("copyBtn").onclick=copyPrompt;

async function generate(){
 const p=payload();
 if(!p.title||!p.lyrics){setStatus("Enter a title and lyrics first.","error");return}
 const endpoint=localStorage.getItem("isai_v4_endpoint")||"";
 if(!endpoint){
   setStatus("No direct API is configured. Opening hosted ACE-Step instead.","working");
   await copyPrompt();
   saveSong(p,null,"Hosted ACE-Step");
   setTimeout(()=>window.open(HOSTED,"_blank"),350);
   return;
 }
 setStatus("Submitting your song to the cloud AI...","working");
 $("generateBtn").disabled=true;
 try{
   const headers={"Content-Type":"application/json"};
   const key=localStorage.getItem("isai_v4_key");
   if(key) headers.Authorization="Bearer "+key;
   const r=await fetch(endpoint,{method:"POST",headers,body:JSON.stringify(p)});
   if(!r.ok) throw new Error("HTTP "+r.status);
   const data=await r.json();
   const audio=data.audio_url||data.url||data.audioUrl;
   if(!audio) throw new Error("The API did not return audio_url.");
   showAudio(audio);
   saveSong(p,audio,"Cloud API");
   setStatus("Song generated successfully.","success");
 }catch(e){
   setStatus("Generation failed: "+e.message,"error");
 }finally{
   $("generateBtn").disabled=false;
 }
}
function showAudio(url){
 $("resultCard").classList.remove("hidden");
 $("player").src=url;
 $("download").href=url;
}
function saveSong(p,audio,provider){
 songs.unshift({title:p.title,date:new Date().toLocaleString(),audio,provider,prompt:promptFor(p)});
 songs=songs.slice(0,30);
 localStorage.setItem(KEY,JSON.stringify(songs));
 render();
}
function render(){
 if(!songs.length){$("songs").innerHTML="<p class='note'>No songs yet.</p>";return}
 $("songs").innerHTML=songs.map((s,i)=>`<div class="song">
<strong>${esc(s.title)}</strong><small>${esc(s.date)} · ${esc(s.provider)}</small>
${s.audio?`<a href="#" onclick="playSaved(${i});return false">Play</a><a href="${escAttr(s.audio)}" download>Download</a>`:`<a href="#" onclick="navigator.clipboard.writeText(${JSON.stringify(s.prompt)});return false">Copy prompt</a>`}
</div>`).join("");
}
window.playSaved=i=>{const s=songs[i];if(s.audio){showAudio(s.audio);$("player").scrollIntoView({behavior:"smooth"});}};
function esc(x){return String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function escAttr(x){return esc(x)}
$("generateBtn").onclick=generate;
$("hostedBtn").onclick=async()=>{const p=payload();if(!p.title||!p.lyrics){setStatus("Enter a title and lyrics first.","error");return}await copyPrompt();saveSong(p,null,"Hosted ACE-Step");window.open(HOSTED,"_blank")};
$("save").onclick=()=>{localStorage.setItem("isai_v4_endpoint",$("endpoint").value.trim());localStorage.setItem("isai_v4_key",$("apiKey").value);setStatus("Cloud API settings saved on this phone.","success")};
render();
