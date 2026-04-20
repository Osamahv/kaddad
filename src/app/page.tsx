"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const db = createClient(
  "https://nanbjdtzawynwubieikr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbmJqZHR6YXd5bnd1YmllaWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MDkyNDQsImV4cCI6MjA5MTQ4NTI0NH0.15GJSu1ZYTUeCu2P8nLP83f2bcPV3t_p9NNf0RuUCN0"
);

const C:any = {
  pri:"#00C896",priD:"#00A67E",priG:"#00E5A8",priL:"#E6FAF4",
  acc:"#FF8A3D",accD:"#F97316",accL:"#FFF3EB",
  bg:"#F7FAFC",card:"#FFFFFF",txt:"#0F1E26",mut:"#718096",
  brd:"#E5EDF0",ok:"#10B981",err:"#EF4444",srf:"#F1F5F7",
  dk:"#0B1620",crm:"#FFFBF5",
  gold:"#FCD34D",silver:"#D1D5DB",bronze:"#FB923C",
  info:"#3B82F6",infoL:"#DBEAFE",warn:"#F59E0B",warnL:"#FEF3C7",
  purple:"#8B5CF6",purpleL:"#F3E8FF"
};
const FT = "'Tajawal','Segoe UI',sans-serif";
const CITIES = ["الرياض","جدة","مكة","المدينة","الدمام","الخبر","أبها","تبوك","حائل","القصيم","الطائف","جازان","نجران","الجبيل","ينبع","خميس مشيط","الأحساء","بريدة"];
const CARS = ["تويوتا","نيسان","هيونداي","كيا","فورد","شيفروليه","هوندا","جيب","مرسيدس","لكزس","أخرى"];
const AGES = Array.from({length:53},(_:any,i:number)=>String(i+18));
const SIZES = ["صغير 📱","متوسط 🎒","كبير 🪑","كبير جداً 🛋️"];
const HOURS = ["6:00 ص","7:00 ص","8:00 ص","9:00 ص","10:00 ص","11:00 ص","12:00 م","1:00 م","2:00 م","3:00 م","4:00 م","5:00 م","6:00 م","7:00 م","8:00 م","9:00 م","10:00 م","11:00 م"];
const REPORT_TYPES = [
  {id:"no_show",label:"لم يحضر",icon:"🚫"},
  {id:"damaged",label:"غرض مكسور/تالف",icon:"💔"},
  {id:"rude",label:"تعامل غير لائق",icon:"😠"},
  {id:"fraud",label:"احتيال/سرقة",icon:"⚠️"},
  {id:"late",label:"تأخير كبير",icon:"⏰"},
  {id:"other",label:"مشكلة أخرى",icon:"📝"}
];
const DAYS = (()=>{const d=[];const now=new Date();for(let i=0;i<14;i++){const dt=new Date(now);dt.setDate(now.getDate()+i);const day=dt.toLocaleDateString("ar-SA",{weekday:"long",month:"long",day:"numeric"});d.push({label:i===0?"اليوم":i===1?"غداً":day,value:dt.toISOString().split("T")[0]});}return d;})();

function getBadge(deliveries:number){
  if(deliveries>=50) return {emoji:"🥇",name:"ذهبي",color:"#D97706",bg:"#FEF3C7"};
  if(deliveries>=25) return {emoji:"🥈",name:"فضي",color:"#6B7280",bg:"#F3F4F6"};
  if(deliveries>=10) return {emoji:"🥉",name:"برونزي",color:"#C2410C",bg:"#FFEDD5"};
  return {emoji:"⭐",name:"جديد",color:C.pri,bg:C.priL};
}

async function uploadImg(file:File, folder:string){
  const n = folder+"/"+Date.now()+"_"+Math.random().toString(36).slice(2);
  const {error} = await db.storage.from("uploads").upload(n, file);
  if(error) return null;
  const {data} = db.storage.from("uploads").getPublicUrl(n);
  return data.publicUrl;
}

async function notify(userId:string, title:string, body:string, type:string, relatedId?:string){
  if(!userId) return;
  await db.from("notifications").insert({user_id:userId, title, body, type, related_id:relatedId||null});
}

// Simple hash for password (not secure but better than plaintext for demo)
function hashPw(pw:string){
  let hash = 0;
  for(let i=0;i<pw.length;i++){
    const ch = pw.charCodeAt(i);
    hash = ((hash<<5)-hash)+ch;
    hash |= 0;
  }
  return "h_"+hash+"_"+pw.length;
}

function Av({l,s=44,bg}:any){
  const colors = ["#00C896","#FF8A3D","#8B5CF6","#3B82F6","#EC4899","#10B981"];
  const bgC = bg || colors[(l?.charCodeAt(0)||0)%colors.length];
  return <div style={{width:s,height:s,borderRadius:"50%",background:"linear-gradient(135deg,"+bgC+","+bgC+"dd)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:s*0.4,fontFamily:FT,flexShrink:0,boxShadow:"0 4px 12px "+bgC+"40"}}>{l}</div>;
}

function Badge({st}:any){
  const colors:any = {"بالطريق":C.info,"تم التسليم":C.ok,pending:C.warn,matched:C.purple,"بدأت الرحلة":"#0891B2","وصل":C.ok};
  const bgs:any = {"بالطريق":C.infoL,"تم التسليم":"#D1FAE5",pending:C.warnL,matched:C.purpleL,"بدأت الرحلة":"#CFFAFE","وصل":"#D1FAE5"};
  const icons:any = {"بالطريق":"🚗","تم التسليم":"✅",pending:"⏳",matched:"🤝","بدأت الرحلة":"🛫","وصل":"📍"};
  const labels:any = {pending:"بانتظار القبول",matched:"تم القبول"};
  return <span style={{background:bgs[st]||bgs.pending,color:colors[st]||colors.pending,padding:"5px 12px",borderRadius:20,fontSize:11,fontWeight:700,fontFamily:FT}}>{icons[st]||icons.pending} {labels[st]||st}</span>;
}

function StarRating({rating,size=12}:any){
  const r = Math.round(rating||5);
  return <span style={{fontSize:size}}>{"⭐".repeat(r)}</span>;
}

function UserBadge({deliveries}:any){
  const b = getBadge(deliveries||0);
  return <span style={{background:b.bg,color:b.color,padding:"3px 9px",borderRadius:10,fontSize:10,fontWeight:800,fontFamily:FT,display:"inline-flex",alignItems:"center",gap:3}}>{b.emoji} {b.name}</span>;
}

function Hdr({t,onBack,right,gradient}:any){
  const bg = gradient ? "linear-gradient(135deg,"+C.pri+","+C.priD+")" : "#fff";
  const color = gradient ? "#fff" : C.txt;
  return <div style={{padding:"16px 18px",background:bg,borderBottom:gradient?"none":"1px solid "+C.brd,display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:10,color}}>
    <button onClick={onBack} style={{background:gradient?"rgba(255,255,255,0.15)":C.srf,border:"none",cursor:"pointer",padding:"8px",display:"flex",borderRadius:12,color}}>
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
    </button>
    <h2 style={{margin:0,fontSize:18,fontWeight:800,fontFamily:FT,flex:1}}>{t}</h2>
    {right}
  </div>;
}

function Lbl({children,req}:any){
  return <div style={{fontSize:13,fontWeight:700,color:C.txt,marginBottom:8,marginTop:18,fontFamily:FT}}>{children}{req && <span style={{color:C.err}}> *</span>}</div>;
}

function Inp({ph,val,set,type="text",dir}:any){
  return <input placeholder={ph} value={val} onChange={(e:any)=>set(e.target.value)} type={type} dir={dir} style={{width:"100%",padding:"14px 16px",border:"2px solid "+C.brd,borderRadius:14,fontSize:15,fontFamily:FT,outline:"none",boxSizing:"border-box" as any,background:"#fff",color:C.txt,transition:"border-color .15s"}}/>;
}

function GS({opts,val,set,cols=2,ac=C.pri,acBg=C.priL}:any){
  return <div style={{display:"grid",gridTemplateColumns:"repeat("+cols+",1fr)",gap:10}}>
    {opts.map((o:string)=>
      <button key={o} onClick={()=>set(o)} style={{padding:"13px 8px",borderRadius:14,border:"2px solid "+(val===o?ac:C.brd),background:val===o?acBg:"#fff",color:val===o?ac:C.txt,fontSize:13,fontWeight:700,fontFamily:FT,cursor:"pointer",transition:"all .15s"}}>{o}</button>
    )}
  </div>;
}

function Picker({val,set,opts,ph}:any){
  const [open,setOpen] = useState(false);
  return <div>
    <div onClick={()=>setOpen(true)} style={{width:"100%",padding:"14px 16px",border:"2px solid "+C.brd,borderRadius:14,fontSize:15,fontFamily:FT,boxSizing:"border-box" as any,background:"#fff",color:val?C.txt:C.mut,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span>{(()=>{const found=opts.find((o:any)=>(typeof o==="object"?o.value:o)===val);return found?(typeof found==="object"?found.label:found):ph})()}</span>
      <svg width="16" height="16" fill="none" stroke={C.mut} strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
    </div>
    {open && <div onClick={()=>setOpen(false)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"flex-end",justifyContent:"center",backdropFilter:"blur(4px)"}}>
      <div onClick={(e:any)=>e.stopPropagation()} style={{background:"#fff",borderRadius:"28px 28px 0 0",width:"100%",maxWidth:430,maxHeight:"70vh",display:"flex",flexDirection:"column" as any}}>
        <div style={{width:40,height:4,background:C.brd,borderRadius:3,margin:"12px auto 4px"}}/>
        <div style={{padding:"12px 20px 16px",borderBottom:"1px solid "+C.brd,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:17,fontWeight:800,fontFamily:FT}}>{ph}</span>
          <button onClick={()=>setOpen(false)} style={{background:C.srf,border:"none",borderRadius:10,padding:"6px 14px",fontSize:13,fontWeight:700,fontFamily:FT,cursor:"pointer",color:C.mut}}>إغلاق</button>
        </div>
        <div style={{overflow:"auto",flex:1}}>
          {opts.map((o:any)=>{
            const label = typeof o==="object" ? o.label : o;
            const value = typeof o==="object" ? o.value : o;
            return <div key={value} onClick={()=>{set(value);setOpen(false)}} style={{padding:"15px 20px",fontSize:15,fontFamily:FT,color:val===value?C.pri:C.txt,background:val===value?C.priL:"transparent",borderBottom:"1px solid "+C.brd,cursor:"pointer",fontWeight:val===value?800:500,display:"flex",justifyContent:"space-between"}}>
              <span>{label}</span>{val===value && <span style={{color:C.pri,fontSize:18}}>✓</span>}
            </div>;
          })}
        </div>
      </div>
    </div>}
  </div>;
}

function FUp({label,preview,onFile,icon="📷"}:any){
  const ref = useRef<any>(null);
  return <div>
    <input ref={ref} type="file" accept="image/*" onChange={(e:any)=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=(ev:any)=>onFile(ev.target.result,f);r.readAsDataURL(f)}}} style={{display:"none"}}/>
    <div onClick={()=>ref.current?.click()} style={{border:"2px dashed "+(preview?C.pri:C.brd),borderRadius:18,padding:preview?0:32,cursor:"pointer",textAlign:"center" as any,overflow:"hidden",background:preview?"#000":C.srf,minHeight:120,display:"flex",alignItems:"center",justifyContent:"center"}}>
      {preview ? <img src={preview} alt="" style={{width:"100%",maxHeight:180,objectFit:"cover" as any,borderRadius:16}}/> : <div><div style={{fontSize:32,marginBottom:8}}>{icon}</div><div style={{fontSize:13,color:C.mut,fontWeight:600}}>{label}</div></div>}
    </div>
  </div>;
}

function Btn({children,onClick,ok=true,loading=false,bg}:any){
  const background = bg || "linear-gradient(135deg,"+C.pri+","+C.priD+")";
  return <button onClick={ok&&!loading?onClick:undefined} disabled={!ok||loading} style={{width:"100%",padding:18,background:ok&&!loading?background:"#D4D9DE",color:"#fff",border:"none",borderRadius:18,fontSize:16,fontWeight:800,fontFamily:FT,cursor:ok?"pointer":"default",marginTop:28,boxShadow:ok?"0 8px 24px "+C.pri+"40":"none",transition:"all .15s"}}>
    {loading?"جاري...":children}
  </button>;
}

function Card({children,onClick,style}:any){
  return <div onClick={onClick} style={{background:C.card,borderRadius:20,padding:16,border:"1px solid "+C.brd,cursor:onClick?"pointer":"default",boxShadow:"0 2px 8px rgba(0,0,0,0.04)",...style}}>{children}</div>;
}

function EmptyState({icon="📭",text}:any){
  return <div style={{padding:"40px 20px",textAlign:"center" as any,color:C.mut,background:C.srf,borderRadius:20,border:"2px dashed "+C.brd}}>
    <div style={{fontSize:44,marginBottom:8,opacity:0.6}}>{icon}</div>
    <div style={{fontSize:14,fontWeight:600}}>{text}</div>
  </div>;
}

function Landing({onReg,onLogin}:any){
  return <div style={{fontFamily:FT,direction:"rtl" as any,height:"100vh",overflow:"auto",background:C.crm}}>
    <nav style={{padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255,251,245,0.95)",backdropFilter:"blur(10px)",position:"sticky" as any,top:0,zIndex:100}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:42,height:42,borderRadius:14,background:"linear-gradient(135deg,"+C.pri+","+C.priG+")",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:20,boxShadow:"0 6px 16px "+C.pri+"50"}}>ك</div>
        <span style={{fontSize:24,fontWeight:900,color:C.dk}}>كدّاد</span>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={onLogin} style={{padding:"11px 20px",background:"transparent",color:C.dk,border:"2px solid "+C.brd,borderRadius:14,fontSize:14,fontWeight:800,fontFamily:FT,cursor:"pointer"}}>دخول</button>
        <button onClick={onReg} style={{padding:"11px 20px",background:C.dk,color:"#fff",border:"none",borderRadius:14,fontSize:14,fontWeight:800,fontFamily:FT,cursor:"pointer"}}>تسجيل</button>
      </div>
    </nav>
    <div style={{padding:"48px 24px 56px",textAlign:"center" as any}}>
      <div style={{fontSize:76,marginBottom:24}}>🚗💨📦</div>
      <h1 style={{fontSize:36,fontWeight:900,color:C.dk,lineHeight:1.35,marginBottom:18}}>كل رحلة بين المدن<br/><span style={{background:"linear-gradient(135deg,"+C.pri+","+C.priG+")",WebkitBackgroundClip:"text" as any,WebkitTextFillColor:"transparent" as any}}>فرصة توصيل</span></h1>
      <p style={{fontSize:16,color:C.mut,maxWidth:340,margin:"0 auto 36px",lineHeight:1.7,fontWeight:500}}>أرسل أغراضك مع مسافر — أسرع وأرخص وأكثر أماناً</p>
      <button onClick={onReg} style={{padding:"18px 44px",background:"linear-gradient(135deg,"+C.pri+","+C.priG+")",color:"#fff",border:"none",borderRadius:18,fontSize:17,fontWeight:900,fontFamily:FT,cursor:"pointer",boxShadow:"0 12px 32px "+C.pri+"50"}}>ابدأ الحين 🚀</button>
    </div>
    <div style={{padding:"48px 24px",background:"#fff"}}>
      <h2 style={{fontSize:28,fontWeight:900,color:C.dk,textAlign:"center" as any,marginBottom:32}}>ليش كدّاد؟</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[["⚡","توصيل سريع",C.acc],["💰","أسعار مناسبة",C.pri],["📦","أي حجم",C.info],["🛡️","أمان وثقة",C.purple]].map(([ic,t,col]:any,i:number)=>
          <div key={i} style={{background:C.crm,borderRadius:22,padding:"24px 18px",textAlign:"center" as any,border:"1px solid "+C.brd}}>
            <div style={{fontSize:36,marginBottom:10}}>{ic}</div>
            <div style={{fontSize:15,fontWeight:800,color:C.dk}}>{t}</div>
          </div>
        )}
      </div>
    </div>
    <div style={{padding:"52px 24px 60px",background:"linear-gradient(135deg,"+C.dk+","+C.priD+")",textAlign:"center" as any}}>
      <h2 style={{fontSize:30,fontWeight:900,color:"#fff",marginBottom:16}}>جاهز تبدأ؟</h2>
      <p style={{fontSize:15,color:"rgba(255,255,255,0.7)",marginBottom:28}}>انضم الحين وابدأ الاستفادة</p>
      <button onClick={onReg} style={{padding:"18px 52px",background:"linear-gradient(135deg,"+C.pri+","+C.priG+")",color:"#fff",border:"none",borderRadius:18,fontSize:17,fontWeight:900,fontFamily:FT,cursor:"pointer"}}>سجّل الحين</button>
    </div>
  </div>;
}

function RoleSelect({onPick,onBack}:any){
  return <div style={{minHeight:"100vh",background:"linear-gradient(165deg,"+C.dk+","+C.priD+")",display:"flex",flexDirection:"column" as any,alignItems:"center",justifyContent:"center",padding:24,fontFamily:FT,direction:"rtl" as any}}>
    <div style={{textAlign:"center" as any,marginBottom:40}}>
      <div style={{fontSize:52,marginBottom:12}}>🚗📦</div>
      <h1 style={{color:"#fff",fontSize:28,fontWeight:900,margin:0}}>كيف تبغى تستخدم كدّاد؟</h1>
    </div>
    <div style={{display:"flex",flexDirection:"column" as any,gap:16,width:"100%",maxWidth:400}}>
      {[["sender","📦","أبغى أرسل غرض","أنشئ طلباتك وابعثها"],["driver","🚗","أبغى أكون كدّاد","اكسب من رحلاتك"]].map(([id,em,t,sub]:any)=>
        <button key={id} onClick={()=>onPick(id)} style={{display:"flex",alignItems:"center",gap:18,padding:"24px 22px",background:"rgba(255,255,255,0.08)",border:"2px solid rgba(255,255,255,0.12)",borderRadius:22,cursor:"pointer",textAlign:"right" as any,backdropFilter:"blur(10px)"}}>
          <div style={{fontSize:46}}>{em}</div>
          <div>
            <div style={{fontSize:18,fontWeight:900,color:"#fff",fontFamily:FT}}>{t}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:3,fontWeight:500}}>{sub}</div>
          </div>
        </button>
      )}
    </div>
    <button onClick={onBack} style={{marginTop:24,background:"none",border:"none",color:"rgba(255,255,255,0.5)",fontSize:14,fontFamily:FT,cursor:"pointer",fontWeight:600}}>← رجوع</button>
  </div>;
}

