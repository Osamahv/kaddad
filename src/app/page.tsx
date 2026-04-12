"use client";
import { useState, useEffect, useRef } from "react";
 
const C = {
  pri: "#0E8A7D", priD: "#065E54", priG: "#0FC2AF", priL: "#CCFBF1",
  acc: "#F5A623", accW: "#FF8C42", accL: "#FEF3C7",
  bg: "#FAFBFC", card: "#FFF", txt: "#112226", mut: "#6B8289",
  brd: "#E2EAED", ok: "#12B886", err: "#EF5350", srf: "#EFF4F5",
  dk: "#0C1F23", crm: "#F7F3ED"
};
const FONT = "'Tajawal', sans-serif";
const SA_CITIES = ["الرياض","جدة","مكة","المدينة","الدمام","الخبر","أبها","تبوك","حائل","القصيم","الطائف","جازان","نجران","الجبيل","ينبع","خميس مشيط","الأحساء","بريدة"];
const CAR_MAKES = ["تويوتا","نيسان","هيونداي","كيا","فورد","شيفروليه","جي إم سي","هوندا","جيب","مرسيدس","لكزس","أخرى"];
const AGES = Array.from({length:53},(_,i)=>String(i+18));
const TRAVELERS = [{id:1,name:"عبدالله المطيري",rating:4.8,car:"كامري 2023",from:"الدمام",to:"الرياض",time:"اليوم 4 م",price:80,avatar:"ع"},{id:2,name:"اسامة العجمي",rating:4.5,car:"هايلكس 2022",from:"الدمام",to:"الرياض",time:"اليوم 5:30 م",price:65,avatar:"ف"},{id:3,name:"سعود الدوسري",rating:4.9,car:"اكسبدشن 2024",from:"الدمام",to:"الرياض",time:"غداً 8 ص",price:95,avatar:"س"}];
const INIT_ORDERS = [{id:101,item:"جوال آيفون 15",size:"صغير",from:"الدمام",to:"الرياض",status:"بالطريق",traveler:TRAVELERS[0],price:80,date:"٩ أبريل",fragile:false},{id:102,item:"شنطة ملابس",size:"متوسط",from:"جدة",to:"الرياض",status:"تم التسليم",traveler:TRAVELERS[2],price:95,date:"٧ أبريل",fragile:false}];
const SIZES = ["صغير 📱","متوسط 🎒","كبير 🪑","كبير جداً 🛋️"];
const DEL_TYPES = ["نقطة لقاء 🤝","توصيل للباب 🚪"];
const AUTO_REPLIES = ["تمام 👍","أوصل خلال نص ساعة","وين نتقابل؟","عند المحطة؟","أنا بالطريق","وصلت أعطني الرمز"];
const GCSS = `@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{margin:0;background:#E2EAED}::-webkit-scrollbar{width:0}input,textarea,button,select{font-family:'Tajawal',sans-serif}`;
 
function Avatar({letter,size=44,bg=C.pri}){return <div style={{width:size,height:size,borderRadius:"50%",background:bg,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:size*0.4,fontFamily:FONT,flexShrink:0}}>{letter}</div>}
function StatusBadge({status}){const m={"بالطريق":{bg:"#DBEAFE",c:"#1D4ED8",i:"🚗"},"تم التسليم":{bg:"#D1FAE5",c:"#065F46",i:"✅"},"بانتظار القبول":{bg:"#FEF3C7",c:"#92400E",i:"⏳"}};const s=m[status]||m["بانتظار القبول"];return <span style={{background:s.bg,color:s.c,padding:"4px 12px",borderRadius:20,fontSize:12,fontWeight:600,fontFamily:FONT}}>{s.i} {status}</span>}
function PageHeader({title,onBack}){return <div style={{padding:"14px 16px",background:"#fff",borderBottom:`1px solid ${C.brd}`,display:"flex",alignItems:"center",gap:12,position:"sticky",top:0,zIndex:10}}><button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",display:"flex",padding:4}}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg></button><h2 style={{margin:0,fontSize:19,fontWeight:700,fontFamily:FONT}}>{title}</h2></div>}
function FieldLabel({children,required}){return <div style={{fontSize:14,fontWeight:700,color:C.txt,marginBottom:8,marginTop:20,fontFamily:FONT}}>{children}{required&&<span style={{color:C.err}}> *</span>}</div>}
function TextInput({placeholder,value,onChange,type="text",dir}){return <input placeholder={placeholder} value={value} onChange={onChange} type={type} dir={dir} style={{width:"100%",padding:"13px 16px",border:`2px solid ${C.brd}`,borderRadius:14,fontSize:15,fontFamily:FONT,outline:"none",boxSizing:"border-box",background:"#fff"}} onFocus={e=>e.target.style.borderColor=C.pri} onBlur={e=>e.target.style.borderColor=C.brd}/>}
function GridSelect({options,value,onChange,cols=2,ac=C.pri,acBg=C.priL}){return <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:10}}>{options.map(o=><button key={o} onClick={()=>onChange(o)} style={{padding:"12px 8px",borderRadius:14,border:`2px solid ${value===o?ac:C.brd}`,background:value===o?acBg:"#fff",color:value===o?ac:C.txt,fontSize:14,fontWeight:600,fontFamily:FONT,cursor:"pointer"}}>{o}</button>)}</div>}
 
