import Link from "next/link";
export default function PageFooter(){
  return <footer><Link href="/" className="logo">geo_dev — FREELANCE DEVELOPER</Link><div><Link href="/services">Services</Link><Link href="/rates">Rates</Link><Link href="/contact?type=message">Contact</Link></div><span>© {new Date().getFullYear()} George · Munich, Germany</span></footer>;
}