function Register({role,onDone,onBack}:any){
  const [nm,setNm]=useState("");const[ph,setPh]=useState("");const[em,setEm]=useState("");const[ag,setAg]=useState("");const[ct,setCt]=useState("");
  const [pw,setPw]=useState("");const[pw2,setPw2]=useState("");
  const [cm,setCm]=useState("");const[cmo,setCmo]=useState("");const[cp,setCp]=useState("");
  const [ip,setIp]=useState<any>(null);const[ifl,setIfl]=useState<any>(null);
  const [rp,setRp]=useState<any>(null);const[rfl,setRfl]=useState<any>(null);
  const [stp,setStp]=useState(1);const[ld,setLd]=useState(false);const[er,setEr]=useState("");
  const isD = role==="driver";
  const ok1 = nm.trim()&&ph.length>=9&&em.includes("@")&&ag&&ct&&pw.length>=4&&pw===pw2;
  const ok2 = ok1&&cm&&cmo&&cp&&ip&&rp;

  const go = async () => {
    setLd(true);setEr("");
    let iu=null,ru=null;
    if(ifl) iu=await uploadImg(ifl,"id-photos");
    if(rfl) ru=await uploadImg(rfl,"car-docs");
    const {data,error} = await db.from("profiles").insert({
      name:nm,phone:ph,email:em,age:ag,city:ct,role,password:hashPw(pw),
      car_make:cm||null,car_model:cmo||null,car_plate:cp||null,
      id_photo:iu,reg_photo:ru
    }).select().single();
    if(error){setEr(error.message.includes("duplicate")?"رقم الجوال مسجّل مسبقاً!":"خطأ: "+error.message);}
    else{onDone(data);}
    setLd(false);
  };

  if(stp===1) return <div style={{minHeight:"100vh",background:C.bg,fontFamily:FT,direction:"rtl" as any}}>
    <div style={{padding:"24px 20px 36px",background:"linear-gradient(135deg,"+(isD?C.acc:C.pri)+","+(isD?C.accD:C.priG)+")",color:"#fff"}}>
      <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",fontSize:14,fontFamily:FT,cursor:"pointer",marginBottom:16,padding:"8px 14px",borderRadius:12,fontWeight:700}}>← رجوع</button>
      <div style={{fontSize:40,marginBottom:8}}>{isD?"🚗":"📦"}</div>
      <h1 style={{fontSize:24,fontWeight:900,margin:0}}>تسجيل {isD?"كدّاد":"مرسل"}</h1>
      <p style={{fontSize:13,margin:"6px 0 0",opacity:0.9,fontWeight:500}}>أدخل بياناتك للبدء</p>
    </div>
    <div style={{padding:"0 20px 40px",marginTop:-12,background:C.bg,borderRadius:"24px 24px 0 0"}}>
      {er && <div style={{background:"#FEF2F2",color:C.err,padding:14,borderRadius:14,marginTop:16,fontSize:13,fontWeight:700,border:"1px solid "+C.err+"20"}}>⚠️ {er}</div>}
      <Lbl req>الاسم الكامل</Lbl><Inp ph="محمد أحمد" val={nm} set={setNm}/>
      <Lbl req>رقم الجوال</Lbl><Inp ph="05XXXXXXXX" val={ph} set={(v:string)=>setPh(v.replace(/\D/g,"").slice(0,10))} type="tel" dir="ltr"/>
      <Lbl req>الإيميل</Lbl><Inp ph="example@email.com" val={em} set={setEm} type="email" dir="ltr"/>
      <Lbl req>كلمة السر (٤ أحرف على الأقل)</Lbl><Inp ph="••••••" val={pw} set={setPw} type="password"/>
      <Lbl req>تأكيد كلمة السر</Lbl><Inp ph="••••••" val={pw2} set={setPw2} type="password"/>
      {pw && pw2 && pw!==pw2 && <div style={{fontSize:12,color:C.err,marginTop:4,fontWeight:600}}>كلمة السر غير متطابقة</div>}
      <Lbl req>العمر</Lbl><Picker val={ag} set={setAg} opts={AGES} ph="اختر عمرك"/>
      <Lbl req>المدينة</Lbl><Picker val={ct} set={setCt} opts={CITIES} ph="اختر مدينتك"/>
      <Btn onClick={()=>isD?setStp(2):go()} ok={ok1} loading={ld} bg={"linear-gradient(135deg,"+(isD?C.acc:C.pri)+","+(isD?C.accD:C.priG)+")"}>{isD?"التالي →":"إنشاء الحساب ✨"}</Btn>
    </div>
  </div>;

  return <div style={{minHeight:"100vh",background:C.bg,fontFamily:FT,direction:"rtl" as any}}>
    <div style={{padding:"24px 20px 36px",background:"linear-gradient(135deg,"+C.acc+","+C.accD+")",color:"#fff"}}>
      <button onClick={()=>setStp(1)} style={{background:"rgba(255,255,255,0.2)",border:"none",color:"#fff",fontSize:14,fontFamily:FT,cursor:"pointer",marginBottom:16,padding:"8px 14px",borderRadius:12,fontWeight:700}}>← رجوع</button>
      <div style={{fontSize:40,marginBottom:8}}>🚗</div>
      <h1 style={{fontSize:24,fontWeight:900,margin:0}}>بيانات السيارة</h1>
      <p style={{fontSize:13,margin:"6px 0 0",opacity:0.9,fontWeight:500}}>الخطوة الأخيرة</p>
    </div>
    <div style={{padding:"0 20px 40px",marginTop:-12,background:C.bg,borderRadius:"24px 24px 0 0"}}>
      {er && <div style={{background:"#FEF2F2",color:C.err,padding:14,borderRadius:14,marginTop:16,fontSize:13,fontWeight:700}}>⚠️ {er}</div>}
      <Lbl req>شركة السيارة</Lbl><Picker val={cm} set={setCm} opts={CARS} ph="اختر الشركة"/>
      <Lbl req>الموديل</Lbl><Inp ph="كامري، هايلكس..." val={cmo} set={setCmo}/>
      <Lbl req>رقم اللوحة</Lbl><Inp ph="أ ب ج ١٢٣٤" val={cp} set={setCp}/>
      <Lbl req>صورة الهوية</Lbl><FUp label="اضغط لرفع الصورة" preview={ip} onFile={(p:any,f:any)=>{setIp(p);setIfl(f)}} icon="🪪"/>
      <Lbl req>صورة الاستمارة</Lbl><FUp label="اضغط لرفع الصورة" preview={rp} onFile={(p:any,f:any)=>{setRp(p);setRfl(f)}} icon="📄"/>
      <Btn onClick={go} ok={ok2} loading={ld} bg={"linear-gradient(135deg,"+C.acc+","+C.accD+")"}>إنشاء الحساب 🚀</Btn>
    </div>
  </div>;
}

