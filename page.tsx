"use client";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const db = createClient(
  "https://nanbjdtzawynwubieikr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbmJqZHR6YXd5bnd1YmllaWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MDkyNDQsImV4cCI6MjA5MTQ4NTI0NH0.15GJSu1ZYTUeCu2P8nLP83f2bcPV3t_p9NNf0RuUCN0"
);

const C:any = {pri:"#0E8A7D",priD:"#065E54",priG:"#0FC2AF",priL:"#CCFBF1",acc:"#F5A623",accW:"#FF8C42",accL:"#FEF3C7",bg:"#FAFBFC",card:"#FFF",txt:"#112226",mut:"#6B8289",brd:"#E2EAED",ok:"#12B886",err:"#EF5350",srf:"#EFF4F5",dk:"#0C1F23",crm:"#F7F3ED"};
const FT = "Tajawal, sans-serif";
const CITIES = ["الرياض","جدة","مكة","المدينة","الدمام","الخبر","أبها","تبوك","حائل","القصيم","الطائف","جازان","نجران","الجبيل","ينبع","خميس مشيط","الأحساء","بريدة"];
const CARS = ["تويوتا","نيسان","هيونداي","كيا","فورد","شيفروليه","هوندا","جيب","مرسيدس","لكزس","أخرى"];
const AGES = Array.from({length:53},(_:any,i:number)=>String(i+18));
const SIZES = ["صغير 📱","متوسط 🎒","كبير 🪑","كبير جداً 🛋️"];
const DTYPES = ["نقطة لقاء 🤝","توصيل للباب 🚪"];

async function uploadImg(file:File, folder:string){
  const n = folder+"/"+Date.now()+"_"+Math.random().toString(36).slice(2);
  const {error} = await db.storage.from("uploads").upload(n, file);
  if(error) return null;
  const {data} = db.storage.from("uploads").getPublicUrl(n);
  return data.publicUrl;
}

// ═══ Small Components ═══
function Av({l,s=44,bg=C.pri}:any){return <div style={{width:s,height:s,borderRadius:"50%",background:bg,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:s*0.4,fontFamily:FT,flexShrink:0}}>{l}</div>}

function Badge({st}:any){
  const colors:any = {"بالطريق":"#1D4ED8","تم التسليم":"#065F46","pending":"#92400E"};
  const bgs:any = {"بالطريق":"#DBEAFE","تم التسليم":"#D1FAE5","pending":"#FEF3C7"};
  const icons:any = {"بالطريق":"🚗","تم التسليم":"✅","pending":"⏳"};
  const label = st==="pending"?"بانتظار القبول":st;
  return <span style={{background:bgs[st]||bgs.pending,color:colors[st]||colors.pending,padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:600}}>{icons[st]||icons.pending} {label}</span>;
}

function Hdr({t,onBack}:any){return <div style={{padding:"14px 16px",background:"#fff",borderBottom:"1px solid "+C.brd,display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:10}}><button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"flex"}}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg></button><h2 style={{margin:0,fontSize:19,fontWeight:700,fontFamily:FT}}>{t}</h2></div>}

function Lbl({children,req}:any){return <div style={{fontSize:14,fontWeight:700,color:C.txt,marginBottom:8,marginTop:20,fontFamily:FT}}>{children}{req && <span style={{color:C.err}}> *</span>}</div>}

function Inp({ph,val,set,type="text",dir}:any){return <input placeholder={ph} value={val} onChange={(e:any)=>set(e.target.value)} type={type} dir={dir} style={{width:"100%",padding:"13px 16px",border:"2px solid "+C.brd,borderRadius:14,fontSize:15,fontFamily:FT,outline:"none",boxSizing:"border-box" as any,background:"#fff"}}/>}

function GS({opts,val,set,cols=2,ac=C.pri,acBg=C.priL}:any){return <div style={{display:"grid",gridTemplateColumns:"repeat("+cols+",1fr)",gap:10}}>{opts.map((o:string)=><button key={o} onClick={()=>set(o)} style={{padding:"12px 8px",borderRadius:14,border:"2px solid "+(val===o?ac:C.brd),background:val===o?acBg:"#fff",color:val===o?ac:C.txt,fontSize:14,fontWeight:600,fontFamily:FT,cursor:"pointer"}}>{o}</button>)}</div>}