function Picker({value,onChange,options,placeholder}){
  const [isOpen,setIsOpen]=useState(false);
  return <>
    <div onClick={()=>setIsOpen(true)} style={{width:"100%",padding:"13px 16px",border:`2px solid ${C.brd}`,borderRadius:14,fontSize:15,fontFamily:FONT,boxSizing:"border-box",background:"#fff",color:value?C.txt:C.mut,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span>{value||placeholder}</span>
      <svg width="16" height="16" fill="none" stroke={C.mut} strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
    </div>
    {isOpen&&<div onClick={()=>setIsOpen(false)} style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:"24px 24px 0 0",width:"100%",maxWidth:430,maxHeight:"70vh",display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 20px",borderBottom:`1px solid ${C.brd}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:17,fontWeight:800,color:C.txt,fontFamily:FONT}}>{placeholder}</span>
          <button onClick={()=>setIsOpen(false)} style={{background:C.srf,border:"none",borderRadius:10,padding:"6px 14px",fontSize:14,fontWeight:700,fontFamily:FONT,cursor:"pointer",color:C.mut}}>إغلاق</button>
        </div>
        <div style={{overflow:"auto",flex:1}}>{options.map(opt=><div key={opt} onClick={()=>{onChange(opt);setIsOpen(false)}} style={{padding:"14px 20px",fontSize:16,fontFamily:FONT,color:value===opt?C.pri:C.txt,background:value===opt?C.priL:"transparent",borderBottom:`1px solid ${C.brd}`,cursor:"pointer",fontWeight:value===opt?700:400,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span>{opt}</span>{value===opt&&<span style={{color:C.pri}}>✓</span>}</div>)}</div>
      </div>
    </div>}
  </>
}
 
function FileUpload({label,preview,onFile,icon="📷"}){const ref=useRef();return <div><input ref={ref} type="file" accept="image/*" onChange={e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=ev=>onFile(ev.target.result);r.readAsDataURL(f)}}} style={{display:"none"}}/><div onClick={()=>ref.current?.click()} style={{border:`2px dashed ${preview?C.pri:C.brd}`,borderRadius:18,padding:preview?0:28,cursor:"pointer",textAlign:"center",overflow:"hidden",background:preview?"#000":C.srf,minHeight:100,display:"flex",alignItems:"center",justifyContent:"center"}}>{preview?<img src={preview} alt="" style={{width:"100%",maxHeight:160,objectFit:"cover",borderRadius:16}}/>:<div><div style={{fontSize:28,marginBottom:6}}>{icon}</div><div style={{fontSize:13,color:C.mut}}>{label}</div></div>}</div></div>}
 
function LandingPage({onStart}){
  return <div style={{fontFamily:FONT,direction:"rtl",height:"100vh",overflow:"auto",background:C.crm}}><style>{GCSS}</style>
    <nav style={{padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:38,height:38,borderRadius:12,background:`linear-gradient(135deg,${C.pri},${C.priG})`,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:18}}>ك</div><span style={{fontSize:22,fontWeight:900,color:C.dk}}>كدّاد</span></div><button onClick={onStart} style={{padding:"10px 24px",background:C.dk,color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,fontFamily:FONT,cursor:"pointer"}}>سجّل الحين</button></nav>
    <div style={{padding:"40px 24px 56px",textAlign:"center"}}><div style={{fontSize:72,marginBottom:28}}>🚗💨📦</div><h1 style={{fontSize:34,fontWeight:900,color:C.dk,lineHeight:1.4,marginBottom:16}}>كل رحلة بين المدن<br/><span style={{color:C.pri}}>فرصة توصيل</span></h1><p style={{fontSize:16,color:C.mut,maxWidth:340,margin:"0 auto 32px",lineHeight:1.7}}>أرسل أغراضك مع مسافر — أسرع وأرخص</p><button onClick={onStart} style={{padding:"16px 36px",background:`linear-gradient(135deg,${C.pri},${C.priG})`,color:"#fff",border:"none",borderRadius:16,fontSize:17,fontWeight:800,fontFamily:FONT,cursor:"pointer"}}>ابدأ الحين 🚀</button></div>
    <div style={{padding:"44px 24px",background:"#fff"}}><h2 style={{fontSize:26,fontWeight:900,color:C.dk,textAlign:"center",marginBottom:32}}>ليش كدّاد؟</h2><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>{[["⚡","توصيل نفس اليوم"],["💰","سعر أقل"],["📦","أي حجم"],["🛡️","أمان وثقة"]].map(([ic,t],i)=><div key={i} style={{background:C.crm,borderRadius:20,padding:"24px 18px",textAlign:"center"}}><div style={{fontSize:32,marginBottom:10}}>{ic}</div><div style={{fontSize:15,fontWeight:800,color:C.dk}}>{t}</div></div>)}</div></div>
    <div style={{padding:"48px 24px 56px",background:C.dk,textAlign:"center"}}><h2 style={{fontSize:28,fontWeight:900,color:"#fff",marginBottom:12}}>جاهز تبدأ؟</h2><button onClick={onStart} style={{padding:"16px 48px",background:`linear-gradient(135deg,${C.pri},${C.priG})`,color:"#fff",border:"none",borderRadius:16,fontSize:17,fontWeight:800,fontFamily:FONT,cursor:"pointer"}}>سجّل الحين</button></div>
  </div>
}
 
function RoleSelectPage({onSelect,onBack}){
  return <div style={{minHeight:"100vh",background:`linear-gradient(165deg,${C.dk},${C.priD})`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:FONT,direction:"rtl"}}><style>{GCSS}</style>
    <div style={{textAlign:"center",marginBottom:36}}><div style={{fontSize:48,marginBottom:8}}>🚗📦</div><h1 style={{color:"#fff",fontSize:28,fontWeight:900}}>كيف تبغى تستخدم كدّاد؟</h1></div>
    <div style={{display:"flex",flexDirection:"column",gap:16,width:"100%",maxWidth:400}}>
      {[["sender","📦","أبغى أرسل غرض","أرسل أغراضي مع مسافر"],["driver","🚗","أبغى أكون كدّاد","أوصّل واكسب"]].map(([id,em,t,d])=><button key={id} onClick={()=>onSelect(id)} style={{display:"flex",alignItems:"center",gap:18,padding:"24px 22px",background:"rgba(255,255,255,0.06)",border:"2px solid rgba(255,255,255,0.1)",borderRadius:22,cursor:"pointer",textAlign:"right"}}><div style={{fontSize:44}}>{em}</div><div style={{flex:1}}><div style={{fontSize:18,fontWeight:800,color:"#fff",fontFamily:FONT}}>{t}</div><div style={{fontSize:13,color:"rgba(255,255,255,0.5)",fontFamily:FONT,marginTop:4}}>{d}</div></div></button>)}
    </div>
    <button onClick={onBack} style={{marginTop:20,background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:14,fontFamily:FONT,cursor:"pointer"}}>← رجوع</button>
  </div>
}
 
function RegisterPage({role,onComplete,onBack}){
  const [name,setName]=useState("");const [phone,setPhone]=useState("");const [email,setEmail]=useState("");const [age,setAge]=useState("");const [city,setCity]=useState("");
  const [carMake,setCarMake]=useState("");const [carModel,setCarModel]=useState("");const [carPlate,setCarPlate]=useState("");
  const [idPhoto,setIdPhoto]=useState(null);const [regPhoto,setRegPhoto]=useState(null);const [step,setStep]=useState(1);
  const isD=role==="driver";const basicOk=name.trim()&&phone.length>=9&&email.includes("@")&&age&&city;const driverOk=basicOk&&carMake&&carModel&&carPlate&&idPhoto&&regPhoto;
  const ac=isD?C.acc:C.pri;const ag=isD?C.accW:C.priG;const ud={name,phone,email,age,city,carMake,carModel,carPlate,role,idPhoto,regPhoto};
 
  if(step===1) return <div style={{minHeight:"100vh",background:C.bg,fontFamily:FONT,direction:"rtl"}}><style>{GCSS}</style>
    <div style={{padding:"20px 16px 30px",background:`linear-gradient(135deg,${ac},${ag})`,color:"#fff"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",fontSize:14,fontFamily:FONT,cursor:"pointer",marginBottom:12}}>← رجوع</button>
      <div style={{fontSize:36,marginBottom:8}}>{isD?"🚗":"📦"}</div><h1 style={{fontSize:24,fontWeight:900,margin:0}}>تسجيل {isD?"كدّاد":"مرسل"}</h1>
      <p style={{fontSize:14,opacity:0.8,margin:"6px 0 0"}}>{isD?"الخطوة ١ من ٢":"أدخل معلوماتك"}</p>
      {isD&&<div style={{display:"flex",gap:8,marginTop:14}}><div style={{flex:1,height:4,borderRadius:2,background:"#fff"}}/><div style={{flex:1,height:4,borderRadius:2,background:"rgba(255,255,255,0.3)"}}/></div>}
    </div>
    <div style={{padding:"0 20px 40px",marginTop:-10,background:C.bg,borderRadius:"20px 20px 0 0"}}>
      <FieldLabel required>الاسم الكامل</FieldLabel><TextInput placeholder="مثال: محمد أحمد" value={name} onChange={e=>setName(e.target.value)}/>
      <FieldLabel required>رقم الجوال</FieldLabel><TextInput placeholder="05XXXXXXXX" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))} type="tel" dir="ltr"/>
      <FieldLabel required>البريد الإلكتروني</FieldLabel><TextInput placeholder="example@email.com" value={email} onChange={e=>setEmail(e.target.value)} type="email" dir="ltr"/>
      <FieldLabel required>العمر</FieldLabel><Picker value={age} onChange={setAge} options={AGES} placeholder="اختر عمرك"/>
      <FieldLabel required>المدينة</FieldLabel><Picker value={city} onChange={setCity} options={SA_CITIES} placeholder="اختر مدينتك"/>
      <button onClick={()=>isD?setStep(2):onComplete(ud)} disabled={!basicOk} style={{width:"100%",padding:18,background:basicOk?`linear-gradient(135deg,${ac},${ag})`:C.brd,color:"#fff",border:"none",borderRadius:18,fontSize:17,fontWeight:700,fontFamily:FONT,cursor:basicOk?"pointer":"default",marginTop:28}}>{isD?"التالي — بيانات السيارة →":"إنشاء حساب ✨"}</button>
    </div></div>;
 
  return <div style={{minHeight:"100vh",background:C.bg,fontFamily:FONT,direction:"rtl"}}><style>{GCSS}</style>
    <div style={{padding:"20px 16px 30px",background:`linear-gradient(135deg,${C.acc},${C.accW})`,color:"#fff"}}>
      <button onClick={()=>setStep(1)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.7)",fontSize:14,fontFamily:FONT,cursor:"pointer",marginBottom:12}}>← رجوع</button>
      <div style={{fontSize:36,marginBottom:8}}>🚗</div><h1 style={{fontSize:24,fontWeight:900,margin:0}}>بيانات السيارة والتوثيق</h1>
      <p style={{fontSize:14,opacity:0.8,margin:"6px 0 0"}}>الخطوة ٢ من ٢</p>
      <div style={{display:"flex",gap:8,marginTop:14}}><div style={{flex:1,height:4,borderRadius:2,background:"#fff"}}/><div style={{flex:1,height:4,borderRadius:2,background:"#fff"}}/></div>
    </div>
    <div style={{padding:"0 20px 40px",marginTop:-10,background:C.bg,borderRadius:"20px 20px 0 0"}}>
      <FieldLabel required>شركة السيارة</FieldLabel><Picker value={carMake} onChange={setCarMake} options={CAR_MAKES} placeholder="اختر شركة السيارة"/>
      <FieldLabel required>موديل السيارة</FieldLabel><TextInput placeholder="مثال: كامري، هايلكس..." value={carModel} onChange={e=>setCarModel(e.target.value)}/>
      <FieldLabel required>رقم اللوحة</FieldLabel><TextInput placeholder="مثال: أ ب ج ١٢٣٤" value={carPlate} onChange={e=>setCarPlate(e.target.value)}/>
      <FieldLabel required>صورة الهوية</FieldLabel><FileUpload label="اضغط لرفع صورة الهوية" preview={idPhoto} onFile={setIdPhoto} icon="🪪"/>
      <FieldLabel required>صورة الاستمارة</FieldLabel><FileUpload label="اضغط لرفع الاستمارة" preview={regPhoto} onFile={setRegPhoto} icon="📄"/>
      <div style={{background:C.accL,borderRadius:16,padding:14,marginTop:20,fontSize:12,color:"#92400E",lineHeight:1.7}}>⚠️ سيتم مراجعة بياناتك خلال ٢٤ ساعة</div>
      <button onClick={()=>driverOk&&onComplete(ud)} disabled={!driverOk} style={{width:"100%",padding:18,background:driverOk?`linear-gradient(135deg,${C.acc},${C.accW})`:C.brd,color:"#fff",border:"none",borderRadius:18,fontSize:17,fontWeight:700,fontFamily:FONT,cursor:driverOk?"pointer":"default",marginTop:24}}>إنشاء حساب كدّاد 🚀</button>
    </div></div>;
}
 
function HomeScreen({navigate,role,orders,user}){const fn=user.name.split(" ")[0];return <div style={{padding:"20px 16px 100px",fontFamily:FONT,direction:"rtl"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}><div><h2 style={{margin:0,fontSize:24,fontWeight:800,color:C.txt}}>أهلاً {fn} 👋</h2><p style={{margin:"4px 0 0",fontSize:14,color:C.mut}}>{role==="sender"?"وش تبغى توصّل؟":"جاهز تكسب؟"}</p></div><Avatar letter={fn[0]} size={46}/></div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:28}}><button onClick={()=>navigate("createOrder")} style={{background:`linear-gradient(135deg,${C.pri},${C.priD})`,border:"none",borderRadius:20,padding:"28px 18px",cursor:"pointer",textAlign:"right"}}><div style={{fontSize:34,marginBottom:10}}>📦</div><div style={{color:"#fff",fontSize:16,fontWeight:700,fontFamily:FONT}}>أرسل غرض</div></button><button onClick={()=>navigate("addTrip")} style={{background:`linear-gradient(135deg,${C.acc},${C.accW})`,border:"none",borderRadius:20,padding:"28px 18px",cursor:"pointer",textAlign:"right"}}><div style={{fontSize:34,marginBottom:10}}>🚗</div><div style={{color:"#fff",fontSize:16,fontWeight:700,fontFamily:FONT}}>أضف رحلة</div></button></div>
  <h3 style={{margin:"0 0 14px",fontSize:17,fontWeight:700}}>آخر الطلبات</h3>
  {orders.slice(0,2).map(o=><div key={o.id} onClick={()=>navigate("orderDetail",o)} style={{background:C.card,borderRadius:18,padding:16,marginBottom:12,cursor:"pointer",border:`1px solid ${C.brd}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div><div style={{fontSize:15,fontWeight:700}}>{o.item}</div><div style={{fontSize:12,color:C.mut,marginTop:3}}>{o.from} → {o.to}</div></div><StatusBadge status={o.status}/></div><div style={{display:"flex",alignItems:"center",gap:10,paddingTop:10,borderTop:`1px solid ${C.brd}`}}><Avatar letter={o.traveler.avatar} size={30}/><span style={{fontSize:13,fontWeight:600}}>{o.traveler.name}</span><span style={{marginRight:"auto",fontSize:15,fontWeight:700,color:C.pri}}>{o.price} ر.س</span></div></div>)}
</div>}
 
function CreateOrderScreen({onBack,onSubmit}){const[item,si]=useState("");const[size,ss]=useState("");const[from,sf]=useState("");const[to,st]=useState("");const[delivery,sd]=useState("");const[price,sp]=useState("");const[fragile,sfr]=useState(false);const[agree,sa]=useState(false);const[image,sim]=useState(null);const[warn,sw]=useState(false);
  const ok=item&&size&&from&&to&&delivery&&image&&agree;
  if(warn) return <div style={{fontFamily:FONT,direction:"rtl",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:32,background:C.bg}}><div style={{background:"#fff",borderRadius:24,padding:32,maxWidth:400,width:"100%",textAlign:"center"}}><div style={{fontSize:56,marginBottom:16}}>⚠️</div><h2 style={{fontSize:22,fontWeight:800,margin:"0 0 12px"}}>تأكيد قبل النشر</h2><div style={{background:C.accL,borderRadius:16,padding:16,marginBottom:16,textAlign:"right"}}><ul style={{margin:0,paddingRight:20,fontSize:13,color:"#92400E",lineHeight:2}}><li>التغليف مسؤولية المرسل</li><li>كدّاد غير مسؤول عن الأغراض الغير مغلفة</li>{fragile&&<li style={{fontWeight:700}}>⚠️ قابل للكسر</li>}</ul></div><div style={{display:"flex",gap:12}}><button onClick={()=>sw(false)} style={{flex:1,padding:14,background:"none",border:`2px solid ${C.brd}`,borderRadius:14,fontSize:15,fontWeight:700,fontFamily:FONT,cursor:"pointer",color:C.mut}}>رجوع</button><button onClick={()=>onSubmit({item,size,from,to,delivery,price,fragile})} style={{flex:1,padding:14,background:C.pri,color:"#fff",border:"none",borderRadius:14,fontSize:15,fontWeight:700,fontFamily:FONT,cursor:"pointer"}}>تأكيد ✅</button></div></div></div>;
  return <div style={{fontFamily:FONT,direction:"rtl"}}><PageHeader title="إنشاء طلب جديد" onBack={onBack}/><div style={{padding:"4px 20px 120px"}}>
    <FieldLabel required>وصف الغرض</FieldLabel><TextInput placeholder="مثال: جوال، شنطة..." value={item} onChange={e=>si(e.target.value)}/>
    <FieldLabel required>صورة الغرض</FieldLabel><FileUpload label="اضغط لرفع صورة" preview={image} onFile={sim}/>
    <FieldLabel required>الحجم</FieldLabel><GridSelect options={SIZES} value={size} onChange={ss}/>
    <FieldLabel required>من مدينة</FieldLabel><Picker value={from} onChange={sf} options={SA_CITIES} placeholder="اختر مدينة الإرسال"/>
    <FieldLabel required>إلى مدينة</FieldLabel><Picker value={to} onChange={st} options={SA_CITIES} placeholder="اختر مدينة الاستلام"/>
    <FieldLabel required>نوع التسليم</FieldLabel><GridSelect options={DEL_TYPES} value={delivery} onChange={sd}/>
    <FieldLabel>السعر (اختياري)</FieldLabel><TextInput placeholder="اتركه فاضي للعروض" value={price} onChange={e=>sp(e.target.value.replace(/\D/g,""))} type="tel" dir="ltr"/>
    <div onClick={()=>sfr(!fragile)} style={{marginTop:20,display:"flex",alignItems:"center",gap:12,background:fragile?C.accL:"#fff",border:`2px solid ${fragile?C.acc:C.brd}`,borderRadius:16,padding:"14px 16px",cursor:"pointer"}}><span style={{fontSize:24}}>⚠️</span><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>قابل للكسر</div></div><div style={{width:44,height:24,borderRadius:12,background:fragile?C.acc:C.brd,padding:2,display:"flex",justifyContent:fragile?"flex-start":"flex-end"}}><div style={{width:20,height:20,borderRadius:10,background:"#fff"}}/></div></div>
    <div onClick={()=>sa(!agree)} style={{marginTop:14,display:"flex",alignItems:"flex-start",gap:12,cursor:"pointer"}}><div style={{width:24,height:24,borderRadius:8,border:`2px solid ${agree?C.pri:C.brd}`,background:agree?C.pri:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>{agree&&<svg width="14" height="14" fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}</div><div style={{fontSize:13,color:C.mut,lineHeight:1.7}}>أوافق على أن <strong style={{color:C.txt}}>التغليف مسؤوليتي</strong></div></div>
    <button onClick={()=>ok&&sw(true)} disabled={!ok} style={{width:"100%",padding:18,background:ok?C.pri:C.brd,color:"#fff",border:"none",borderRadius:18,fontSize:17,fontWeight:700,fontFamily:FONT,cursor:ok?"pointer":"default",marginTop:28}}>نشر الطلب 🚀</button>
  </div></div>
}
 
function AddTripScreen({onBack}){const[from,sf]=useState("");const[to,st]=useState("");const[time,sti]=useState("");const[space,ssp]=useState("");const[done,sd]=useState(false);
  if(done) return <div style={{fontFamily:FONT,direction:"rtl",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",padding:32,textAlign:"center"}}><div style={{fontSize:60,marginBottom:16}}>🎉</div><h2 style={{fontSize:22,fontWeight:800,margin:"0 0 8px"}}>تمت إضافة رحلتك!</h2><p style={{fontSize:14,color:C.mut,marginBottom:24}}>بنرسل لك إشعار لما يجيك طلب</p><button onClick={onBack} style={{padding:"14px 36px",background:C.pri,color:"#fff",border:"none",borderRadius:16,fontSize:15,fontWeight:700,fontFamily:FONT,cursor:"pointer"}}>الرئيسية</button></div>;
  const ok=from&&to&&space;
  return <div style={{fontFamily:FONT,direction:"rtl"}}><PageHeader title="أضف رحلة" onBack={onBack}/><div style={{padding:"4px 20px 120px"}}>
    <FieldLabel required>من مدينة</FieldLabel><Picker value={from} onChange={sf} options={SA_CITIES} placeholder="اختر مدينة الانطلاق"/>
    <FieldLabel required>إلى مدينة</FieldLabel><Picker value={to} onChange={st} options={SA_CITIES} placeholder="اختر مدينة الوصول"/>
    <FieldLabel>وقت الانطلاق</FieldLabel><input type="time" value={time} onChange={e=>sti(e.target.value)} style={{width:"100%",padding:"13px 16px",border:`2px solid ${C.brd}`,borderRadius:14,fontSize:16,fontFamily:FONT,outline:"none",boxSizing:"border-box"}}/>
    <FieldLabel required>المساحة</FieldLabel><GridSelect options={["شنطة صغيرة","شنطة كبيرة","حوض","سطحة"]} value={space} onChange={ssp} ac={C.acc} acBg={C.accL}/>
    <button onClick={()=>ok&&sd(true)} disabled={!ok} style={{width:"100%",padding:18,background:ok?`linear-gradient(135deg,${C.acc},${C.accW})`:C.brd,color:"#fff",border:"none",borderRadius:18,fontSize:17,fontWeight:700,fontFamily:FONT,cursor:ok?"pointer":"default",marginTop:28}}>نشر الرحلة 🚀</button>
  </div></div>
}
 
function OrderDetailScreen({order,onBack,onChat}){const steps=["تم الاستلام","بالطريق","وصل المدينة","تم التسليم"];const cur=steps.indexOf(order.status);
  return <div style={{fontFamily:FONT,direction:"rtl"}}><PageHeader title="تفاصيل الطلب" onBack={onBack}/><div style={{padding:"16px 16px 100px"}}>
    <div style={{background:C.card,borderRadius:20,padding:22,marginBottom:14,border:`1px solid ${C.brd}`}}><h3 style={{margin:"0 0 18px",fontSize:15,fontWeight:700}}>📍 تتبع</h3><div style={{paddingRight:28}}>{steps.map((s,i)=><div key={s} style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:i<3?24:0,position:"relative"}}><div style={{position:"absolute",right:-28,width:22,height:22,borderRadius:"50%",background:i<=cur?C.pri:C.brd,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>{i<=cur&&<div style={{width:7,height:7,borderRadius:"50%",background:"#fff"}}/>}</div>{i<3&&<div style={{position:"absolute",right:-18,top:22,width:2,height:24,background:i<cur?C.pri:C.brd}}/>}<span style={{fontSize:14,fontWeight:i<=cur?700:400,color:i<=cur?C.txt:C.mut}}>{s}</span></div>)}</div></div>
    <div style={{background:C.card,borderRadius:20,padding:18,marginBottom:14,border:`1px solid ${C.brd}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:13,color:C.mut}}>الغرض</span><span style={{fontSize:14,fontWeight:600}}>{order.item}</span></div><div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}><span style={{fontSize:13,color:C.mut}}>المسار</span><span style={{fontSize:14,fontWeight:600}}>{order.from} → {order.to}</span></div><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,color:C.mut}}>المبلغ</span><span style={{fontSize:18,fontWeight:800,color:C.pri}}>{order.price} ر.س</span></div></div>
    <div style={{background:C.card,borderRadius:20,padding:18,marginBottom:14,border:`1px solid ${C.brd}`,display:"flex",alignItems:"center",gap:14}}><Avatar letter={order.traveler.avatar} size={46} bg={C.priD}/><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{order.traveler.name}</div><div style={{fontSize:12,color:C.acc}}>⭐ {order.traveler.rating}</div></div><button onClick={onChat} style={{background:C.priL,border:"none",borderRadius:14,padding:"10px 14px",cursor:"pointer",color:C.pri,fontWeight:700,fontFamily:FONT,fontSize:13}}>💬 محادثة</button></div>
    {order.status==="بالطريق"&&<div style={{background:C.accL,borderRadius:20,padding:20,textAlign:"center",border:`2px dashed ${C.acc}`}}><div style={{fontSize:13,fontWeight:600,marginBottom:8}}>رمز التسليم</div><div style={{fontSize:34,fontWeight:900,color:C.acc,letterSpacing:10,direction:"ltr"}}>4829</div></div>}
  </div></div>
}
 