function Login({onDone,onBack}:any){
  const [ph,setPh]=useState("");const[pw,setPw]=useState("");const[ld,setLd]=useState(false);const[er,setEr]=useState("");
  const go = async () => {
    setLd(true);setEr("");
    const {data,error} = await db.from("profiles").select("*").eq("phone",ph).maybeSingle();
    if(error||!data){setEr("رقم غير مسجّل!");setLd(false);return;}
    if(data.is_blocked){setEr("حسابك محظور — تواصل مع الإدارة");setLd(false);return;}
    if(data.password && data.password!==hashPw(pw)){setEr("كلمة السر خاطئة!");setLd(false);return;}
    onDone(data);
    setLd(false);
  };
  return <div style={{minHeight:"100vh",background:"linear-gradient(165deg,"+C.dk+","+C.priD+")",display:"flex",flexDirection:"column" as any,alignItems:"center",justifyContent:"center",padding:24,fontFamily:FT,direction:"rtl" as any}}>
    <div style={{textAlign:"center" as any,marginBottom:36}}>
      <div style={{fontSize:56,marginBottom:10}}>🔐</div>
      <h1 style={{color:"#fff",fontSize:30,fontWeight:900,margin:0}}>تسجيل الدخول</h1>
      <p style={{color:"rgba(255,255,255,0.7)",fontSize:14,marginTop:8}}>أهلاً بعودتك</p>
    </div>
    <div style={{background:"#fff",borderRadius:28,padding:"32px 28px",width:"100%",maxWidth:400,boxShadow:"0 20px 60px rgba(0,0,0,0.3)"}}>
      {er && <div style={{background:"#FEF2F2",color:C.err,padding:14,borderRadius:14,marginBottom:16,fontSize:13,fontWeight:700}}>⚠️ {er}</div>}
      <Lbl req>رقم الجوال</Lbl>
      <Inp ph="05XXXXXXXX" val={ph} set={(v:string)=>setPh(v.replace(/\D/g,"").slice(0,10))} type="tel" dir="ltr"/>
      <Lbl req>كلمة السر</Lbl>
      <Inp ph="••••••" val={pw} set={setPw} type="password"/>
      <Btn onClick={go} ok={ph.length>=9&&pw.length>=4} loading={ld}>دخول</Btn>
      <button onClick={onBack} style={{width:"100%",marginTop:14,padding:12,background:"none",border:"none",color:C.mut,fontSize:14,fontFamily:FT,cursor:"pointer",fontWeight:600}}>← رجوع</button>
    </div>
  </div>;
}

function NotificationsScreen({user,onBack,onOpen}:any){
  const [notifs,setNotifs] = useState<any[]>([]);
  const [loading,setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const {data} = await db.from("notifications").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).limit(50);
    if(data) setNotifs(data);
    setLoading(false);
    await db.from("notifications").update({is_read:true}).eq("user_id",user.id).eq("is_read",false);
  };
  useEffect(()=>{load();},[user.id]);
  const timeAgo = (date:string) => {
    const d = new Date(date);const now = new Date();
    const mins = Math.floor((now.getTime()-d.getTime())/60000);
    if(mins<1) return "الآن";
    if(mins<60) return "منذ "+mins+" د";
    const hrs = Math.floor(mins/60);
    if(hrs<24) return "منذ "+hrs+" س";
    return "منذ "+Math.floor(hrs/24)+" ي";
  };
  const icons:any = {new_order:"📦",order_matched:"🤝",order_started:"🛫",order_arrived:"📍",order_delivered:"✅",new_rating:"⭐",new_message:"💬",new_report:"⚠️"};
  return <div style={{fontFamily:FT,direction:"rtl" as any,background:C.bg,minHeight:"100vh"}}>
    <Hdr t="🔔 الإشعارات" onBack={onBack} gradient/>
    <div style={{padding:"16px 16px 100px"}}>
      {loading && <EmptyState icon="⏳" text="جاري التحميل..."/>}
      {!loading && notifs.length===0 && <EmptyState icon="📭" text="لا توجد إشعارات"/>}
      {notifs.map((n:any)=>
        <div key={n.id} onClick={()=>n.related_id&&onOpen&&onOpen(n)} style={{background:n.is_read?"#fff":"linear-gradient(135deg,"+C.priL+","+C.priL+"80)",borderRadius:16,padding:14,marginBottom:10,border:"1px solid "+(n.is_read?C.brd:C.pri+"30"),display:"flex",gap:12,cursor:n.related_id?"pointer":"default",boxShadow:n.is_read?"none":"0 4px 12px "+C.pri+"15"}}>
          <div style={{fontSize:30,flexShrink:0,width:48,height:48,borderRadius:"50%",background:C.srf,display:"flex",alignItems:"center",justifyContent:"center"}}>{icons[n.type]||"🔔"}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:800,color:C.txt}}>{n.title}</div>
            {n.body && <div style={{fontSize:13,color:C.mut,marginTop:3,lineHeight:1.5}}>{n.body}</div>}
            <div style={{fontSize:11,color:C.mut,marginTop:5,fontWeight:600}}>{timeAgo(n.created_at)}</div>
          </div>
          {!n.is_read && <div style={{width:10,height:10,borderRadius:"50%",background:C.pri,flexShrink:0,marginTop:4}}/>}
        </div>
      )}
    </div>
  </div>;
}

function SenderHome({nav,user,unreadCount}:any){
  const [orders,setOrders] = useState<any[]>([]);
  const [trips,setTrips] = useState<any[]>([]);
  const [filterCity,setFilterCity] = useState("");
  const [loading,setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const {data: ordersData} = await db.from("orders").select("*").eq("sender_id",user.id).order("created_at",{ascending:false}).limit(5);
    if(ordersData) setOrders(ordersData);
    const today = new Date().toISOString().split("T")[0];
    const future = new Date();future.setDate(future.getDate()+5);
    const futureStr = future.toISOString().split("T")[0];
    let q = db.from("trips").select("*,profiles(name,rating,car_make,car_model,city,total_deliveries)").is("matched_sender_id",null).eq("status","active").gte("trip_date",today).lte("trip_date",futureStr).order("trip_date",{ascending:true}).limit(50);
    if(filterCity) q = q.eq("city_from",filterCity);
    const {data: tripsData} = await q;
    if(tripsData) setTrips(tripsData);
    setLoading(false);
  };

  useEffect(()=>{loadData();const interval=setInterval(loadData,5000);return()=>clearInterval(interval);},[user.id, filterCity]);

  const pickTrip = async (trip:any) => {
    const {error} = await db.from("trips").update({matched_sender_id:user.id,status:"matched"}).eq("id",trip.id);
    if(!error){
      await notify(trip.driver_id,"تم اختيارك ككدّاد! 🎉",user.name+" اختارك للرحلة من "+trip.city_from+" إلى "+trip.city_to,"order_matched",trip.id);
      setTrips(trips.filter((t:any)=>t.id!==trip.id));
      alert("تم اختيار الكدّاد بنجاح! ✅");
    } else alert("خطأ: "+error.message);
  };

  return <div style={{padding:"20px 16px 100px",fontFamily:FT,direction:"rtl" as any,background:C.bg,minHeight:"100vh"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
      <div>
        <h2 style={{margin:0,fontSize:23,fontWeight:900,color:C.txt}}>أهلاً {user.name?.split(" ")[0]} 👋</h2>
        <p style={{margin:"4px 0 0",fontSize:14,color:C.mut,fontWeight:500}}>وش تبغى توصّل اليوم؟</p>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>nav("notifications")} style={{position:"relative",background:"#fff",border:"1px solid "+C.brd,borderRadius:14,width:44,height:44,cursor:"pointer",fontSize:20,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
          🔔{unreadCount>0 && <span style={{position:"absolute",top:-5,right:-5,background:C.err,color:"#fff",borderRadius:10,fontSize:10,padding:"2px 6px",fontWeight:800,minWidth:18}}>{unreadCount}</span>}
        </button>
        <Av l={user.name?.[0]||"?"} s={44}/>
      </div>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:26}}>
      <button onClick={()=>nav("newOrder")} style={{background:"linear-gradient(135deg,"+C.pri+","+C.priD+")",border:"none",borderRadius:20,padding:"22px 16px",cursor:"pointer",textAlign:"right" as any,boxShadow:"0 10px 30px "+C.pri+"40"}}>
        <div style={{fontSize:32,marginBottom:8}}>📦</div>
        <div style={{color:"#fff",fontSize:15,fontWeight:900,fontFamily:FT}}>أرسل غرض</div>
        <div style={{color:"rgba(255,255,255,0.75)",fontSize:11,marginTop:3,fontWeight:600}}>توصيل عادي</div>
      </button>
      <button onClick={()=>nav("newShopping")} style={{background:"linear-gradient(135deg,"+C.purple+","+C.purple+"cc)",border:"none",borderRadius:20,padding:"22px 16px",cursor:"pointer",textAlign:"right" as any,boxShadow:"0 10px 30px "+C.purple+"40"}}>
        <div style={{fontSize:32,marginBottom:8}}>🛒</div>
        <div style={{color:"#fff",fontSize:15,fontWeight:900,fontFamily:FT}}>طلب تسوّق</div>
        <div style={{color:"rgba(255,255,255,0.75)",fontSize:11,marginTop:3,fontWeight:600}}>من متجر معين</div>
      </button>
    </div>

    <h3 style={{margin:"0 0 14px",fontSize:16,fontWeight:800,color:C.txt}}>طلباتك الأخيرة</h3>
    {orders.length===0 && <EmptyState icon="📦" text="لا توجد طلبات بعد"/>}
    {orders.map((o:any)=>
      <Card key={o.id} onClick={()=>nav("detail",o)} style={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:15,fontWeight:800,color:C.txt,display:"flex",alignItems:"center",gap:6}}>
              {o.is_shopping?"🛒":"📦"} {o.item_name}
            </div>
            <div style={{fontSize:12,color:C.mut,marginTop:4,fontWeight:600}}>{o.city_from} ← {o.city_to}</div>
          </div>
          <Badge st={o.status}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:"1px solid "+C.brd}}>
          <span style={{fontSize:12,color:C.mut,fontWeight:600}}>{o.delivery_date||""}</span>
          <span style={{fontSize:15,fontWeight:900,color:C.pri}}>{o.price||"—"} ر.س</span>
        </div>
      </Card>
    )}

    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"28px 0 14px"}}>
      <h3 style={{margin:0,fontSize:16,fontWeight:800}}>🚗 الكدّادين المتاحين {trips.length>0 && <span style={{fontSize:13,color:C.pri,fontWeight:800}}>({trips.length})</span>}</h3>
      <button onClick={loadData} style={{background:C.priL,border:"none",borderRadius:12,padding:"8px 14px",fontSize:12,fontWeight:800,color:C.pri,fontFamily:FT,cursor:"pointer"}}>🔄 تحديث</button>
    </div>

    <div style={{marginBottom:16,background:"#fff",borderRadius:16,padding:"12px 14px",border:"1px solid "+C.brd}}>
      <div style={{fontSize:12,color:C.mut,marginBottom:10,fontWeight:700}}>📍 فلتر بمدينة الانطلاق:</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap" as any}}>
        <button onClick={()=>setFilterCity("")} style={{padding:"7px 14px",borderRadius:20,border:"2px solid "+(filterCity===""?C.pri:C.brd),background:filterCity===""?C.priL:"#fff",color:filterCity===""?C.pri:C.mut,fontSize:12,fontWeight:800,fontFamily:FT,cursor:"pointer"}}>🌍 الكل</button>
        {[user.city,...CITIES.filter((c:string)=>c!==user.city)].slice(0,6).map((city:string)=>
          <button key={city} onClick={()=>setFilterCity(city)} style={{padding:"7px 14px",borderRadius:20,border:"2px solid "+(filterCity===city?C.pri:C.brd),background:filterCity===city?C.priL:"#fff",color:filterCity===city?C.pri:C.mut,fontSize:12,fontWeight:800,fontFamily:FT,cursor:"pointer"}}>{city}</button>
        )}
      </div>
    </div>

    {loading && trips.length===0 && <EmptyState icon="⏳" text="جاري التحميل..."/>}
    {!loading && trips.length===0 && <EmptyState icon="🚗" text={"لا يوجد كدّادين متاحين "+(filterCity?"من "+filterCity:"")+" حالياً"}/>}
    {trips.map((t:any)=>{
      const dayLabel = t.trip_date===new Date().toISOString().split("T")[0] ? "اليوم" : t.trip_date;
      return <Card key={t.id} style={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,gap:10}}>
          <div style={{display:"flex",gap:12,flex:1,minWidth:0}}>
            <Av l={t.profiles?.name?.[0]||"ك"} s={40}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:15,fontWeight:800,color:C.txt}}>{t.profiles?.name||"كدّاد"}</div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3,flexWrap:"wrap" as any}}>
                <StarRating rating={t.profiles?.rating||5} size={11}/>
                <UserBadge deliveries={t.profiles?.total_deliveries}/>
              </div>
            </div>
          </div>
          <div style={{textAlign:"center" as any,background:"linear-gradient(135deg,"+C.priL+","+C.priL+"80)",borderRadius:14,padding:"8px 12px",flexShrink:0}}>
            <div style={{fontSize:18,fontWeight:900,color:C.pri,lineHeight:1}}>{t.min_price||50}</div>
            <div style={{fontSize:9,color:C.priD,fontWeight:700,marginTop:2}}>ر.س أدنى</div>
          </div>
        </div>
        <div style={{background:C.srf,borderRadius:14,padding:"10px 12px",marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:800,color:C.txt}}>{t.city_from} ← {t.city_to}</div>
          <div style={{fontSize:11,color:C.mut,marginTop:4,fontWeight:600}}>{t.profiles?.car_make} {t.profiles?.car_model} · {t.available_space}</div>
          <div style={{fontSize:11,color:C.pri,marginTop:4,fontWeight:800}}>📅 {dayLabel} {t.trip_time?"⏰ "+t.trip_time:""}</div>
        </div>
        <button onClick={()=>pickTrip(t)} style={{width:"100%",padding:13,background:"linear-gradient(135deg,"+C.pri+","+C.priD+")",color:"#fff",border:"none",borderRadius:14,fontSize:14,fontWeight:800,fontFamily:FT,cursor:"pointer",boxShadow:"0 6px 18px "+C.pri+"40"}}>اختر هالكدّاد ✅</button>
      </Card>;
    })}
  </div>;
}