function Picker({val,set,opts,ph}:any){
  const [open,setOpen] = useState(false);
  return <div>
    <div onClick={()=>setOpen(true)} style={{width:"100%",padding:"13px 16px",border:"2px solid "+C.brd,borderRadius:14,fontSize:15,fontFamily:FT,boxSizing:"border-box" as any,background:"#fff",color:val?C.txt:C.mut,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span>{val||ph}</span>
      <svg width="16" height="16" fill="none" stroke={C.mut} strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
    </div>
    {open && <div onClick={()=>setOpen(false)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={(e:any)=>e.stopPropagation()} style={{background:"#fff",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:430,maxHeight:"70vh",display:"flex",flexDirection:"column" as any}}>
        <div style={{padding:"16px 20px",borderBottom:"1px solid "+C.brd,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:17,fontWeight:800,fontFamily:FT}}>{ph}</span>
          <button onClick={()=>setOpen(false)} style={{background:C.srf,border:"none",borderRadius:10,padding:"6px 14px",fontSize:14,fontWeight:700,fontFamily:FT,cursor:"pointer",color:C.mut}}>إغلاق</button>
        </div>
        <div style={{overflow:"auto",flex:1}}>
          {opts.map((o:string)=><div key={o} onClick={()=>{set(o);setOpen(false)}} style={{padding:"14px 20px",fontSize:16,fontFamily:FT,color:val===o?C.pri:C.txt,background:val===o?C.priL:"transparent",borderBottom:"1px solid "+C.brd,cursor:"pointer",fontWeight:val===o?700:400,display:"flex",justifyContent:"space-between"}}>
            <span>{o}</span>{val===o && <span style={{color:C.pri}}>✓</span>}
          </div>)}
        </div>
      </div>
    </div>}
  </div>;
}

function FUp({label,preview,onFile,icon="📷"}:any){
  const ref = useRef<any>(null);
  return <div>
    <input ref={ref} type="file" accept="image/*" onChange={(e:any)=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=(ev:any)=>onFile(ev.target.result,f);r.readAsDataURL(f)}}} style={{display:"none"}}/>
    <div onClick={()=>ref.current?.click()} style={{border:"2px dashed "+(preview?C.pri:C.brd),borderRadius:18,padding:preview?0:28,cursor:"pointer",textAlign:"center" as any,overflow:"hidden",background:preview?"#000":C.srf,minHeight:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
      {preview ? <img src={preview} alt="" style={{width:"100%",maxHeight:160,objectFit:"cover" as any,borderRadius:16}}/> : <div><div style={{fontSize:28,marginBottom:6}}>{icon}</div><div style={{fontSize:13,color:C.mut}}>{label}</div></div>}
    </div>
  </div>;
}

function Btn({children,onClick,ok=true,loading=false,bg=C.pri}:any){
  return <button onClick={ok&&!loading?onClick:undefined} disabled={!ok||loading} style={{width:"100%",padding:18,background:ok&&!loading?bg:C.brd,color:"#fff",border:"none",borderRadius:18,fontSize:17,fontWeight:700,fontFamily:FT,cursor:ok?"pointer":"default",marginTop:28}}>{loading?"جاري...":children}</button>;
}

// ═══ LANDING ═══
function Landing({onReg,onLogin}:any){
  return <div style={{fontFamily:FT,direction:"rtl" as any,height:"100vh",overflow:"auto",background:C.crm}}>
    <nav style={{padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:38,height:38,borderRadius:12,background:"linear-gradient(135deg,"+C.pri+","+C.priG+")",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:18}}>ك</div>
        <span style={{fontSize:22,fontWeight:900,color:C.dk}}>كدّاد</span>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={onLogin} style={{padding:"10px 20px",background:"transparent",color:C.dk,border:"2px solid "+C.brd,borderRadius:12,fontSize:14,fontWeight:700,fontFamily:FT,cursor:"pointer"}}>دخول</button>
        <button onClick={onReg} style={{padding:"10px 20px",background:C.dk,color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,fontFamily:FT,cursor:"pointer"}}>تسجيل</button>
      </div>
    </nav>
    <div style={{padding:"40px 24px 56px",textAlign:"center" as any}}>
      <div style={{fontSize:72,marginBottom:28}}>🚗💨📦</div>
      <h1 style={{fontSize:34,fontWeight:900,color:C.dk,lineHeight:1.4,marginBottom:16}}>كل رحلة بين المدن<br/><span style={{color:C.pri}}>فرصة توصيل</span></h1>
      <p style={{fontSize:16,color:C.mut,maxWidth:340,margin:"0 auto 32px",lineHeight:1.7}}>أرسل أغراضك مع مسافر — أسرع وأرخص</p>
      <button onClick={onReg} style={{padding:"16px 36px",background:"linear-gradient(135deg,"+C.pri+","+C.priG+")",color:"#fff",border:"none",borderRadius:16,fontSize:17,fontWeight:800,fontFamily:FT,cursor:"pointer"}}>ابدأ الحين 🚀</button>
    </div>
    <div style={{padding:"44px 24px",background:"#fff"}}>
      <h2 style={{fontSize:26,fontWeight:900,color:C.dk,textAlign:"center" as any,marginBottom:32}}>ليش كدّاد؟</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {[["⚡","توصيل نفس اليوم"],["💰","سعر أقل"],["📦","أي حجم"],["🛡️","أمان وثقة"]].map(([ic,t]:any,i:number)=>
          <div key={i} style={{background:C.crm,borderRadius:20,padding:"24px 18px",textAlign:"center" as any}}>
            <div style={{fontSize:32,marginBottom:10}}>{ic}</div>
            <div style={{fontSize:15,fontWeight:800,color:C.dk}}>{t}</div>
          </div>
        )}
      </div>
    </div>
    <div style={{padding:"48px 24px 56px",background:C.dk,textAlign:"center" as any}}>
      <h2 style={{fontSize:28,fontWeight:900,color:"#fff",marginBottom:12}}>جاهز تبدأ؟</h2>
      <button onClick={onReg} style={{padding:"16px 48px",background:"linear-gradient(135deg,"+C.pri+","+C.priG+")",color:"#fff",border:"none",borderRadius:16,fontSize:17,fontWeight:800,fontFamily:FT,cursor:"pointer"}}>سجّل الحين</button>
    </div>
  </div>;
}

// ═══ ROLE SELECT ═══
function RoleSelect({onPick,onBack}:any){
  return <div style={{minHeight:"100vh",background:"linear-gradient(165deg,"+C.dk+","+C.priD+")",display:"flex",flexDirection:"column" as any,alignItems:"center",justifyContent:"center",padding:24,fontFamily:FT,direction:"rtl" as any}}>
    <div style={{textAlign:"center" as any,marginBottom:36}}><div style={{fontSize:48,marginBottom:8}}>🚗📦</div><h1 style={{color:"#fff",fontSize:28,fontWeight:900}}>كيف تبغى تستخدم كدّاد؟</h1></div>
    <div style={{display:"flex",flexDirection:"column" as any,gap:16,width:"100%",maxWidth:400}}>
      {[["sender","📦","أبغى أرسل غرض"],["driver","🚗","أبغى أكون كدّاد"]].map(([id,em,t]:any)=>
        <button key={id} onClick={()=>onPick(id)} style={{display:"flex",alignItems:"center",gap:18,padding:"24px 22px",background:"rgba(255,255,255,0.06)",border:"2px solid rgba(255,255,255,0.1)",borderRadius:22,cursor:"pointer",textAlign:"right" as any}}>
          <div style={{fontSize:44}}>{em}</div>
          <div style={{fontSize:18,fontWeight:800,color:"#fff",fontFamily:FT}}>{t}</div>
        </button>
      )}
    </div>
    <button onClick={onBack} style={{marginTop:20,background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:14,fontFamily:FT,cursor:"pointer"}}>← رجوع</button>
  </div>;
}

// ═══ REGISTER ═══
function Register({role,onDone,onBack}:any){
  const [nm,setNm]=useState("");const [ph,setPh]=useState("");const [em,setEm]=useState("");const [ag,setAg]=useState("");const [ct,setCt]=useState("");
  const [cm,setCm]=useState("");const [cmo,setCmo]=useState("");const [cp,setCp]=useState("");
  const [ip,setIp]=useState<any>(null);const [ifl,setIfl]=useState<any>(null);
  const [rp,setRp]=useState<any>(null);const [rfl,setRfl]=useState<any>(null);
  const [stp,setStp]=useState(1);const [ld,setLd]=useState(false);const [er,setEr]=useState("");
  const isD = role==="driver";
  const ok1 = nm.trim()&&ph.length>=9&&em.includes("@")&&ag&&ct;
  const ok2 = ok1&&cm&&cmo&&cp&&ip&&rp;

  const go = async () => {
    setLd(true); setEr("");
    let iu=null, ru=null;
    if(ifl) iu = await uploadImg(ifl,"id-photos");
    if(rfl) ru = await uploadImg(rfl,"car-docs");
    const {data,error} = await db.from("profiles").insert({
      name:nm, phone:ph, email:em, age:ag, city:ct, role:role,
      car_make:cm||null, car_model:cmo||null, car_plate:cp||null,
      id_photo:iu, reg_photo:ru
    }).select().single();
    if(error){
      console.error("REG ERROR:", error);
      setEr(error.message.includes("duplicate") ? "رقم الجوال مسجّل!" : "خطأ: "+error.message);
    } else {
      console.log("REGISTERED:", data);
      onDone(data);
    }
    setLd(false);
  };

  if(stp===1) return <div style={{minHeight:"100vh",background:C.bg,fontFamily:FT,direction:"rtl" as any}}>
    <div style={{padding:"20px 16px 30px",background:"linear-gradient(135deg,"+(isD?C.acc:C.pri)+","+(isD?C.accW:C.priG)+")",color:"#fff"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",fontSize:14,fontFamily:FT,cursor:"pointer",marginBottom:12}}>← رجوع</button>
      <div style={{fontSize:36,marginBottom:8}}>{isD?"🚗":"📦"}</div>
      <h1 style={{fontSize:24,fontWeight:900,margin:0}}>تسجيل {isD?"كدّاد":"مرسل"}</h1>
    </div>
    <div style={{padding:"0 20px 40px",marginTop:-10,background:C.bg,borderRadius:"20px 20px 0 0"}}>
      {er && <div style={{background:"#FEF2F2",color:C.err,padding:12,borderRadius:12,marginTop:16,fontSize:13,fontWeight:600}}>{er}</div>}
      <Lbl req>الاسم</Lbl><Inp ph="محمد أحمد" val={nm} set={setNm}/>
      <Lbl req>الجوال</Lbl><Inp ph="05XXXXXXXX" val={ph} set={(v:string)=>setPh(v.replace(/\D/g,"").slice(0,10))} type="tel" dir="ltr"/>
      <Lbl req>الإيميل</Lbl><Inp ph="example@email.com" val={em} set={setEm} type="email" dir="ltr"/>
      <Lbl req>العمر</Lbl><Picker val={ag} set={setAg} opts={AGES} ph="اختر"/>
      <Lbl req>المدينة</Lbl><Picker val={ct} set={setCt} opts={CITIES} ph="اختر"/>
      <Btn onClick={()=>isD?setStp(2):go()} ok={ok1} loading={ld} bg={"linear-gradient(135deg,"+(isD?C.acc:C.pri)+","+(isD?C.accW:C.priG)+")"}>{isD?"التالي →":"إنشاء حساب ✨"}</Btn>
    </div>
  </div>;

  return <div style={{minHeight:"100vh",background:C.bg,fontFamily:FT,direction:"rtl" as any}}>
    <div style={{padding:"20px 16px 30px",background:"linear-gradient(135deg,"+C.acc+","+C.accW+")",color:"#fff"}}>
      <button onClick={()=>setStp(1)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",fontSize:14,fontFamily:FT,cursor:"pointer",marginBottom:12}}>← رجوع</button>
      <div style={{fontSize:36,marginBottom:8}}>🚗</div>
      <h1 style={{fontSize:24,fontWeight:900,margin:0}}>بيانات السيارة</h1>
    </div>
    <div style={{padding:"0 20px 40px",marginTop:-10,background:C.bg,borderRadius:"20px 20px 0 0"}}>
      {er && <div style={{background:"#FEF2F2",color:C.err,padding:12,borderRadius:12,marginTop:16,fontSize:13,fontWeight:600}}>{er}</div>}
      <Lbl req>الشركة</Lbl><Picker val={cm} set={setCm} opts={CARS} ph="اختر"/>
      <Lbl req>الموديل</Lbl><Inp ph="كامري، هايلكس..." val={cmo} set={setCmo}/>
      <Lbl req>اللوحة</Lbl><Inp ph="أ ب ج ١٢٣٤" val={cp} set={setCp}/>
      <Lbl req>صورة الهوية</Lbl><FUp label="ارفع الهوية" preview={ip} onFile={(p:any,f:any)=>{setIp(p);setIfl(f)}} icon="🪪"/>
      <Lbl req>صورة الاستمارة</Lbl><FUp label="ارفع الاستمارة" preview={rp} onFile={(p:any,f:any)=>{setRp(p);setRfl(f)}} icon="📄"/>
      <Btn onClick={go} ok={ok2} loading={ld} bg={"linear-gradient(135deg,"+C.acc+","+C.accW+")"}>إنشاء حساب 🚀</Btn>
    </div>
  </div>;
}

// ═══ LOGIN ═══
function Login({onDone,onBack}:any){
  const [ph,setPh]=useState("");const [ld,setLd]=useState(false);const [er,setEr]=useState("");
  const go = async () => {
    setLd(true); setEr("");
    const {data,error} = await db.from("profiles").select("*").eq("phone",ph).single();
    if(error||!data) setEr("رقم غير مسجّل!");
    else onDone(data);
    setLd(false);
  };
  return <div style={{minHeight:"100vh",background:"linear-gradient(165deg,"+C.dk+","+C.priD+")",display:"flex",flexDirection:"column" as any,alignItems:"center",justifyContent:"center",padding:24,fontFamily:FT,direction:"rtl" as any}}>
    <div style={{textAlign:"center" as any,marginBottom:36}}><div style={{fontSize:48,marginBottom:8}}>🔑</div><h1 style={{color:"#fff",fontSize:28,fontWeight:900}}>تسجيل دخول</h1></div>
    <div style={{background:"#fff",borderRadius:24,padding:"32px 28px",width:"100%",maxWidth:400}}>
      {er && <div style={{background:"#FEF2F2",color:C.err,padding:12,borderRadius:12,marginBottom:16,fontSize:13,fontWeight:600}}>{er}</div>}
      <Lbl req>رقم الجوال</Lbl><Inp ph="05XXXXXXXX" val={ph} set={(v:string)=>setPh(v.replace(/\D/g,"").slice(0,10))} type="tel" dir="ltr"/>
      <Btn onClick={go} ok={ph.length>=9} loading={ld}>دخول</Btn>
      <button onClick={onBack} style={{width:"100%",marginTop:12,padding:12,background:"none",border:"none",color:C.mut,fontSize:14,fontFamily:FT,cursor:"pointer"}}>← رجوع</button>
    </div>
  </div>;
}

// ═══ HOME ═══
function Home({nav,user}:any){
  const [orders,setOrders] = useState<any[]>([]);
  useEffect(()=>{
    db.from("orders").select("*").or("sender_id.eq."+user.id+",driver_id.eq."+user.id).order("created_at",{ascending:false}).limit(5).then(({data}:any)=>{if(data)setOrders(data)});
  },[user.id]);
  return <div style={{padding:"20px 16px 100px",fontFamily:FT,direction:"rtl" as any}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <div><h2 style={{margin:0,fontSize:24,fontWeight:800,color:C.txt}}>أهلاً {user.name?.split(" ")[0]} 👋</h2></div>
      <Av l={user.name?.[0]||"?"} s={46}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:28}}>
      <button onClick={()=>nav("newOrder")} style={{background:"linear-gradient(135deg,"+C.pri+","+C.priD+")",border:"none",borderRadius:20,padding:"28px 18px",cursor:"pointer",textAlign:"right" as any}}><div style={{fontSize:34,marginBottom:10}}>📦</div><div style={{color:"#fff",fontSize:16,fontWeight:700,fontFamily:FT}}>أرسل غرض</div></button>
      <button onClick={()=>nav("newTrip")} style={{background:"linear-gradient(135deg,"+C.acc+","+C.accW+")",border:"none",borderRadius:20,padding:"28px 18px",cursor:"pointer",textAlign:"right" as any}}><div style={{fontSize:34,marginBottom:10}}>🚗</div><div style={{color:"#fff",fontSize:16,fontWeight:700,fontFamily:FT}}>أضف رحلة</div></button>
    </div>
    <h3 style={{margin:"0 0 14px",fontSize:17,fontWeight:700}}>طلباتك</h3>
    {orders.length===0 && <div style={{background:C.card,borderRadius:18,padding:24,textAlign:"center" as any,border:"1px solid "+C.brd,color:C.mut}}>لا توجد طلبات بعد</div>}
    {orders.map((o:any)=><div key={o.id} onClick={()=>nav("detail",o)} style={{background:C.card,borderRadius:18,padding:16,marginBottom:12,cursor:"pointer",border:"1px solid "+C.brd}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
        <div><div style={{fontSize:15,fontWeight:700}}>{o.item_name}</div><div style={{fontSize:12,color:C.mut,marginTop:3}}>{o.city_from} → {o.city_to}</div></div>
        <Badge st={o.status}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:"1px solid "+C.brd}}>
        <span style={{fontSize:13,color:C.mut}}>#{String(o.id).slice(0,8)}</span>
        <span style={{fontSize:15,fontWeight:700,color:C.pri}}>{o.price||"—"} ر.س</span>
      </div>
    </div>)}
  </div>;
}

// ═══ NEW ORDER ═══
function NewOrder({onBack,user,onDone}:any){
  const [item,setItem]=useState("");const [size,setSize]=useState("");const [from,setFrom]=useState("");const [to,setTo]=useState("");const [del,setDel]=useState("");const [price,setPrice]=useState("");
  const [frag,setFrag]=useState(false);const [agree,setAgree]=useState(false);const [img,setImg]=useState<any>(null);const [imgF,setImgF]=useState<any>(null);const [warn,setWarn]=useState(false);const [ld,setLd]=useState(false);
  const ok = item&&size&&from&&to&&del&&img&&agree;

  const go = async () => {
    setLd(true);
    let url = null;
    if(imgF) url = await uploadImg(imgF,"items");
    const {error} = await db.from("orders").insert({sender_id:user.id,item_name:item,item_size:size,item_image:url,is_fragile:frag,city_from:from,city_to:to,delivery_type:del,price:price?Number(price):null,status:"pending"});
    setLd(false);
    if(!error) onDone(); else alert("خطأ: "+error.message);
  };

  if(warn) return <div style={{fontFamily:FT,direction:"rtl" as any,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:32,background:C.bg}}>
    <div style={{background:"#fff",borderRadius:24,padding:32,maxWidth:400,width:"100%",textAlign:"center" as any}}>
      <div style={{fontSize:56,marginBottom:16}}>⚠️</div>
      <h2 style={{fontSize:22,fontWeight:800,margin:"0 0 12px"}}>تأكيد</h2>
      <div style={{background:C.accL,borderRadius:16,padding:16,marginBottom:16,textAlign:"right" as any}}>
        <ul style={{margin:0,paddingRight:20,fontSize:13,color:"#92400E",lineHeight:2}}>
          <li>التغليف مسؤولية المرسل</li>
          {frag && <li>⚠️ قابل للكسر</li>}
        </ul>
      </div>
      <div style={{display:"flex",gap:12}}>
        <button onClick={()=>setWarn(false)} style={{flex:1,padding:14,background:"none",border:"2px solid "+C.brd,borderRadius:14,fontSize:15,fontWeight:700,fontFamily:FT,cursor:"pointer",color:C.mut}}>رجوع</button>
        <button onClick={go} disabled={ld} style={{flex:1,padding:14,background:C.pri,color:"#fff",border:"none",borderRadius:14,fontSize:15,fontWeight:700,fontFamily:FT,cursor:"pointer"}}>{ld?"جاري...":"تأكيد ✅"}</button>
      </div>
    </div>
  </div>;

  return <div style={{fontFamily:FT,direction:"rtl" as any}}><Hdr t="إنشاء طلب" onBack={onBack}/>
    <div style={{padding:"4px 20px 120px"}}>
      <Lbl req>الغرض</Lbl><Inp ph="جوال، شنطة..." val={item} set={setItem}/>
      <Lbl req>صورة</Lbl><FUp label="ارفع صورة" preview={img} onFile={(p:any,f:any)=>{setImg(p);setImgF(f)}}/>
      <Lbl req>الحجم</Lbl><GS opts={SIZES} val={size} set={setSize}/>
      <Lbl req>من</Lbl><Picker val={from} set={setFrom} opts={CITIES} ph="مدينة الإرسال"/>
      <Lbl req>إلى</Lbl><Picker val={to} set={setTo} opts={CITIES} ph="مدينة الاستلام"/>
      <Lbl req>التسليم</Lbl><GS opts={DTYPES} val={del} set={setDel}/>
      <Lbl>السعر</Lbl><Inp ph="اختياري" val={price} set={(v:string)=>setPrice(v.replace(/\D/g,""))} type="tel" dir="ltr"/>
      <div onClick={()=>setFrag(!frag)} style={{marginTop:20,display:"flex",alignItems:"center",gap:12,background:frag?C.accL:"#fff",border:"2px solid "+(frag?C.acc:C.brd),borderRadius:16,padding:"14px 16px",cursor:"pointer"}}>
        <span style={{fontSize:24}}>⚠️</span><div style={{flex:1,fontSize:14,fontWeight:700}}>قابل للكسر</div>
        <div style={{width:44,height:24,borderRadius:12,background:frag?C.acc:C.brd,padding:2,display:"flex",justifyContent:frag?"flex-start":"flex-end"}}><div style={{width:20,height:20,borderRadius:10,background:"#fff"}}/></div>
      </div>
      <div onClick={()=>setAgree(!agree)} style={{marginTop:14,display:"flex",alignItems:"flex-start",gap:12,cursor:"pointer"}}>
        <div style={{width:24,height:24,borderRadius:8,border:"2px solid "+(agree?C.pri:C.brd),background:agree?C.pri:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
          {agree && <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
        </div>
        <div style={{fontSize:13,color:C.mut,lineHeight:1.7}}>التغليف مسؤوليتي</div>
      </div>
      <Btn onClick={()=>setWarn(true)} ok={ok}>نشر 🚀</Btn>
    </div>
  </div>;
}

// ═══ NEW TRIP ═══
function NewTrip({onBack,user}:any){
  const [from,setFrom]=useState("");const [to,setTo]=useState("");const [sp,setSp]=useState("");const [ld,setLd]=useState(false);const [done,setDone]=useState(false);
  const go = async () => {setLd(true);await db.from("trips").insert({driver_id:user.id,city_from:from,city_to:to,available_space:sp});setLd(false);setDone(true)};
  if(done) return <div style={{fontFamily:FT,direction:"rtl" as any,display:"flex",flexDirection:"column" as any,alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:32,textAlign:"center" as any}}>
    <div style={{fontSize:60,marginBottom:16}}>🎉</div><h2 style={{fontSize:22,fontWeight:800}}>تمت الإضافة!</h2>
    <button onClick={onBack} style={{padding:"14px 36px",background:C.pri,color:"#fff",border:"none",borderRadius:16,fontSize:15,fontWeight:700,fontFamily:FT,cursor:"pointer",marginTop:24}}>الرئيسية</button>
  </div>;
  const ok = from&&to&&sp;
  return <div style={{fontFamily:FT,direction:"rtl" as any}}><Hdr t="أضف رحلة" onBack={onBack}/>
    <div style={{padding:"4px 20px 120px"}}>
      <Lbl req>من</Lbl><Picker val={from} set={setFrom} opts={CITIES} ph="مدينة الانطلاق"/>
      <Lbl req>إلى</Lbl><Picker val={to} set={setTo} opts={CITIES} ph="مدينة الوصول"/>
      <Lbl req>المساحة</Lbl><GS opts={["شنطة صغيرة","شنطة كبيرة","حوض","سطحة"]} val={sp} set={setSp} ac={C.acc} acBg={C.accL}/>
      <Btn onClick={go} ok={ok} loading={ld} bg={"linear-gradient(135deg,"+C.acc+","+C.accW+")"}>نشر 🚀</Btn>
    </div>
  </div>;
}

// ═══ DETAIL ═══
function Detail({order,onBack}:any){
  return <div style={{fontFamily:FT,direction:"rtl" as any}}><Hdr t="تفاصيل الطلب" onBack={onBack}/>
    <div style={{padding:"16px 16px 100px"}}>
      <div style={{background:C.card,borderRadius:20,padding:18,marginBottom:14,border:"1px solid "+C.brd}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{color:C.mut}}>الغرض</span><span style={{fontWeight:600}}>{order.item_name}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{color:C.mut}}>المسار</span><span style={{fontWeight:600}}>{order.city_from} → {order.city_to}</span></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{color:C.mut}}>الحالة</span><Badge st={order.status}/></div>
        {order.is_fragile && <div style={{background:C.accL,borderRadius:12,padding:"10px 14px",marginBottom:14,fontSize:13,fontWeight:700,color:"#92400E"}}>⚠️ قابل للكسر</div>}
        <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.mut}}>المبلغ</span><span style={{fontSize:18,fontWeight:800,color:C.pri}}>{order.price||"—"} ر.س</span></div>
        {order.item_image && <img src={order.item_image} alt="" style={{width:"100%",borderRadius:16,marginTop:14,maxHeight:200,objectFit:"cover" as any}}/>}
      </div>
      {order.otp_code && <div style={{background:C.accL,borderRadius:20,padding:20,textAlign:"center" as any,border:"2px dashed "+C.acc}}>
        <div style={{fontSize:13,fontWeight:600,marginBottom:8}}>رمز التسليم</div>
        <div style={{fontSize:34,fontWeight:900,color:C.acc,letterSpacing:10,direction:"ltr" as any}}>{order.otp_code}</div>
      </div>}
    </div>
  </div>;
}

// ═══ ORDERS LIST ═══
function OrdersList({user,onBack,onPick}:any){
  const [orders,setOrders] = useState<any[]>([]);
  useEffect(()=>{db.from("orders").select("*").or("sender_id.eq."+user.id+",driver_id.eq."+user.id).order("created_at",{ascending:false}).then(({data}:any)=>{if(data)setOrders(data)})},[user.id]);
  return <div style={{fontFamily:FT,direction:"rtl" as any}}><Hdr t="طلباتي" onBack={onBack}/>
    <div style={{padding:"12px 16px 100px"}}>
      {orders.length===0 && <div style={{padding:40,textAlign:"center" as any,color:C.mut}}>لا توجد طلبات</div>}
      {orders.map((o:any)=><div key={o.id} onClick={()=>onPick(o)} style={{background:C.card,borderRadius:18,padding:16,marginBottom:12,cursor:"pointer",border:"1px solid "+C.brd}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div><div style={{fontSize:15,fontWeight:700}}>{o.item_name}</div><div style={{fontSize:12,color:C.mut,marginTop:3}}>{o.city_from} → {o.city_to}</div></div><Badge st={o.status}/></div>
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:10,borderTop:"1px solid "+C.brd}}><span style={{fontSize:13,color:C.mut}}>#{String(o.id).slice(0,8)}</span><span style={{fontSize:15,fontWeight:700,color:C.pri}}>{o.price||"—"} ر.س</span></div>
      </div>)}
    </div>
  </div>;
}

// ═══ PROFILE ═══
function Profile({user,onLogout}:any){
  return <div style={{fontFamily:FT,direction:"rtl" as any,padding:"24px 16px 100px"}}>
    <div style={{textAlign:"center" as any,marginBottom:28}}>
      <Av l={user.name?.[0]||"?"} s={72}/>
      <h2 style={{margin:"14px 0 4px",fontSize:21,fontWeight:800}}>{user.name}</h2>
      <p style={{margin:0,fontSize:13,color:C.mut}}>{user.phone} · {user.email}</p>
      <p style={{margin:"4px 0 0",fontSize:12,color:C.mut}}>{user.city}</p>
      <div style={{display:"inline-block",background:user.role==="sender"?C.priL:C.accL,color:user.role==="sender"?C.pri:"#92400E",padding:"4px 14px",borderRadius:10,fontSize:12,fontWeight:700,marginTop:8}}>{user.role==="sender"?"📦 مرسل":"🚗 كدّاد"}</div>
      {user.car_make && <p style={{margin:"8px 0 0",fontSize:13,color:C.mut}}>{user.car_make} {user.car_model} · {user.car_plate}</p>}
    </div>
    <button onClick={onLogout} style={{width:"100%",marginTop:16,padding:14,background:"none",border:"2px solid "+C.err,borderRadius:16,color:C.err,fontSize:15,fontWeight:700,fontFamily:FT,cursor:"pointer"}}>تسجيل خروج</button>
  </div>;
}

// ═══ MAIN APP ═══
export default function App(){
  const [phase,setPhase] = useState("landing");
  const [role,setRole] = useState("sender");
  const [screen,setScreen] = useState("home");
  const [data,setData] = useState<any>(null);
  const [user,setUser] = useState<any>(null);
  const nav = (s:string,d:any=null) => {setScreen(s);setData(d)};

  if(phase==="landing") return <Landing onReg={()=>setPhase("role")} onLogin={()=>setPhase("login")}/>;
  if(phase==="role") return <RoleSelect onPick={(r:string)=>{setRole(r);setPhase("reg")}} onBack={()=>setPhase("landing")}/>;
  if(phase==="reg") return <Register role={role} onDone={(u:any)=>{setUser(u);setPhase("app");nav("home")}} onBack={()=>setPhase("role")}/>;
  if(phase==="login") return <Login onDone={(u:any)=>{setUser(u);setPhase("app");nav("home")}} onBack={()=>setPhase("landing")}/>;

  const tabs = [["home","🏠","الرئيسية"],["orders","📋","طلباتي"],["newOrder","➕","طلب جديد"],["profile","👤","حسابي"]];

  const R = () => {
    switch(screen){
      case "home": return <Home nav={nav} user={user}/>;
      case "newOrder": return <NewOrder onBack={()=>nav("home")} user={user} onDone={()=>nav("home")}/>;
      case "newTrip": return <NewTrip onBack={()=>nav("home")} user={user}/>;
      case "detail": return <Detail order={data} onBack={()=>nav("home")}/>;
      case "orders": return <OrdersList user={user} onBack={()=>nav("home")} onPick={(o:any)=>nav("detail",o)}/>;
      case "profile": return <Profile user={user} onLogout={()=>{setPhase("landing");setUser(null)}}/>;
      default: return <Home nav={nav} user={user}/>;
    }
  };

  return <div style={{maxWidth:430,margin:"0 auto",background:C.bg,minHeight:"100vh",position:"relative"}}>
    {R()}
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"1px solid "+C.brd,display:"flex",justifyContent:"space-around",padding:"8px 0 12px",zIndex:100,fontFamily:FT}}>
      {tabs.map(([id,em,lb]:any)=>
        <button key={id} onClick={()=>nav(id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column" as any,alignItems:"center",gap:3,color:screen===id?C.pri:C.mut,fontFamily:FT}}>
          <span style={{fontSize:20}}>{em}</span>
          <span style={{fontSize:10,fontWeight:screen===id?700:500}}>{lb}</span>
        </button>
      )}
    </div>
  </div>;
}
