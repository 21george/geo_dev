"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  {label:"PORTFOLIO",href:"/#work"},
  {label:"ABOUT",href:"/#about"},
  {label:"SERVICES",href:"/services"},
  {label:"RATES",href:"/rates"},
  {label:"CONTACT",href:"/contact?type=message"},
];

export default function SiteHeader() {
  const pathname=usePathname();
  const [open,setOpen]=useState(false);
  useEffect(()=>{setOpen(false)},[pathname]);
  useEffect(()=>{
    if(!open)return;
    const onKey=(event:KeyboardEvent)=>{if(event.key==="Escape")setOpen(false)};
    document.addEventListener("keydown",onKey);
    const oldOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    return()=>{document.body.style.overflow=oldOverflow;document.removeEventListener("keydown",onKey)};
  },[open]);
  return <header className="header">
    <Link href="/" className="logo brand-logo" aria-label="geo_dev home" onClick={()=>setOpen(false)}><span className="brand-mark" aria-hidden="true"/><span>geo_dev</span></Link>
    <nav id="main-navigation" className={open?"nav open":"nav"} aria-label="Main navigation">
      {nav.map(item=><Link key={item.label} href={item.href} className={pathname===item.href.split("?")[0]?"nav-active":""} onClick={()=>setOpen(false)}>{item.label}</Link>)}
      <Link href="/contact?type=call" className="nav-mobile-cta" onClick={()=>setOpen(false)}>SCHEDULE A CALL ↗</Link>
    </nav>
    <Link href="/contact?type=call" className="available">SCHEDULE A CALL</Link>
    <button type="button" aria-label={open?"Close menu":"Open menu"} aria-expanded={open} aria-controls="main-navigation" className="menu-btn" onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
  </header>;
}