function DriverHome({nav,user,unreadCount}:any){
  const [trips,setTrips] = useState<any[]>([]);
  const [orders,setOrders] = useState<any[]>([]);
  const [filterCity,setFilterCity] = useState("");
  const [loading,setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const {data: tripsData} = await db.from("trips").select("*").eq("driver_id",user.id).order("created_at",{ascending:false}).limit(5);
    if(tripsData) setTrips(tripsData);
    const today = new Date().toISOString().split("T")[0];
    const future = new Date();future.setDate(future.getDate()+5);
    const futureStr = future.toISOString().split("T")[0];
    let q = db.from("orders").select("*,profiles!orders_sender_id_fkey(name,city)").is("matched_driver_id",null).eq("status","pending").gte("delivery_date",today).lte("delivery_date",futureStr).order("delivery_date",{ascending:true}).limit(50);
    if(filterCity) q = q.eq("city_from",filterCity);
    const {data: ordersData} = await q;
    if(ordersData) setOrders(ordersData);
    setLoading(false);
  };

  useEffect(()=>{loadData();const interval=setInterval(loadData,5000);return()=>clearInterval(interval);},[user.id, filterCity]);

  const pickOrder = async (order:any) => {
    const {error} = await db.from("orders").update({matched_driver_id:user.id,driver_id:user.id,status:"matched"}).eq("id",order.id);
    if(!error){
      await notify(order.sender_id,"تم قبول طلبك! 🎉",user.name+" قبل توصيل "+order.item_name,"order_matched",order.id);
      setOrders(orders.filter((o:any)=>o.id!==order.id));
      alert("تم قبول الطلب! ✅");
    } else alert("خطأ: "+error.message);
  };

  return <div style={{padding:"20px 16px 100px",fontFamily:FT,direction:"rtl" as any,background:C.bg,minHeight:"100vh"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
      <div>
        <h2 style={{margin:0,fontSize:23,fontWeight:900,color:C.txt}}>أهلاً {user.name?.split(" ")[0]} 👋</h2>
        <p style={{margin:"4px 0 0",fontSize:14,color:C.mut,fontWeight:500}}>جاهز تكسب اليوم؟</p>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>nav("notifications")} style={{position:"relative",background:"#fff",border:"1px solid "+C.brd,borderRadius:14,width:44,height:44,cursor:"pointer",fontSize:20,boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
          🔔{unreadCount>0 && <span style={{position:"absolute",top:-5,right:-5,background:C.err,color:"#fff",borderRadius:10,fontSize:10,padding:"2px 6px",fontWeight:800}}>{unreadCount}</span>}
        </button>
        <Av l={user.name?.[0]||"?"} s={44} bg={C.acc}/>
      </div>
    </div>

    <button onClick={()=>nav("newTrip")} style={{width:"100%",background:"linear-gradient(135deg,"+C.acc+","+C.accD+")",border:"none",borderRadius:22,padding:"26px 22px",cursor:"pointer",textAlign:"right" as any,marginBottom:26,display:"flex",alignItems:"center",gap:16,boxShadow:"0 10px 30px "+C.acc+"40"}}>
      <div style={{fontSize:42}}>🚗</div>
      <div style={{flex:1}}>
        <div style={{color:"#fff",fontSize:18,fontWeight:900,fontFamily:FT}}>أضف رحلة جديدة</div>
        <div style={{color:"rgba(255,255,255,0.75)",fontSize:12,fontFamily:FT,marginTop:3,fontWeight:600}}>أعلن عن رحلتك واستقبل طلبات</div>
      </div>
      <div style={{fontSize:24,color:"rgba(255,255,255,0.5)"}}>←</div>
    </button>

    <h3 style={{margin:"0 0 14px",fontSize:16,fontWeight:800}}>رحلاتك الأخيرة</h3>
    {trips.length===0 && <EmptyState icon="🛣️" text="لا توجد رحلات بعد"/>}
    {trips.map((t:any)=>
      <Card key={t.id} style={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:15,fontWeight:800}}>{t.city_from} ← {t.city_to}</div>
            <div style={{fontSize:12,color:C.mut,marginTop:4,fontWeight:600}}>📅 {t.trip_date||""} {t.trip_time?"⏰ "+t.trip_time:""} · {t.available_space}</div>
            <div style={{fontSize:12,color:C.acc,marginTop:3,fontWeight:800}}>الحد الأدنى: {t.min_price||50} ر.س</div>
          </div>
          <Badge st={t.status}/>
        </div>
      </Card>
    )}

    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"28px 0 14px"}}>
      <h3 style={{margin:0,fontSize:16,fontWeight:800}}>📦 طلبات تنتظرك {orders.length>0 && <span style={{fontSize:13,color:C.acc,fontWeight:800}}>({orders.length})</span>}</h3>
      <button onClick={loadData} style={{background:C.accL,border:"none",borderRadius:12,padding:"8px 14px",fontSize:12,fontWeight:800,color:C.acc,fontFamily:FT,cursor:"pointer"}}>🔄 تحديث</button>
    </div>

    <div style={{marginBottom:16,background:"#fff",borderRadius:16,padding:"12px 14px",border:"1px solid "+C.brd}}>
      <div style={{fontSize:12,color:C.mut,marginBottom:10,fontWeight:700}}>📍 فلتر بمدينة الانطلاق:</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap" as any}}>
        <button onClick={()=>setFilterCity("")} style={{padding:"7px 14px",borderRadius:20,border:"2px solid "+(filterCity===""?C.acc:C.brd),background:filterCity===""?C.accL:"#fff",color:filterCity===""?C.acc:C.mut,fontSize:12,fontWeight:800,fontFamily:FT,cursor:"pointer"}}>🌍 الكل</button>
        {[user.city,...CITIES.filter((c:string)=>c!==user.city)].slice(0,6).map((city:string)=>
          <button key={city} onClick={()=>setFilterCity(city)} style={{padding:"7px 14px",borderRadius:20,border:"2px solid "+(filterCity===city?C.acc:C.brd),background:filterCity===city?C.accL:"#fff",color:filterCity===city?C.acc:C.mut,fontSize:12,fontWeight:800,fontFamily:FT,cursor:"pointer"}}>{city}</button>
        )}
      </div>
    </div>

    {loading && orders.length===0 && <EmptyState icon="⏳" text="جاري التحميل..."/>}
    {!loading && orders.length===0 && <EmptyState icon="📦" text={"لا توجد طلبات "+(filterCity?"من "+filterCity:"")+" حالياً"}/>}
    {orders.map((o:any)=>{
      const dayLabel = o.delivery_date===new Date().toISOString().split("T")[0] ? "اليوم" : o.delivery_date;
      return <Card key={o.id} style={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,gap:10}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:15,fontWeight:800,display:"flex",alignItems:"center",gap:6}}>
              {o.is_shopping?"🛒":"📦"} {o.item_name}
              {o.item_size && <span style={{fontSize:11,color:C.mut,fontWeight:600}}>({o.item_size})</span>}
            </div>
            <div style={{fontSize:13,color:C.mut,marginTop:4,fontWeight:700}}>{o.city_from} ← {o.city_to}</div>
            <div style={{fontSize:11,color:C.acc,marginTop:3,fontWeight:800}}>📅 {dayLabel}</div>
            <div style={{fontSize:11,color:C.mut,marginTop:2,fontWeight:600}}>👤 {o.profiles?.name||"مرسل"}</div>
            <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap" as any}}>
              {o.is_fragile && <span style={{fontSize:10,color:"#92400E",fontWeight:800,background:"#FEF3C7",padding:"3px 8px",borderRadius:10}}>⚠️ قابل للكسر</span>}
              {o.pickup_type==="door" && <span style={{fontSize:10,color:C.acc,fontWeight:800,background:C.accL,padding:"3px 8px",borderRadius:10}}>🚪 من العنوان</span>}
              {o.is_shopping && <span style={{fontSize:10,color:C.purple,fontWeight:800,background:C.purpleL,padding:"3px 8px",borderRadius:10}}>🛒 تسوّق</span>}
            </div>
          </div>
          <div style={{textAlign:"center" as any,background:"linear-gradient(135deg,"+C.priL+","+C.priL+"80)",borderRadius:14,padding:"8px 12px",flexShrink:0}}>
            <div style={{fontSize:18,fontWeight:900,color:C.pri,lineHeight:1}}>{(o.price||0)+(o.extra_fee||0)}</div>
            <div style={{fontSize:9,color:C.priD,fontWeight:700,marginTop:2}}>ر.س</div>
          </div>
        </div>
        {o.item_image && <img src={o.item_image} alt="" style={{width:"100%",borderRadius:12,maxHeight:140,objectFit:"cover" as any,marginBottom:12}}/>}
        <button onClick={()=>pickOrder(o)} style={{width:"100%",padding:13,background:"linear-gradient(135deg,"+C.acc+","+C.accD+")",color:"#fff",border:"none",borderRadius:14,fontSize:14,fontWeight:800,fontFamily:FT,cursor:"pointer",boxShadow:"0 6px 18px "+C.acc+"40"}}>قبول الطلب 🚗</button>
      </Card>;
    })}
  </div>;
}