function ChatScreen({traveler,onBack}){const[messages,setMessages]=useState([{id:1,from:"them",text:"أهلاً أنا بالطريق",time:"4:15 م"},{id:2,from:"me",text:"تمام بانتظارك",time:"4:16 م"}]);const[input,setInput]=useState("");const endRef=useRef(null);const replyIdx=useRef(0);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"})},[messages]);
  const sendMsg=()=>{if(!input.trim())return;const now=new Date();const ts=`${now.getHours()%12||12}:${String(now.getMinutes()).padStart(2,"0")} ${now.getHours()>=12?"م":"ص"}`;setMessages(p=>[...p,{id:Date.now(),from:"me",text:input,time:ts}]);setInput("");setTimeout(()=>{setMessages(p=>[...p,{id:Date.now()+1,from:"them",text:AUTO_REPLIES[replyIdx.current%AUTO_REPLIES.length],time:ts}]);replyIdx.current++},1200)};
  return <div style={{fontFamily:FONT,direction:"rtl",display:"flex",flexDirection:"column",height:"100vh"}}>
    <div style={{padding:"12px 16px",background:"#fff",borderBottom:`1px solid ${C.brd}`,display:"flex",alignItems:"center",gap:12}}><button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",display:"flex",padding:4}}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg></button><Avatar letter={traveler.avatar} size={38} bg={C.priD}/><div><div style={{fontSize:15,fontWeight:700}}>{traveler.name}</div><div style={{fontSize:11,color:C.ok}}>● متصل</div></div></div>
    <div style={{background:C.accL,padding:"8px 16px",display:"flex",alignItems:"center",gap:8}}><span>⚠️</span><span style={{fontSize:11,color:"#92400E",fontWeight:600}}>كدّاد غير مسؤول عن محادثات خارج التطبيق</span></div>
    <div style={{flex:1,overflow:"auto",padding:16,background:C.srf}}>{messages.map(m=><div key={m.id} style={{display:"flex",justifyContent:m.from==="me"?"flex-start":"flex-end",marginBottom:10}}><div style={{maxWidth:"75%",background:m.from==="me"?C.pri:"#fff",color:m.from==="me"?"#fff":C.txt,padding:"11px 15px",borderRadius:m.from==="me"?"16px 16px 4px 16px":"16px 16px 16px 4px"}}><div style={{fontSize:14,lineHeight:1.6}}>{m.text}</div><div style={{fontSize:10,opacity:0.5,marginTop:3}}>{m.time}</div></div></div>)}<div ref={endRef}/></div>
    <div style={{padding:"10px 16px",background:"#fff",borderTop:`1px solid ${C.brd}`,display:"flex",gap:10}}><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="اكتب رسالتك..." style={{flex:1,padding:"12px 16px",border:`2px solid ${C.brd}`,borderRadius:20,fontSize:14,fontFamily:FONT,outline:"none"}}/><button onClick={sendMsg} style={{background:C.pri,border:"none",borderRadius:"50%",width:46,height:46,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff",flexShrink:0}}><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg></button></div>
  </div>
}
 
function ProfileScreen({user,role,onLogout,onSwitch}){return <div style={{fontFamily:FONT,direction:"rtl",padding:"24px 16px 100px"}}>
  <div style={{textAlign:"center",marginBottom:28}}><Avatar letter={user.name[0]} size={72}/><h2 style={{margin:"14px 0 4px",fontSize:21,fontWeight:800}}>{user.name}</h2><p style={{margin:0,fontSize:13,color:C.mut}}>{user.phone} · {user.email}</p><p style={{margin:"4px 0 0",fontSize:12,color:C.mut}}>{user.city}</p><div style={{display:"inline-block",background:role==="sender"?C.priL:C.accL,color:role==="sender"?C.pri:"#92400E",padding:"4px 14px",borderRadius:10,fontSize:12,fontWeight:700,marginTop:8}}>{role==="sender"?"📦 مرسل":"🚗 كدّاد"}</div>{role==="driver"&&user.carMake&&<p style={{margin:"8px 0 0",fontSize:13,color:C.mut}}>{user.carMake} {user.carModel} · {user.carPlate}</p>}</div>
  {[["💳","المحفظة","350 ر.س"],["⭐","التقييمات","عرض الكل"],["🔔","الإشعارات","مفعّلة"],["🛡️","الأمان","توثيق الهوية"],["❓","المساعدة","تواصل معنا"]].map(([ic,l,d],i)=><div key={i} style={{background:C.card,borderRadius:16,padding:"14px 16px",marginBottom:8,border:`1px solid ${C.brd}`,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}><span style={{fontSize:22}}>{ic}</span><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{l}</div><div style={{fontSize:12,color:C.mut}}>{d}</div></div></div>)}
  <button onClick={onSwitch} style={{width:"100%",marginTop:16,padding:14,background:C.srf,border:`1px solid ${C.brd}`,borderRadius:16,fontSize:14,fontWeight:700,fontFamily:FONT,cursor:"pointer",color:C.txt}}>🔄 تبديل لوضع {role==="sender"?"الكدّاد":"المرسل"}</button>
  <button onClick={onLogout} style={{width:"100%",marginTop:8,padding:14,background:"none",border:`2px solid ${C.err}`,borderRadius:16,color:C.err,fontSize:15,fontWeight:700,fontFamily:FONT,cursor:"pointer"}}>تسجيل خروج</button>
</div>}
 
export default function KaddadApp(){
  const[phase,setPhase]=useState("landing");const[role,setRole]=useState("sender");const[screen,setScreen]=useState("home");const[screenData,setScreenData]=useState(null);const[orders,setOrders]=useState(INIT_ORDERS);const[user,setUser]=useState(null);
  const navigate=(t,d=null)=>{setScreen(t);setScreenData(d)};const goHome=()=>navigate("home");
 
  if(phase==="landing") return <LandingPage onStart={()=>setPhase("roleSelect")}/>;
  if(phase==="roleSelect") return <RoleSelectPage onSelect={r=>{setRole(r);setPhase("register")}} onBack={()=>setPhase("landing")}/>;
  if(phase==="register") return <RegisterPage role={role} onComplete={u=>{setUser(u);setPhase("app");navigate("home")}} onBack={()=>setPhase("roleSelect")}/>;
 
  const tabs=role==="sender"?[["home","🏠","الرئيسية"],["orders","📋","طلباتي"],["createOrder","➕","طلب جديد"],["chatList","💬","محادثات"],["profile","👤","حسابي"]]:[["home","🏠","الرئيسية"],["orders","📋","الطلبات"],["addTrip","➕","أضف رحلة"],["chatList","💬","محادثات"],["profile","👤","حسابي"]];
 
  const renderScreen=()=>{switch(screen){
    case "home": return <HomeScreen navigate={navigate} role={role} orders={orders} user={user}/>;
    case "createOrder": return <CreateOrderScreen onBack={goHome} onSubmit={d=>{setOrders([{id:Date.now(),status:"بانتظار القبول",traveler:TRAVELERS[0],date:"اليوم",price:d.price||75,...d},...orders]);navigate("travelers")}}/>;
    case "travelers": return <div style={{fontFamily:FONT,direction:"rtl"}}><PageHeader title="المسافرين" onBack={goHome}/><div style={{padding:"12px 16px 100px"}}>{TRAVELERS.map(t=><div key={t.id} onClick={()=>navigate("orderDetail",{...orders[0],traveler:t})} style={{background:C.card,borderRadius:20,padding:18,marginBottom:14,cursor:"pointer",border:`1px solid ${C.brd}`}}><div style={{display:"flex",gap:14}}><Avatar letter={t.avatar} size={50} bg={C.priD}/><div style={{flex:1}}><div style={{fontSize:16,fontWeight:700,marginBottom:5}}>{t.name} <span style={{fontSize:12,color:C.acc}}>⭐ {t.rating}</span></div><div style={{fontSize:13,color:C.mut}}>{t.from} → {t.to} · {t.time}</div></div><div style={{textAlign:"center",background:C.priL,borderRadius:14,padding:"10px 14px"}}><div style={{fontSize:20,fontWeight:800,color:C.pri}}>{t.price}</div><div style={{fontSize:10,color:C.priD}}>ر.س</div></div></div></div>)}</div></div>;
    case "orderDetail": return <OrderDetailScreen order={screenData||orders[0]} onBack={goHome} onChat={()=>navigate("chat",(screenData||orders[0]).traveler)}/>;
    case "chat": case "chatList": return <ChatScreen traveler={screenData||TRAVELERS[0]} onBack={goHome}/>;
    case "orders": return <div style={{fontFamily:FONT,direction:"rtl"}}><PageHeader title="طلباتي" onBack={goHome}/><div style={{padding:"12px 16px 100px"}}>{orders.map(o=><div key={o.id} onClick={()=>navigate("orderDetail",o)} style={{background:C.card,borderRadius:18,padding:16,marginBottom:12,cursor:"pointer",border:`1px solid ${C.brd}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><div><div style={{fontSize:15,fontWeight:700}}>{o.item}</div><div style={{fontSize:12,color:C.mut,marginTop:3}}>{o.from} → {o.to}</div></div><StatusBadge status={o.status}/></div><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${C.brd}`}}><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar letter={o.traveler.avatar} size={26}/><span style={{fontSize:12,color:C.mut}}>{o.traveler.name}</span></div><span style={{fontSize:15,fontWeight:700,color:C.pri}}>{o.price} ر.س</span></div></div>)}</div></div>;
    case "addTrip": return <AddTripScreen onBack={goHome}/>;
    case "profile": return <ProfileScreen user={user} role={role} onLogout={()=>{setPhase("landing");setUser(null)}} onSwitch={()=>setRole(role==="sender"?"driver":"sender")}/>;
    default: return <HomeScreen navigate={navigate} role={role} orders={orders} user={user}/>;
  }};
 
  return <div style={{maxWidth:430,margin:"0 auto",background:C.bg,minHeight:"100vh",position:"relative"}}><style>{GCSS}</style>{renderScreen()}{!["chat","chatList"].includes(screen)&&<div style={{position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:`1px solid ${C.brd}`,display:"flex",justifyContent:"space-around",padding:"8px 0 12px",zIndex:100,fontFamily:FONT}}>{tabs.map(([id,emoji,label])=><button key={id} onClick={()=>navigate(id)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,color:screen===id?C.pri:C.mut,fontFamily:FONT}}><span style={{fontSize:20,transform:screen===id?"scale(1.2)":"scale(1)",transition:"transform .15s"}}>{emoji}</span><span style={{fontSize:10,fontWeight:screen===id?700:500}}>{label}</span></button>)}</div>}</div>;
}
 