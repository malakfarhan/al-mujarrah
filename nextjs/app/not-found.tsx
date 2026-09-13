import Link from "next/link";
import Container from "@/components/shared/Container";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-[#06101d] text-white"><Container className="text-center"><span className="text-sm font-extrabold uppercase tracking-[.2em] text-teal">404</span><h1 className="mt-4 font-display text-6xl font-semibold tracking-[-.05em]">Page not found.</h1><p className="mx-auto mt-4 max-w-xl text-[#9fb2c7]">The page you requested does not exist or has moved.</p><Link href="/" className="mt-8 inline-flex rounded-[14px] bg-gradient-to-r from-teal to-[#67dfcb] px-5 py-3.5 text-sm font-extrabold text-[#052118]">Back to website</Link></Container></main>;
}