function NewOrder({onBack,user,onDone}:any){
  const [item,setItem]=useState("");const[size,setSize]=useState("");const[from,setFrom]=useState("");const[to,setTo]=useState("");const[price,setPrice]=useState("");const[day,setDay]=useState("");
  const [pickup,setPickup]=useState("meetup");const[address,setAddress]=useState("");
  const [frag,setFrag]=useState(false);const[agree,setAgree]=useState(false);const[img,setImg]=useState<any>(null);const[imgF,setImgF]=useState<any>(null);const[warn,setWarn]=useState(false);const[ld,setLd]=useState(false);
  const ok = item&&size&&from&&to&&day&&price&&img&&agree&&(pickup==="meetup"||address);

  const go = async () => {
    setLd(true);
    let url=null;if(imgF) url=await uploadImg(imgF,"items");
    const {error} = await db.from("orders").insert({
      sender_id:user.id,item_name:item,item_size:size,item_image:url,is_fragile:frag,
      city_from:from,city_to:to,
      delivery_type:pickup==="meetup"?"نقطة لقاء":"توصيل للباب",
      delivery_date:day,price:Number(price),pickup_type:pickup,
      pickup_address:pickup==="door"?address:null,extra_fee:pickup==="door"?30:0,
      status:"pending"
    });
    setLd(false);
    if(!error) onDone();
    else alert("خطأ: "+error.message);
  };

  if(warn) return <div style={{fontFamily:FT,direction:"rtl" as any,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,background:C.bg}}>
    <div style={{background:"#fff",borderRadius:28,padding:32,maxWidth:400,width:"100%",textAlign:"center" as any,boxShadow:"0 20px 60px rgba(0,0,0,0.15)"}}>
      <div style={{fontSize:60,marginBottom:16}}>⚠️</div>
      <h2 style={{fontSize:22,fontWeight:900,margin:"0 0 12px"}}>تأكيد الطلب</h2>
      <div style={{background:C.accL,borderRadius:16,padding:16,marginBottom:20,textAlign:"right" as any}}>
        <ul style={{margin:0,paddingRight:20,fontSize:13,color:"#92400E",lineHeight:2,fontWeight:600}}>
          <li>التغليف مسؤولية المرسل</li>
          {frag && <li>⚠️ قابل للكسر — تأكد من التغليف</li>}
          {pickup==="door" && <li>رسوم إضافية +30 ر.س للتوصيل للباب</li>}
        </ul>
      </div>
      <div style={{display:"flex",gap:12}}>
        <button onClick={()=>setWarn(false)} style={{flex:1,padding:14,background:"none",border:"2px solid "+C.brd,borderRadius:14,fontSize:14,fontWeight:800,fontFamily:FT,cursor:"pointer",color:C.mut}}>رجوع</button>
        <button onClick={go} disabled={ld} style={{flex:1,padding:14,background:"linear-gradient(135deg,"+C.pri+","+C.priD+")",color:"#fff",border:"none",borderRadius:14,fontSize:14,fontWeight:800,fontFamily:FT,cursor:"pointer"}}>{ld?"جاري...":"تأكيد ✅"}</button>
      </div>
    </div>
  </div>;

  return <div style={{fontFamily:FT,direction:"rtl" as any,background:C.bg,minHeight:"100vh"}}>
    <Hdr t="إنشاء طلب توصيل 📦" onBack={onBack} gradient/>
    <div style={{padding:"4px 20px 120px"}}>
      <Lbl req>وصف الغرض</Lbl><Inp ph="جوال، شنطة، طاولة..." val={item} set={setItem}/>
      <Lbl req>صورة الغرض</Lbl><FUp label="اضغط لرفع صورة" preview={img} onFile={(p:any,f:any)=>{setImg(p);setImgF(f)}}/>
      <Lbl req>الحجم</Lbl><GS opts={SIZES} val={size} set={setSize}/>
      <Lbl req>من مدينة</Lbl><Picker val={from} set={setFrom} opts={CITIES} ph="مدينة الإرسال"/>
      <Lbl req>إلى مدينة</Lbl><Picker val={to} set={setTo} opts={CITIES} ph="مدينة الاستلام"/>
      <Lbl req>اليوم</Lbl><Picker val={day} set={setDay} opts={DAYS} ph="اختر اليوم"/>
      <Lbl req>السعر (ر.س)</Lbl><Inp ph="مثال: 80" val={price} set={(v:string)=>setPrice(v.replace(/\D/g,""))} type="tel" dir="ltr"/>

      <Lbl req>كيف يستلم الكدّاد الغرض؟</Lbl>
      <div style={{display:"flex",flexDirection:"column" as any,gap:10}}>
        <div onClick={()=>setPickup("meetup")} style={{display:"flex",alignItems:"center",gap:14,padding:"16px",border:"2px solid "+(pickup==="meetup"?C.pri:C.brd),borderRadius:16,background:pickup==="meetup"?C.priL:"#fff",cursor:"pointer",transition:"all .15s"}}>
          <div style={{fontSize:30}}>🤝</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:800,color:pickup==="meetup"?C.pri:C.txt}}>نقطة لقاء</div>
            <div style={{fontSize:11,color:C.ok,fontWeight:700,marginTop:2}}>✓ بدون رسوم إضافية</div>
          </div>
          {pickup==="meetup" && <span style={{color:C.pri,fontSize:22,fontWeight:800}}>✓</span>}
        </div>
        <div onClick={()=>setPickup("door")} style={{display:"flex",alignItems:"center",gap:14,padding:"16px",border:"2px solid "+(pickup==="door"?C.acc:C.brd),borderRadius:16,background:pickup==="door"?C.accL:"#fff",cursor:"pointer"}}>
          <div style={{fontSize:30}}>🚪</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:800,color:pickup==="door"?C.acc:C.txt}}>يستلم من عندك</div>
            <div style={{fontSize:11,color:C.acc,fontWeight:700,marginTop:2}}>+ رسوم إضافية 30 ر.س</div>
          </div>
          {pickup==="door" && <span style={{color:C.acc,fontSize:22,fontWeight:800}}>✓</span>}
        </div>
      </div>

      {pickup==="door" && <div style={{marginTop:14}}>
        <Lbl req>عنوانك (الحي أو أقرب معلم)</Lbl>
        <Inp ph="مثال: حي النرجس، شارع الملك سلمان" val={address} set={setAddress}/>
      </div>}

      <div onClick={()=>setFrag(!frag)} style={{marginTop:20,display:"flex",alignItems:"center",gap:12,background:frag?C.accL:"#fff",border:"2px solid "+(frag?C.acc:C.brd),borderRadius:16,padding:"14px 16px",cursor:"pointer"}}>
        <span style={{fontSize:26}}>⚠️</span>
        <div style={{flex:1,fontSize:14,fontWeight:800}}>قابل للكسر</div>
        <div style={{width:44,height:24,borderRadius:12,background:frag?C.acc:C.brd,padding:2,display:"flex",justifyContent:frag?"flex-start":"flex-end",transition:"all .15s"}}>
          <div style={{width:20,height:20,borderRadius:10,background:"#fff",boxShadow:"0 2px 4px rgba(0,0,0,0.2)"}}/>
        </div>
      </div>

      <div onClick={()=>setAgree(!agree)} style={{marginTop:14,display:"flex",alignItems:"flex-start",gap:12,cursor:"pointer",padding:"10px",background:agree?C.priL:"transparent",borderRadius:12}}>
        <div style={{width:24,height:24,borderRadius:8,border:"2px solid "+(agree?C.pri:C.brd),background:agree?C.pri:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
          {agree && <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
        </div>
        <div style={{fontSize:13,color:C.txt,lineHeight:1.7,fontWeight:600}}>أتعهد بأن التغليف مسؤوليتي بالكامل</div>
      </div>

      <Btn onClick={()=>setWarn(true)} ok={ok}>نشر الطلب 🚀</Btn>
    </div>
  </div>;
}

function NewShopping({onBack,user,onDone}:any){
  const [store,setStore]=useState("");const[list,setList]=useState("");const[cost,setCost]=useState("");const[fee,setFee]=useState("");
  const [city,setCity]=useState("");const[day,setDay]=useState("");const[address,setAddress]=useState("");
  const [agree,setAgree]=useState(false);const[ld,setLd]=useState(false);
  const ok = store&&list&&cost&&fee&&city&&day&&address&&agree;

  const go = async () => {
    setLd(true);
    const {error} = await db.from("orders").insert({
      sender_id:user.id,
      item_name:"تسوّق من "+store,
      item_size:"متوسط 🎒",
      is_shopping:true,
      store_name:store,
      shopping_list:list,
      estimated_cost:Number(cost),
      city_from:city,city_to:city,
      delivery_type:"توصيل للباب",
      delivery_date:day,
      price:Number(fee),
      pickup_type:"door",
      pickup_address:address,
      extra_fee:0,
      status:"pending"
    });
    setLd(false);
    if(!error) onDone();
    else alert("خطأ: "+error.message);
  };

  return <div style={{fontFamily:FT,direction:"rtl" as any,background:C.bg,minHeight:"100vh"}}>
    <Hdr t="طلب تسوّق 🛒" onBack={onBack} gradient/>
    <div style={{padding:"4px 20px 120px"}}>
      <div style={{background:C.purpleL,borderRadius:16,padding:"12px 14px",marginTop:16,fontSize:12,color:C.purple,fontWeight:700,lineHeight:1.6}}>
        💡 الكدّاد يشتري الأغراض من المتجر ويوصّلها لك. أنت تدفع ثمن الأغراض + أجرة التوصيل.
      </div>

      <Lbl req>اسم المتجر</Lbl><Inp ph="مثال: العثيم، بنده، نون..." val={store} set={setStore}/>
      <Lbl req>قائمة المشتريات</Lbl>
      <textarea value={list} onChange={(e:any)=>setList(e.target.value)} placeholder="مثلاً:&#10;• 2 كيلو تفاح&#10;• زيت زيتون 1 لتر&#10;• خبز" style={{width:"100%",padding:"14px 16px",border:"2px solid "+C.brd,borderRadius:14,fontSize:14,fontFamily:FT,outline:"none",boxSizing:"border-box" as any,background:"#fff",minHeight:100,resize:"none" as any}}/>

      <Lbl req>المدينة</Lbl><Picker val={city} set={setCity} opts={CITIES} ph="اختر مدينتك"/>
      <Lbl req>اليوم</Lbl><Picker val={day} set={setDay} opts={DAYS} ph="اختر اليوم"/>
      <Lbl req>عنوان التوصيل</Lbl><Inp ph="مثال: حي النرجس، شارع الملك فهد" val={address} set={setAddress}/>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div>
          <Lbl req>قيمة المشتريات تقديرياً</Lbl>
          <Inp ph="100" val={cost} set={(v:string)=>setCost(v.replace(/\D/g,""))} type="tel" dir="ltr"/>
        </div>
        <div>
          <Lbl req>أجرة التوصيل</Lbl>
          <Inp ph="30" val={fee} set={(v:string)=>setFee(v.replace(/\D/g,""))} type="tel" dir="ltr"/>
        </div>
      </div>

      {cost && fee && <div style={{background:C.priL,borderRadius:14,padding:"12px 14px",marginTop:14,fontSize:14,color:C.pri,fontWeight:800,textAlign:"center" as any}}>
        💰 المجموع التقريبي: {Number(cost)+Number(fee)} ر.س
      </div>}

      <div onClick={()=>setAgree(!agree)} style={{marginTop:16,display:"flex",alignItems:"flex-start",gap:12,cursor:"pointer",padding:"10px",background:agree?C.purpleL:"transparent",borderRadius:12}}>
        <div style={{width:24,height:24,borderRadius:8,border:"2px solid "+(agree?C.purple:C.brd),background:agree?C.purple:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
          {agree && <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
        </div>
        <div style={{fontSize:12,color:C.txt,lineHeight:1.7,fontWeight:600}}>أوافق على دفع قيمة المشتريات الفعلية + أجرة التوصيل عند الاستلام</div>
      </div>

      <Btn onClick={go} ok={ok} loading={ld} bg={"linear-gradient(135deg,"+C.purple+","+C.purple+"cc)"}>نشر طلب التسوّق 🛒</Btn>
    </div>
  </div>;
}

function NewTrip({onBack,user}:any){
  const [from,setFrom]=useState("");const[to,setTo]=useState("");const[sp,setSp]=useState("");const[day,setDay]=useState("");const[hour,setHour]=useState("");const[price,setPrice]=useState("50");const[maxOrders,setMaxOrders]=useState(1);const[ld,setLd]=useState(false);const[done,setDone]=useState(false);

  const go = async () => {
    if(Number(price)<50){alert("الحد الأدنى 50 ر.س");return;}
    setLd(true);
    await db.from("trips").insert({driver_id:user.id,city_from:from,city_to:to,available_space:sp,trip_date:day,trip_time:hour,min_price:Number(price),max_orders:maxOrders});
    setLd(false);setDone(true);
  };

  if(done) return <div style={{fontFamily:FT,direction:"rtl" as any,display:"flex",flexDirection:"column" as any,alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:32,textAlign:"center" as any,background:"linear-gradient(135deg,"+C.bg+","+C.priL+")"}}>
    <div style={{fontSize:72,marginBottom:20}}>🎉</div>
    <h2 style={{fontSize:24,fontWeight:900,color:C.txt}}>تمت الإضافة!</h2>
    <p style={{fontSize:14,color:C.mut,marginTop:10,fontWeight:600}}>رحلتك ظاهرة الحين للمرسلين</p>
    <button onClick={onBack} style={{padding:"14px 40px",background:"linear-gradient(135deg,"+C.pri+","+C.priD+")",color:"#fff",border:"none",borderRadius:16,fontSize:15,fontWeight:800,fontFamily:FT,cursor:"pointer",marginTop:28,boxShadow:"0 8px 24px "+C.pri+"40"}}>العودة للرئيسية</button>
  </div>;

  const ok = from&&to&&sp&&day&&hour&&Number(price)>=50;
  return <div style={{fontFamily:FT,direction:"rtl" as any,background:C.bg,minHeight:"100vh"}}>
    <Hdr t="أضف رحلة 🚗" onBack={onBack} gradient/>
    <div style={{padding:"4px 20px 120px"}}>
      <Lbl req>من مدينة</Lbl><Picker val={from} set={setFrom} opts={CITIES} ph="مدينة الانطلاق"/>
      <Lbl req>إلى مدينة</Lbl><Picker val={to} set={setTo} opts={CITIES} ph="مدينة الوصول"/>
      <Lbl req>اليوم</Lbl><Picker val={day} set={setDay} opts={DAYS} ph="اختر اليوم"/>
      <Lbl req>الساعة</Lbl><Picker val={hour} set={setHour} opts={HOURS} ph="اختر الساعة"/>
      <Lbl req>المساحة المتاحة</Lbl><GS opts={["شنطة صغيرة","شنطة كبيرة","حوض","سطحة"]} val={sp} set={setSp} ac={C.acc} acBg={C.accL}/>
      <Lbl req>الحد الأدنى للسعر (ر.س)</Lbl>
      <Inp ph="50" val={price} set={(v:string)=>setPrice(v.replace(/\D/g,""))} type="tel" dir="ltr"/>
      <div style={{fontSize:12,color:C.mut,marginTop:4,fontWeight:600}}>الحد الأدنى 50 ر.س</div>

      <Lbl>🤝 عدد الطلبات اللي تقبلها في نفس الرحلة</Lbl>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
        {[1,2,3,4].map(n=>
          <button key={n} onClick={()=>setMaxOrders(n)} style={{padding:"14px 8px",borderRadius:14,border:"2px solid "+(maxOrders===n?C.purple:C.brd),background:maxOrders===n?C.purpleL:"#fff",color:maxOrders===n?C.purple:C.txt,fontSize:15,fontWeight:800,fontFamily:FT,cursor:"pointer"}}>{n}</button>
        )}
      </div>
      {maxOrders>1 && <div style={{background:C.purpleL,borderRadius:14,padding:"10px 14px",marginTop:10,fontSize:12,color:C.purple,fontWeight:700,lineHeight:1.6}}>
        💰 توصيل جماعي! تقبل حتى {maxOrders} طلبات وتكسب أكثر من رحلة واحدة
      </div>}

      <Btn onClick={go} ok={ok} loading={ld} bg={"linear-gradient(135deg,"+C.acc+","+C.accD+")"}>نشر الرحلة 🚀</Btn>
    </div>
  </div>;
}

function ChatScreen({order,user,onBack}:any){
  const [messages,setMessages] = useState<any[]>([]);
  const [input,setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const otherUserId = user.id===order.sender_id ? order.driver_id : order.sender_id;

  useEffect(()=>{
    db.from("messages").select("*").eq("order_id",order.id).order("created_at",{ascending:true}).then(({data}:any)=>{if(data)setMessages(data)});
    const ch = db.channel("chat-"+order.id).on("postgres_changes",{event:"INSERT",schema:"public",table:"messages",filter:"order_id=eq."+order.id},(payload:any)=>{setMessages(prev=>[...prev,payload.new])}).subscribe();
    return ()=>{db.removeChannel(ch)};
  },[order.id]);

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"})},[messages]);

  const send = async () => {
    if(!input.trim()) return;
    const content = input;setInput("");
    await db.from("messages").insert({order_id:order.id,sender_id:user.id,content});
    if(otherUserId) await notify(otherUserId,"💬 رسالة جديدة",user.name+": "+content.slice(0,50),"new_message",order.id);
  };

  const getTime = (ts:string) => {const d=new Date(ts);return (d.getHours()%12||12)+":"+String(d.getMinutes()).padStart(2,"0")+" "+(d.getHours()>=12?"م":"ص");};

  return <div style={{fontFamily:FT,direction:"rtl" as any,display:"flex",flexDirection:"column" as any,height:"100vh",background:C.bg}}>
    <div style={{padding:"14px 16px",background:"linear-gradient(135deg,"+C.pri+","+C.priD+")",display:"flex",alignItems:"center",gap:12,color:"#fff"}}>
      <button onClick={onBack} style={{background:"rgba(255,255,255,0.2)",border:"none",cursor:"pointer",padding:"8px",display:"flex",borderRadius:10,color:"#fff"}}><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg></button>
      <div style={{flex:1}}>
        <div style={{fontSize:15,fontWeight:800}}>💬 {order.item_name}</div>
        <div style={{fontSize:11,opacity:0.8,marginTop:2}}>{order.city_from} ← {order.city_to}</div>
      </div>
    </div>
    <div style={{background:C.warnL,padding:"10px 16px",fontSize:11,color:"#92400E",textAlign:"center" as any,fontWeight:700}}>⚠️ كدّاد غير مسؤول عن محادثات خارج التطبيق</div>
    <div style={{flex:1,overflow:"auto",padding:16}}>
      {messages.length===0 && <div style={{textAlign:"center" as any,color:C.mut,marginTop:60}}><div style={{fontSize:48,marginBottom:8}}>💬</div><div style={{fontSize:14,fontWeight:600}}>ابدأ المحادثة</div></div>}
      {messages.map((m:any)=>
        <div key={m.id} style={{display:"flex",justifyContent:m.sender_id===user.id?"flex-start":"flex-end",marginBottom:10}}>
          <div style={{maxWidth:"75%",background:m.sender_id===user.id?"linear-gradient(135deg,"+C.pri+","+C.priD+")":"#fff",color:m.sender_id===user.id?"#fff":C.txt,padding:"11px 15px",borderRadius:m.sender_id===user.id?"18px 18px 4px 18px":"18px 18px 18px 4px",boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
            <div style={{fontSize:14,lineHeight:1.6}}>{m.content}</div>
            <div style={{fontSize:10,opacity:0.6,marginTop:4}}>{getTime(m.created_at)}</div>
          </div>
        </div>
      )}
      <div ref={endRef}/>
    </div>
    <div style={{padding:"10px 14px",background:"#fff",borderTop:"1px solid "+C.brd,display:"flex",gap:10}}>
      <input value={input} onChange={(e:any)=>setInput(e.target.value)} onKeyDown={(e:any)=>e.key==="Enter"&&send()} placeholder="اكتب رسالتك..." style={{flex:1,padding:"12px 16px",border:"2px solid "+C.brd,borderRadius:22,fontSize:14,fontFamily:FT,outline:"none"}}/>
      <button onClick={send} style={{background:"linear-gradient(135deg,"+C.pri+","+C.priD+")",border:"none",borderRadius:"50%",width:46,height:46,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",flexShrink:0}}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg></button>
    </div>
  </div>;
}

function RatingModal({order,user,onClose}:any){
  const [stars,setStars] = useState(5);
  const [comment,setComment] = useState("");
  const [ld,setLd] = useState(false);
  const ratedId = user.id===order.sender_id ? order.driver_id : order.sender_id;

  const submit = async () => {
    setLd(true);
    await db.from("ratings").insert({order_id:order.id,rater_id:user.id,rated_id:ratedId,stars,comment});
    const {data: ratings} = await db.from("ratings").select("stars").eq("rated_id",ratedId);
    if(ratings && ratings.length>0){
      const avg = ratings.reduce((sum:any,r:any)=>sum+r.stars,0)/ratings.length;
      await db.from("profiles").update({rating:avg}).eq("id",ratedId);
    }
    await notify(ratedId,"⭐ تقييم جديد","حصلت على "+stars+" نجوم","new_rating",order.id);
    setLd(false);
    onClose(true);
  };

  return <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:FT,direction:"rtl" as any,backdropFilter:"blur(8px)"}}>
    <div style={{background:"#fff",borderRadius:28,padding:28,maxWidth:400,width:"100%",boxShadow:"0 30px 80px rgba(0,0,0,0.3)"}}>
      <div style={{textAlign:"center" as any,marginBottom:20}}>
        <div style={{fontSize:52,marginBottom:10}}>⭐</div>
        <h2 style={{fontSize:22,fontWeight:900,margin:0}}>قيّم التجربة</h2>
        <p style={{fontSize:13,color:C.mut,marginTop:6,fontWeight:500}}>كيف كانت التجربة معك؟</p>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:22}}>
        {[1,2,3,4,5].map(i=>
          <button key={i} onClick={()=>setStars(i)} style={{background:"none",border:"none",fontSize:46,cursor:"pointer",opacity:i<=stars?1:0.25,transition:"all .15s",padding:0}}>⭐</button>
        )}
      </div>
      <Lbl>تعليقك (اختياري)</Lbl>
      <textarea value={comment} onChange={(e:any)=>setComment(e.target.value)} placeholder="شاركنا تجربتك..." style={{width:"100%",padding:"14px 16px",border:"2px solid "+C.brd,borderRadius:14,fontSize:14,fontFamily:FT,outline:"none",boxSizing:"border-box" as any,background:"#fff",minHeight:80,resize:"none" as any}}/>
      <div style={{display:"flex",gap:10,marginTop:20}}>
        <button onClick={()=>onClose(false)} style={{flex:1,padding:14,background:"none",border:"2px solid "+C.brd,borderRadius:14,fontSize:14,fontWeight:800,fontFamily:FT,cursor:"pointer",color:C.mut}}>لاحقاً</button>
        <button onClick={submit} disabled={ld} style={{flex:1,padding:14,background:"linear-gradient(135deg,"+C.pri+","+C.priD+")",color:"#fff",border:"none",borderRadius:14,fontSize:14,fontWeight:800,fontFamily:FT,cursor:"pointer"}}>{ld?"جاري...":"إرسال ⭐"}</button>
      </div>
    </div>
  </div>;
}

function ReportModal({order,user,onClose}:any){
  const [type,setType] = useState("");
  const [desc,setDesc] = useState("");
  const [ld,setLd] = useState(false);
  const reportedId = user.id===order.sender_id ? order.driver_id : order.sender_id;

  const submit = async () => {
    setLd(true);
    await db.from("reports").insert({reporter_id:user.id,reported_id:reportedId,order_id:order.id,type,description:desc});
    setLd(false);
    alert("تم إرسال البلاغ — سنتواصل معك قريباً ✅");
    onClose();
  };

  return <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",zIndex:9999,display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:FT,direction:"rtl" as any,backdropFilter:"blur(8px)"}}>
    <div style={{background:"#fff",borderRadius:"28px 28px 0 0",padding:24,maxWidth:430,width:"100%",maxHeight:"85vh",overflow:"auto"}}>
      <div style={{width:40,height:4,background:C.brd,borderRadius:3,margin:"0 auto 16px"}}/>
      <div style={{textAlign:"center" as any,marginBottom:20}}>
        <div style={{fontSize:46,marginBottom:8}}>🆘</div>
        <h2 style={{fontSize:20,fontWeight:900,margin:0}}>الإبلاغ عن مشكلة</h2>
        <p style={{fontSize:13,color:C.mut,marginTop:6,fontWeight:500}}>اختر نوع المشكلة وسنتابعها</p>
      </div>
      <Lbl req>نوع المشكلة</Lbl>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
        {REPORT_TYPES.map((r:any)=>
          <button key={r.id} onClick={()=>setType(r.id)} style={{padding:"12px 8px",borderRadius:14,border:"2px solid "+(type===r.id?C.err:C.brd),background:type===r.id?"#FEF2F2":"#fff",color:type===r.id?C.err:C.txt,fontSize:12,fontWeight:700,fontFamily:FT,cursor:"pointer",display:"flex",flexDirection:"column" as any,alignItems:"center",gap:6}}>
            <span style={{fontSize:20}}>{r.icon}</span>
            <span>{r.label}</span>
          </button>
        )}
      </div>
      <Lbl>تفاصيل إضافية (اختياري)</Lbl>
      <textarea value={desc} onChange={(e:any)=>setDesc(e.target.value)} placeholder="اشرح المشكلة بالتفصيل..." style={{width:"100%",padding:"14px 16px",border:"2px solid "+C.brd,borderRadius:14,fontSize:14,fontFamily:FT,outline:"none",boxSizing:"border-box" as any,background:"#fff",minHeight:80,resize:"none" as any}}/>
      <div style={{display:"flex",gap:10,marginTop:18}}>
        <button onClick={onClose} style={{flex:1,padding:14,background:"none",border:"2px solid "+C.brd,borderRadius:14,fontSize:14,fontWeight:800,fontFamily:FT,cursor:"pointer",color:C.mut}}>إلغاء</button>
        <button onClick={submit} disabled={!type||ld} style={{flex:1,padding:14,background:type?C.err:C.brd,color:"#fff",border:"none",borderRadius:14,fontSize:14,fontWeight:800,fontFamily:FT,cursor:type?"pointer":"default"}}>{ld?"جاري...":"إرسال البلاغ 🚨"}</button>
      </div>
    </div>
  </div>;
}

function Detail({order,user,onBack,onChat,onRate,onReport}:any){
  const [ord,setOrd] = useState(order);
  const [ld,setLd] = useState(false);
  const [deliveryPhoto,setDeliveryPhoto] = useState<any>(null);
  const [deliveryPhotoF,setDeliveryPhotoF] = useState<any>(null);
  const [showPhotoStep,setShowPhotoStep] = useState(false);
  const isDriver = user.id===ord.driver_id;
  const isSender = user.id===ord.sender_id;

  const updateStatus = async (newStatus:string, extraData:any={}) => {
    setLd(true);
    const {data,error} = await db.from("orders").update({status:newStatus,...extraData}).eq("id",ord.id).select().single();
    if(!error && data){
      setOrd(data);
      const otherUserId = isDriver ? ord.sender_id : ord.driver_id;
      const msgs:any = {"بدأت الرحلة":"الكدّاد بدأ الرحلة 🛫","وصل":"الكدّاد وصل المدينة 📍","تم التسليم":"تم تسليم الغرض بنجاح ✅"};
      if(otherUserId && msgs[newStatus]) await notify(otherUserId,msgs[newStatus],ord.item_name,"order_"+newStatus.replace(/\s/g,"_"),ord.id);
      if(newStatus==="تم التسليم" && isDriver){
        await db.from("profiles").update({total_deliveries:(user.total_deliveries||0)+1,total_earnings:(user.total_earnings||0)+((ord.price||0)+(ord.extra_fee||0))*0.65}).eq("id",user.id);
      }
    }
    setLd(false);
  };

  const confirmDelivery = async () => {
    if(!deliveryPhotoF){alert("لازم ترفع صورة التسليم");return;}
    setLd(true);
    const url = await uploadImg(deliveryPhotoF,"deliveries");
    await updateStatus("تم التسليم",{delivered_at:new Date().toISOString(),delivery_photo:url});
    setShowPhotoStep(false);
    setLd(false);
  };

  return <div style={{fontFamily:FT,direction:"rtl" as any,background:C.bg,minHeight:"100vh"}}>
    <Hdr t="تفاصيل الطلب" onBack={onBack} gradient right={
      (ord.status!=="pending" && ord.matched_driver_id) && <button onClick={onReport} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:12,padding:"8px 12px",fontSize:12,fontWeight:800,color:"#fff",fontFamily:FT,cursor:"pointer"}}>🆘 إبلاغ</button>
    }/>
    <div style={{padding:"16px 16px 120px"}}>
      {ord.is_shopping && <div style={{background:C.purpleL,borderRadius:16,padding:"12px 14px",marginBottom:14,fontSize:12,color:C.purple,fontWeight:700,lineHeight:1.6}}>
        🛒 هذا طلب تسوّق من {ord.store_name}
      </div>}

      <Card style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,paddingBottom:14,borderBottom:"1px solid "+C.brd}}>
          <div>
            <div style={{fontSize:18,fontWeight:900,color:C.txt}}>{ord.item_name}</div>
            <div style={{fontSize:12,color:C.mut,marginTop:3,fontWeight:600}}>{ord.item_size}</div>
          </div>
          <Badge st={ord.status}/>
        </div>

        {ord.is_shopping && ord.shopping_list && <div style={{background:C.srf,borderRadius:14,padding:"12px 14px",marginBottom:14,whiteSpace:"pre-line" as any,fontSize:13,color:C.txt,lineHeight:1.7,fontWeight:600}}>
          <div style={{fontWeight:800,marginBottom:6,color:C.purple}}>📝 قائمة المشتريات:</div>
          {ord.shopping_list}
        </div>}

        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{color:C.mut,fontWeight:600}}>المسار</span><span style={{fontWeight:800}}>{ord.city_from} ← {ord.city_to}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{color:C.mut,fontWeight:600}}>اليوم</span><span style={{fontWeight:800}}>{ord.delivery_date||"—"}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{color:C.mut,fontWeight:600}}>الاستلام</span><span style={{fontWeight:800}}>{ord.delivery_type||"—"}</span></div>
        {ord.pickup_address && <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{color:C.mut,fontWeight:600}}>العنوان</span><span style={{fontWeight:800,maxWidth:"60%",textAlign:"left" as any}}>{ord.pickup_address}</span></div>}
        {ord.is_fragile && <div style={{background:C.warnL,borderRadius:12,padding:"10px 14px",margin:"12px 0",fontSize:12,fontWeight:800,color:"#92400E"}}>⚠️ قابل للكسر</div>}
        {ord.estimated_cost && <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{color:C.mut,fontWeight:600}}>تكلفة المشتريات</span><span style={{fontWeight:800}}>~{ord.estimated_cost} ر.س</span></div>}
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:14,borderTop:"1px solid "+C.brd,marginTop:14}}>
          <span style={{color:C.mut,fontWeight:700}}>المبلغ</span>
          <span style={{fontSize:20,fontWeight:900,color:C.pri}}>{(ord.price||0)+(ord.extra_fee||0)} ر.س</span>
        </div>
        {ord.extra_fee>0 && <div style={{fontSize:11,color:C.acc,marginTop:4,fontWeight:700,textAlign:"left" as any}}>شامل رسوم توصيل +{ord.extra_fee} ر.س</div>}
        {ord.item_image && <img src={ord.item_image} alt="" style={{width:"100%",borderRadius:14,marginTop:14,maxHeight:220,objectFit:"cover" as any}}/>}
      </Card>

      {/* Driver tracking buttons */}
      {isDriver && ord.status!=="تم التسليم" && <Card style={{marginBottom:14}}>
        <h3 style={{margin:"0 0 14px",fontSize:15,fontWeight:800,color:C.txt}}>📍 تحديث حالة الطلب</h3>
        {ord.status==="matched" && <button onClick={()=>updateStatus("بدأت الرحلة",{started_at:new Date().toISOString()})} disabled={ld} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#0891B2,#0E7490)",color:"#fff",border:"none",borderRadius:14,fontSize:14,fontWeight:800,fontFamily:FT,cursor:"pointer",marginBottom:8,boxShadow:"0 6px 18px #0891B240"}}>🛫 بدأت الرحلة</button>}
        {ord.status==="بدأت الرحلة" && <button onClick={()=>updateStatus("وصل",{arrived_at:new Date().toISOString()})} disabled={ld} style={{width:"100%",padding:14,background:"linear-gradient(135deg,#059669,#047857)",color:"#fff",border:"none",borderRadius:14,fontSize:14,fontWeight:800,fontFamily:FT,cursor:"pointer",marginBottom:8,boxShadow:"0 6px 18px #05966940"}}>📍 وصلت المدينة</button>}
        {ord.status==="وصل" && !showPhotoStep && <button onClick={()=>setShowPhotoStep(true)} disabled={ld} style={{width:"100%",padding:14,background:"linear-gradient(135deg,"+C.pri+","+C.priD+")",color:"#fff",border:"none",borderRadius:14,fontSize:14,fontWeight:800,fontFamily:FT,cursor:"pointer",boxShadow:"0 6px 18px "+C.pri+"40"}}>✅ تم التسليم</button>}
        {ord.status==="وصل" && showPhotoStep && <div>
          <div style={{fontSize:13,color:C.mut,marginBottom:10,fontWeight:600}}>📸 ارفع صورة تثبت التسليم:</div>
          <FUp label="صورة التسليم" preview={deliveryPhoto} onFile={(p:any,f:any)=>{setDeliveryPhoto(p);setDeliveryPhotoF(f)}} icon="📷"/>
          <div style={{display:"flex",gap:10,marginTop:14}}>
            <button onClick={()=>setShowPhotoStep(false)} style={{flex:1,padding:12,background:"none",border:"2px solid "+C.brd,borderRadius:14,fontSize:13,fontWeight:700,fontFamily:FT,cursor:"pointer",color:C.mut}}>إلغاء</button>
            <button onClick={confirmDelivery} disabled={!deliveryPhotoF||ld} style={{flex:1,padding:12,background:deliveryPhotoF?"linear-gradient(135deg,"+C.ok+",#047857)":C.brd,color:"#fff",border:"none",borderRadius:14,fontSize:13,fontWeight:800,fontFamily:FT,cursor:deliveryPhotoF?"pointer":"default"}}>{ld?"جاري...":"تأكيد التسليم ✅"}</button>
          </div>
        </div>}
      </Card>}

      {/* Delivery photo for sender */}
      {ord.delivery_photo && <Card style={{marginBottom:14}}>
        <h3 style={{margin:"0 0 12px",fontSize:15,fontWeight:800,color:C.ok}}>✅ صورة التسليم</h3>
        <img src={ord.delivery_photo} alt="" style={{width:"100%",borderRadius:14,maxHeight:260,objectFit:"cover" as any}}/>
      </Card>}

      {/* OTP for sender */}
      {ord.otp_code && isSender && (ord.status==="وصل"||ord.status==="بدأت الرحلة") && <div style={{background:"linear-gradient(135deg,"+C.accL+","+C.accL+"80)",borderRadius:20,padding:20,textAlign:"center" as any,border:"2px dashed "+C.acc,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:700,marginBottom:8,color:"#92400E"}}>🔐 رمز التسليم — أعطه للكدّاد</div>
        <div style={{fontSize:38,fontWeight:900,color:C.acc,letterSpacing:10,direction:"ltr" as any}}>{ord.otp_code}</div>
      </div>}

      {/* Chat button */}
      {(ord.status==="matched"||ord.status==="بدأت الرحلة"||ord.status==="وصل") && <button onClick={onChat} style={{width:"100%",padding:14,background:"linear-gradient(135deg,"+C.priL+","+C.priL+"80)",border:"2px solid "+C.pri+"40",borderRadius:16,color:C.pri,fontWeight:800,fontFamily:FT,fontSize:14,cursor:"pointer",marginBottom:10}}>💬 فتح المحادثة</button>}

      {/* Rate button */}
      {ord.status==="تم التسليم" && <button onClick={onRate} style={{width:"100%",padding:14,background:"linear-gradient(135deg,"+C.acc+","+C.accD+")",border:"none",borderRadius:16,color:"#fff",fontWeight:800,fontFamily:FT,fontSize:14,cursor:"pointer",boxShadow:"0 6px 18px "+C.acc+"40"}}>⭐ قيّم التجربة</button>}
    </div>
  </div>;
}

