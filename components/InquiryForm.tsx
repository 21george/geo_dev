"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, CalendarDays, Mail, CheckCircle2 } from "lucide-react";

type Mode = "call" | "message";
type FormState = {
  name: string; email: string; company: string; message: string;
  date: string; time: string; privacyConsent: boolean; website: string;
};
const initial: FormState = {
  name:"",email:"",company:"",message:"",date:"",time:"",privacyConsent:false,website:"",
};
const slots = Array.from({length:18},(_,i)=>{
  const hour=9+Math.floor(i/2);
  return `${String(hour).padStart(2,"0")}:${i%2?"30":"00"}`;
});

export default function InquiryForm() {
  const [mode,setMode]=useState<Mode>("call");
  const [form,setForm]=useState<FormState>(initial);
  const [submitting,setSubmitting]=useState(false);
  const [feedback,setFeedback]=useState<{ok:boolean;text:string}|null>(null);
  const started=useRef(Date.now());
  useEffect(()=>{
    if(new URLSearchParams(window.location.search).get("type")==="message")setMode("message");
  },[]);
  const dateParts=new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Berlin",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
  const dateMap=Object.fromEntries(dateParts.map(({type,value})=>[type,value]));
  const today=`${dateMap.year}-${dateMap.month}-${dateMap.day}`;

  function switchMode(next:Mode) {
    setMode(next);setFeedback(null);started.current=Date.now();
  }
  function update<K extends keyof FormState>(key:K,value:FormState[K]) {
    setForm(s=>({...s,[key]:value}));setFeedback(null);
  }
  async function submit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(submitting)return;
    setSubmitting(true);setFeedback(null);
    try {
      const response=await fetch("/api/inquiries",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({...form,type:mode,formStartedAt:started.current}),
      });
      const result=await response.json();
      if(!response.ok)throw new Error(result.error||"Unable to submit. Please try again.");
      setFeedback({ok:true,text:mode==="call"
        ?"Your call request has been received. George will review the time and confirm it with you."
        :"Thank you! Your message has been received."});
      if(result.notification==="failed")setFeedback({ok:true,text:"Your request was saved successfully. Email notification is temporarily unavailable; George will need to review the stored requests."});
      setForm(initial);started.current=Date.now();
    } catch(error) {
      setFeedback({ok:false,text:error instanceof Error?error.message:"Something went wrong. Please try again."});
    } finally {setSubmitting(false);}
  }

  return <div className="inquiry-panel">
    <div className="inquiry-tabs" role="tablist" aria-label="Contact options">
      <button type="button" role="tab" aria-selected={mode==="call"} className={mode==="call"?"active":""} onClick={()=>switchMode("call")}><CalendarDays size={16}/> Schedule a call</button>
      <button type="button" role="tab" aria-selected={mode==="message"} className={mode==="message"?"active":""} onClick={()=>switchMode("message")}><Mail size={16}/> Send a message</button>
    </div>
    <p className="inquiry-explainer">{mode==="call"
      ?"Request a 30-minute introductory call. Times are in Munich (Europe/Berlin). Your appointment is not confirmed until George replies."
      :"Tell me a little about your website, application or business idea. I'll get back to you by email."}</p>
    <form onSubmit={submit} className="inquiry-form">
      <div className="inquiry-two">
        <label>Full name <input required type="text" autoComplete="name" minLength={2} maxLength={100} value={form.name} onChange={e=>update("name",e.target.value)} placeholder="Your name"/></label>
        <label>Email address <input required type="email" autoComplete="email" maxLength={254} value={form.email} onChange={e=>update("email",e.target.value)} placeholder="you@example.com"/></label>
      </div>
      <label>Company <span>(optional)</span><input type="text" autoComplete="organization" maxLength={120} value={form.company} onChange={e=>update("company",e.target.value)} placeholder="Company or project name"/></label>
      {mode==="call"&&<div className="inquiry-two">
        <label>Preferred date <input required type="date" min={today} value={form.date} onChange={e=>update("date",e.target.value)}/></label>
        <label>Preferred time <select required value={form.time} onChange={e=>update("time",e.target.value)}><option value="">Choose a time</option>{slots.map(time=><option key={time} value={time}>{time} — Munich time</option>)}</select></label>
      </div>}
      <label>{mode==="call"?"What would you like to discuss? (optional)":"How can I help?"}
        <textarea required={mode==="message"} minLength={mode==="message"?10:undefined} maxLength={5000} rows={5} value={form.message} onChange={e=>update("message",e.target.value)} placeholder={mode==="call"?"A short overview of your project...":"Tell me about your idea, goals and timeline..."}/>
      </label>
      <div className="honeypot" aria-hidden="true"><label>Website <input tabIndex={-1} autoComplete="off" value={form.website} onChange={e=>update("website",e.target.value)}/></label></div>
      <label className="inquiry-consent"><input required type="checkbox" checked={form.privacyConsent} onChange={e=>update("privacyConsent",e.target.checked)}/><span>I agree that my details will be stored and used to respond to my enquiry. No marketing messages.</span></label>
      <button type="submit" disabled={submitting} className="inquiry-submit">{submitting?"Submitting...":mode==="call"?"REQUEST A CALL":"SEND MESSAGE"}<ArrowUpRight size={18}/></button>
      {feedback&&<div className={feedback.ok?"inquiry-feedback success":"inquiry-feedback error"} role="status">{feedback.ok&&<CheckCircle2 size={18}/>}<span>{feedback.text}</span></div>}
    </form>
  </div>;
}
