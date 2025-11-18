"use client";

import { useEffect } from "react";
import UnderConstructionBanner from "./components/UnderConstructionBanner";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MumbisStory from "./components/MumbisStory";
import LiveStream from "./components/LiveStream";
import Gallery from "./components/Gallery";
import TributesList from "./components/TributesList";
import TributeForm from "./components/TributeForm";
import Contribute from "./components/Contribute";
import Footer from "./components/Footer";
import FloatingTributeButton from "./components/FloatingTributeButton";

export default function Home() {
  useEffect(() => {
    // Handle hash navigation after auth redirect
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
        // Clean up URL
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <MumbisStory />
        <LiveStream videoId={process.env.NEXT_PUBLIC_YOUTUBE_LIVE_ID} />
        <Gallery />
        <TributesList />
        <TributeForm onTributeSubmitted={() => {
          // Refresh tributes list when a new tribute is submitted
          if (typeof window !== 'undefined' && (window as any).refreshTributes) {
            (window as any).refreshTributes();
          }
        }} />
        <Contribute />
      </main>
      <Footer />
      <FloatingTributeButton />
    </>
  );
}