function OrdersList({user,onBack,onPick}:any){
  const [orders,setOrders] = useState<any[]>([]);
  useEffect(()=>{
    db.from("orders").select("*").or("sender_id.eq."+user.id+",driver_id.eq."+user.id).order("created_at",{ascending:false}).then(({data}:any)=>{if(data)setOrders(data)});
  },[user.id]);
  return <div style={{fontFamily:FT,direction:"rtl" as any,background:C.bg,minHeight:"100vh"}}>
    <Hdr t="📋 طلباتي" onBack={onBack} gradient/>
    <div style={{padding:"16px 16px 100px"}}>
      {orders.length===0 && <EmptyState icon="📋" text="لا توجد طلبات"/>}
      {orders.map((o:any)=>
        <Card key={o.id} onClick={()=>onPick(o)} style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div>
              <div style={{fontSize:15,fontWeight:800,display:"flex",alignItems:"center",gap:6}}>{o.is_shopping?"🛒":"📦"} {o.item_name}</div>
              <div style={{fontSize:12,color:C.mut,marginTop:4,fontWeight:600}}>{o.city_from} ← {o.city_to}</div>
            </div>
            <Badge st={o.status}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:"1px solid "+C.brd}}>
            <span style={{fontSize:12,color:C.mut,fontWeight:600}}>#{String(o.id).slice(0,8)}</span>
            <span style={{fontSize:15,fontWeight:900,color:C.pri}}>{(o.price||0)+(o.extra_fee||0)} ر.س</span>
          </div>
        </Card>
      )}
    </div>
  </div>;
}

function DriverDashboard({user,onBack}:any){
  const [stats,setStats] = useState<any>({total:0,monthly:0,deliveries:0,ratings:"5.0"});
  const [activeAreas,setActiveAreas] = useState<any[]>([]);

  useEffect(()=>{
    (async ()=>{
      const now = new Date();
      const monthStart = new Date(now.getFullYear(),now.getMonth(),1).toISOString();
      const {data: allOrders} = await db.from("orders").select("*").eq("driver_id",user.id).eq("status","تم التسليم");
      const {data: thisMonth} = await db.from("orders").select("*").eq("driver_id",user.id).eq("status","تم التسليم").gte("delivered_at",monthStart);
      const {data: ratings} = await db.from("ratings").select("stars").eq("rated_id",user.id);
      const total = (allOrders||[]).reduce((s:any,o:any)=>s+((o.price||0)+(o.extra_fee||0))*0.65,0);
      const monthly = (thisMonth||[]).reduce((s:any,o:any)=>s+((o.price||0)+(o.extra_fee||0))*0.65,0);
      const avgRating = ratings && ratings.length>0 ? (ratings.reduce((s:any,r:any)=>s+r.stars,0)/ratings.length).toFixed(1) : "5.0";
      setStats({total:total.toFixed(0),monthly:monthly.toFixed(0),deliveries:(allOrders||[]).length,ratings:avgRating});
      const areaMap:any = {};
      (allOrders||[]).forEach((o:any)=>{const key=o.city_from+" ← "+o.city_to;areaMap[key]=(areaMap[key]||0)+1});
      const areas = Object.entries(areaMap).map(([k,v])=>({route:k,count:v})).sort((a:any,b:any)=>b.count-a.count).slice(0,5);
      setActiveAreas(areas);
    })();
  },[user.id]);

  const badge = getBadge(stats.deliveries);

  return <div style={{fontFamily:FT,direction:"rtl" as any,background:C.bg,minHeight:"100vh"}}>
    <Hdr t="📊 لوحة الكدّاد" onBack={onBack} gradient/>
    <div style={{padding:"16px 16px 100px"}}>
      <div style={{background:"linear-gradient(135deg,"+C.pri+","+C.priD+")",borderRadius:24,padding:28,marginBottom:16,color:"#fff",textAlign:"center" as any,boxShadow:"0 12px 32px "+C.pri+"40"}}>
        <div style={{fontSize:52,marginBottom:10}}>{badge.emoji}</div>
        <div style={{fontSize:13,opacity:0.85,fontWeight:600}}>مستواك الحالي</div>
        <div style={{fontSize:22,fontWeight:900,marginTop:4}}>كدّاد {badge.name}</div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        {[[C.pri,"💰",stats.total,"إجمالي الأرباح"],[C.acc,"📅",stats.monthly,"أرباح الشهر"],[C.info,"📦",stats.deliveries,"عدد التوصيلات"],[C.warn,"⭐",stats.ratings,"متوسط التقييم"]].map(([col,ic,val,lbl]:any,i:number)=>
          <Card key={i} style={{textAlign:"center",padding:18}}>
            <div style={{fontSize:30,marginBottom:6}}>{ic}</div>
            <div style={{fontSize:26,fontWeight:900,color:col,lineHeight:1}}>{val}</div>
            <div style={{fontSize:11,color:C.mut,fontWeight:700,marginTop:6}}>{lbl}</div>
          </Card>
        )}
      </div>

      <Card style={{marginBottom:16}}>
        <h3 style={{margin:"0 0 14px",fontSize:15,fontWeight:800}}>🗺️ مناطقك النشطة</h3>
        {activeAreas.length===0 && <div style={{color:C.mut,fontSize:13,textAlign:"center" as any,padding:16,fontWeight:600}}>لا توجد مناطق بعد</div>}
        {activeAreas.map((a:any,i:number)=>
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<activeAreas.length-1?"1px solid "+C.brd:"none"}}>
            <span style={{fontSize:13,fontWeight:700}}>{a.route}</span>
            <span style={{background:C.priL,color:C.pri,padding:"3px 10px",borderRadius:12,fontSize:11,fontWeight:800}}>{a.count} توصيلة</span>
          </div>
        )}
      </Card>
    </div>
  </div>;
}

function Profile({user,onLogout,nav}:any){
  const isDriver = user.role==="driver";
  return <div style={{fontFamily:FT,direction:"rtl" as any,background:C.bg,minHeight:"100vh",padding:"24px 16px 100px"}}>
    <Card style={{textAlign:"center",padding:24,marginBottom:16}}>
      <Av l={user.name?.[0]||"?"} s={80}/>
      <h2 style={{margin:"16px 0 4px",fontSize:22,fontWeight:900}}>{user.name}</h2>
      <p style={{margin:0,fontSize:13,color:C.mut,fontWeight:600}}>{user.phone}</p>
      <p style={{margin:"4px 0 0",fontSize:12,color:C.mut,fontWeight:500}}>📍 {user.city}</p>
      <div style={{display:"flex",justifyContent:"center",gap:8,marginTop:12,flexWrap:"wrap" as any}}>
        <span style={{background:user.role==="sender"?C.priL:C.accL,color:user.role==="sender"?C.pri:"#92400E",padding:"5px 14px",borderRadius:12,fontSize:12,fontWeight:800}}>{user.role==="sender"?"📦 مرسل":"🚗 كدّاد"}</span>
        {isDriver && <UserBadge deliveries={user.total_deliveries}/>}
      </div>
      {user.car_make && <p style={{margin:"10px 0 0",fontSize:13,color:C.mut,fontWeight:600}}>🚙 {user.car_make} {user.car_model} · {user.car_plate}</p>}
      {user.rating && Number(user.rating)>0 && <div style={{marginTop:10,fontSize:16,fontWeight:800,color:C.acc}}>⭐ {Number(user.rating).toFixed(1)}</div>}
    </Card>

    {isDriver && <button onClick={()=>nav("dashboard")} style={{width:"100%",padding:16,background:"linear-gradient(135deg,"+C.pri+","+C.priD+")",border:"none",borderRadius:16,color:"#fff",fontSize:15,fontWeight:800,fontFamily:FT,cursor:"pointer",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:"0 8px 24px "+C.pri+"40"}}>📊 لوحة الأرباح والإحصائيات</button>}

    {user.is_admin && <button onClick={()=>nav("admin")} style={{width:"100%",padding:16,background:"linear-gradient(135deg,"+C.purple+","+C.purple+"cc)",border:"none",borderRadius:16,color:"#fff",fontSize:15,fontWeight:800,fontFamily:FT,cursor:"pointer",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",gap:10,boxShadow:"0 8px 24px "+C.purple+"40"}}>👑 لوحة الإدارة</button>}

    <button onClick={onLogout} style={{width:"100%",marginTop:8,padding:14,background:"#fff",border:"2px solid "+C.err,borderRadius:16,color:C.err,fontSize:14,fontWeight:800,fontFamily:FT,cursor:"pointer"}}>🚪 تسجيل خروج</button>
  </div>;
}

function AdminPanel({user,onBack}:any){
  const [tab,setTab] = useState("stats");
  const [stats,setStats] = useState<any>({users:0,orders:0,earnings:0,pending:0});
  const [reports,setReports] = useState<any[]>([]);
  const [users,setUsers] = useState<any[]>([]);

  const load = async () => {
    const {data: allUsers} = await db.from("profiles").select("*").order("created_at",{ascending:false});
    const {data: allOrders} = await db.from("orders").select("price,extra_fee,status");
    const {data: allReports} = await db.from("reports").select("*,reporter:reporter_id(name),reported:reported_id(name)").eq("status","pending").order("created_at",{ascending:false});
    const completed = (allOrders||[]).filter((o:any)=>o.status==="تم التسليم");
    const totalEarnings = completed.reduce((s:any,o:any)=>s+((o.price||0)+(o.extra_fee||0))*0.35,0);
    setStats({users:(allUsers||[]).length,orders:(allOrders||[]).length,earnings:totalEarnings.toFixed(0),pending:(allReports||[]).length});
    setUsers(allUsers||[]);
    setReports(allReports||[]);
  };

  useEffect(()=>{load();},[]);

  const toggleBlock = async (u:any) => {
    if(!confirm((u.is_blocked?"إلغاء حظر ":"حظر ")+u.name+"؟")) return;
    await db.from("profiles").update({is_blocked:!u.is_blocked}).eq("id",u.id);
    load();
  };

  const resolveReport = async (r:any) => {
    const notes = prompt("ملاحظات الحل:");
    await db.from("reports").update({status:"resolved",admin_notes:notes||""}).eq("id",r.id);
    load();
  };

  return <div style={{fontFamily:FT,direction:"rtl" as any,background:C.bg,minHeight:"100vh"}}>
    <Hdr t="👑 لوحة الإدارة" onBack={onBack} gradient/>
    <div style={{padding:"16px 16px 100px"}}>
      <div style={{display:"flex",gap:8,marginBottom:16,overflow:"auto",paddingBottom:4}}>
        {[["stats","📊","إحصائيات"],["reports","🆘","البلاغات"],["users","👥","المستخدمين"]].map(([id,em,lb]:any)=>
          <button key={id} onClick={()=>setTab(id)} style={{padding:"10px 16px",borderRadius:14,border:"2px solid "+(tab===id?C.purple:C.brd),background:tab===id?C.purpleL:"#fff",color:tab===id?C.purple:C.mut,fontSize:13,fontWeight:800,fontFamily:FT,cursor:"pointer",whiteSpace:"nowrap" as any,flexShrink:0}}>{em} {lb}</button>
        )}
      </div>

      {tab==="stats" && <div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          {[[C.purple,"👥",stats.users,"مستخدم"],[C.pri,"📦",stats.orders,"طلب"],[C.acc,"💰",stats.earnings,"أرباحك (ر.س)"],[C.err,"🆘",stats.pending,"بلاغ معلق"]].map(([col,ic,val,lbl]:any,i:number)=>
            <Card key={i} style={{textAlign:"center",padding:20}}>
              <div style={{fontSize:34,marginBottom:6}}>{ic}</div>
              <div style={{fontSize:28,fontWeight:900,color:col,lineHeight:1}}>{val}</div>
              <div style={{fontSize:11,color:C.mut,fontWeight:700,marginTop:6}}>{lbl}</div>
            </Card>
          )}
        </div>
      </div>}

      {tab==="reports" && <div>
        {reports.length===0 && <EmptyState icon="✅" text="لا توجد بلاغات معلقة"/>}
        {reports.map((r:any)=>{
          const rt = REPORT_TYPES.find((t:any)=>t.id===r.type);
          return <Card key={r.id} style={{marginBottom:10,border:"2px solid "+C.err+"30"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <span style={{fontSize:28}}>{rt?.icon||"⚠️"}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:800,color:C.err}}>{rt?.label||r.type}</div>
                <div style={{fontSize:11,color:C.mut,fontWeight:600,marginTop:2}}>{new Date(r.created_at).toLocaleDateString("ar-SA")}</div>
              </div>
            </div>
            <div style={{fontSize:12,color:C.txt,fontWeight:600,marginBottom:4}}>المُبلِّغ: {r.reporter?.name||"—"}</div>
            <div style={{fontSize:12,color:C.txt,fontWeight:600,marginBottom:8}}>المُبلَّغ عنه: {r.reported?.name||"—"}</div>
            {r.description && <div style={{background:C.srf,borderRadius:12,padding:"10px 12px",fontSize:12,color:C.txt,lineHeight:1.6,marginBottom:10}}>{r.description}</div>}
            <button onClick={()=>resolveReport(r)} style={{width:"100%",padding:10,background:C.ok,color:"#fff",border:"none",borderRadius:12,fontSize:12,fontWeight:800,fontFamily:FT,cursor:"pointer"}}>✅ حل البلاغ</button>
          </Card>;
        })}
      </div>}

      {tab==="users" && <div>
        {users.map((u:any)=>
          <Card key={u.id} style={{marginBottom:10,opacity:u.is_blocked?0.6:1}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <Av l={u.name?.[0]||"?"} s={40}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:14,fontWeight:800}}>{u.name} {u.is_blocked && <span style={{color:C.err,fontSize:11}}>🚫 محظور</span>}</div>
                <div style={{fontSize:11,color:C.mut,fontWeight:600}}>{u.phone} · {u.city}</div>
              </div>
              <span style={{background:u.role==="sender"?C.priL:C.accL,color:u.role==="sender"?C.pri:"#92400E",padding:"3px 8px",borderRadius:10,fontSize:10,fontWeight:800}}>{u.role==="sender"?"📦":"🚗"}</span>
            </div>
            {u.id!==user.id && <button onClick={()=>toggleBlock(u)} style={{width:"100%",padding:9,background:u.is_blocked?C.ok:C.err,color:"#fff",border:"none",borderRadius:10,fontSize:12,fontWeight:800,fontFamily:FT,cursor:"pointer"}}>{u.is_blocked?"✅ إلغاء الحظر":"🚫 حظر"}</button>}
          </Card>
        )}
      </div>}
    </div>
  </div>;
}

export default function App(){
  const [phase,setPhase] = useState("landing");
  const [role,setRole] = useState("sender");
  const [screen,setScreen] = useState("home");
  const [data,setData] = useState<any>(null);
  const [user,setUser] = useState<any>(null);
  const [unreadCount,setUnreadCount] = useState(0);
  const [showRating,setShowRating] = useState<any>(null);
  const [showReport,setShowReport] = useState<any>(null);
  const nav = (s:string,d:any=null) => {setScreen(s);setData(d);};

  useEffect(()=>{
    if(!user) return;
    const check = async () => {
      const {data} = await db.from("notifications").select("id").eq("user_id",user.id).eq("is_read",false);
      setUnreadCount(data?.length||0);
    };
    check();
    const interval = setInterval(check, 10000);
    return ()=>clearInterval(interval);
  },[user]);

  if(phase==="landing") return <Landing onReg={()=>setPhase("role")} onLogin={()=>setPhase("login")}/>;
  if(phase==="role") return <RoleSelect onPick={(r:string)=>{setRole(r);setPhase("reg")}} onBack={()=>setPhase("landing")}/>;
  if(phase==="reg") return <Register role={role} onDone={(u:any)=>{setUser(u);setRole(u.role);setPhase("app");nav("home")}} onBack={()=>setPhase("role")}/>;
  if(phase==="login") return <Login onDone={(u:any)=>{setUser(u);setRole(u.role);setPhase("app");nav("home")}} onBack={()=>setPhase("landing")}/>;

  const isSender = user?.role==="sender";
  const tabs = isSender
    ? [["home","🏠","الرئيسية"],["orders","📋","طلباتي"],["newOrder","➕","جديد"],["profile","👤","حسابي"]]
    : [["home","🏠","الرئيسية"],["orders","📋","طلباتي"],["newTrip","➕","رحلة"],["profile","👤","حسابي"]];

  const R = () => {
    switch(screen){
      case "home": return isSender ? <SenderHome nav={nav} user={user} unreadCount={unreadCount}/> : <DriverHome nav={nav} user={user} unreadCount={unreadCount}/>;
      case "newOrder": return <NewOrder onBack={()=>nav("home")} user={user} onDone={()=>nav("home")}/>;
      case "newShopping": return <NewShopping onBack={()=>nav("home")} user={user} onDone={()=>nav("home")}/>;
      case "newTrip": return <NewTrip onBack={()=>nav("home")} user={user}/>;
      case "detail": return <Detail order={data} user={user} onBack={()=>nav("home")} onChat={()=>nav("chat",data)} onRate={()=>setShowRating(data)} onReport={()=>setShowReport(data)}/>;
      case "chat": return <ChatScreen order={data} user={user} onBack={()=>nav("detail",data)}/>;
      case "orders": return <OrdersList user={user} onBack={()=>nav("home")} onPick={(o:any)=>nav("detail",o)}/>;
      case "dashboard": return <DriverDashboard user={user} onBack={()=>nav("profile")}/>;
      case "admin": return <AdminPanel user={user} onBack={()=>nav("profile")}/>;
      case "notifications": return <NotificationsScreen user={user} onBack={()=>nav("home")} onOpen={async (n:any)=>{const {data}=await db.from("orders").select("*").eq("id",n.related_id).maybeSingle();if(data)nav("detail",data)}}/>;
      case "profile": return <Profile user={user} onLogout={()=>{setPhase("landing");setUser(null)}} nav={nav}/>;
      default: return isSender ? <SenderHome nav={nav} user={user} unreadCount={unreadCount}/> : <DriverHome nav={nav} user={user} unreadCount={unreadCount}/>;
    }
  };

  return <div style={{maxWidth:430,margin:"0 auto",background:C.bg,minHeight:"100vh",position:"relative"}}>
    {R()}
    {showRating && <RatingModal order={showRating} user={user} onClose={(done:boolean)=>{setShowRating(null);if(done){nav("home");}}}/>}
    {showReport && <ReportModal order={showReport} user={user} onClose={()=>setShowReport(null)}/>}
    {!["chat"].includes(screen) && <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid "+C.brd,display:"flex",justifyContent:"space-around",padding:"10px 0 14px",zIndex:100,fontFamily:FT,maxWidth:430,margin:"0 auto",boxShadow:"0 -4px 20px rgba(0,0,0,0.05)"}}>
      {tabs.map(([id,em,lb]:any)=>
        <button key={id} onClick={()=>nav(id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column" as any,alignItems:"center",gap:4,color:screen===id?C.pri:C.mut,fontFamily:FT,padding:"4px 10px",borderRadius:12,background:screen===id?C.priL:"none"}}>
          <span style={{fontSize:22}}>{em}</span>
          <span style={{fontSize:10,fontWeight:screen===id?800:600}}>{lb}</span>
        </button>
      )}
    </div>}
  </div>;
}