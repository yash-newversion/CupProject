import React, { useState } from 'react';
import { Flame, Shield, Leaf, Heart, Sparkles, Coffee, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

export default function OurCraftPage({ onExploreCatalogue }) {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "How does the cup resist boiling coffee without getting soggy?",
      a: "Our vessels utilize a proprietary double-tier baking technique. Stone-milled ancient oat dough is baked to high micron density, followed by an inner glaze of tempered single-origin Belgian cocoa butter. This creates a natural hydrophobic barrier that preserves crispness for over 45 minutes at temperatures up to 85°C."
    },
    {
      q: "Are Cup2Eat vessels 100% vegan and eggless?",
      a: "Yes! Every single Cup2Eat cookie cup is certified 100% eggless, free of animal gelatins, palm oil, and artificial trans-fats. Our dark chocolate formulations are completely plant-based."
    },
    {
      q: "How long do the cookie cups stay fresh after delivery?",
      a: "Every cup is individually nitrogen-sealed in biodegradable barrier pouches immediately after baking in our Bengaluru atelier. Unopened, they retain full artisanal crispness and aroma for up to 6 months at room temperature."
    },
    {
      q: "Can I serve drinks other than coffee in these vessels?",
      a: "Absolutely. Connoisseurs frequently enjoy hot chocolate, matcha lattes, spiced chai, cold brew, affogato scoops, or artisanal dessert cocktails in Cup2Eat vessels."
    }
  ];

  return (
    <main className="flex-1 pb-24 bg-[#FAF7F0]">
      {/* Craft Hero Banner */}
      <section className="bg-gradient-to-b from-[#F2EEDB] to-[#FAF7F0] border-b border-[#E8E1CE] pt-12 sm:pt-16 pb-14 px-4 sm:px-8">
        <div className="max-w-[1120px] mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8ECD9] text-[#42531F] text-xs font-semibold border border-[#D5DFC0]">
            <Sparkles className="w-3.5 h-3.5 text-[#845E18]" />
            <span>Tactile Organic Modernism • Grounded Luxury</span>
          </div>

          <h1 className="font-headline-lg text-3xl sm:text-5xl font-bold text-on-surface max-w-3xl mx-auto leading-tight">
            The Craft of Edible Culinary Vessels
          </h1>

          <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Eliminating paper cups and plastic lids not by sacrifice, but through culinary elevation. We turn the cup into the sweetest finale of your daily coffee ceremony.
          </p>
        </div>
      </section>

      {/* Philosophy Chapters */}
      <section className="max-w-[1120px] mx-auto px-4 sm:px-8 pt-12 space-y-16">
        {/* Chapter 1: The Flour & Heat Resistance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Chapter 01 • The Thermal Barrier
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface leading-snug">
              Engineered to Hold 85°C Hot Espresso for 45 Minutes
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Standard wafer cups crumble or leach within three minutes. Our atelier solved this through 14 months of food science research, combining whole rolled oat fibers with high-density pressure baking.
            </p>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              As hot espresso rests in the cup, the Belgian cocoa lining softens gently—releasing delicate aromatic dark chocolate notes into your coffee crema without letting any liquid seep into the biscuit shell.
            </p>

            <div className="flex gap-4 pt-2">
              <div className="bg-white p-3 rounded-xl border border-[#DFD8BF] text-xs font-semibold text-primary flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>85°C Thermal Resistance</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#DFD8BF] text-xs font-semibold text-primary flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#596B35]" />
                <span>Zero Leaks Guaranteed</span>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 rounded-3xl overflow-hidden shadow-lg border border-[#DFD8BF] bg-[#F2EEDB]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDorONUg1DfOLFEiqSn40Y6F7eIBSdKX5A4u1sTzfQSvYNhR2CDC93eszsVzYsqYO7rfZ0e14svA6eHm9-8C64Jkjn1tYXayu25c0Hc6IIzQU110mak5sU-vVsJdF7c5JPE3CGZ_amtYPkqFlCBTDRHspb2TrUJ4Kpu4r4Sl1DBq7Hgz9uZKlFEK8y2KThxiHY58bEL7jN0R3F2XenSXARM4MLnvf0PCOIM2SYMADQ"
              alt="Artisanal edible cups holding steaming espresso"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>

        {/* Chapter 2: The Sustainable Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="rounded-3xl overflow-hidden shadow-lg border border-[#DFD8BF] bg-[#F2EEDB]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAa7ftHKZsWqcqQ8zqaSt1PxdR6aD30y2dTDuntx1BjROvnrvS2GtdiHoHuaQo8m647msxT1JLHkXTsFxZf9h1pNdOTMr6PfvuhxM1k5EISOB4G8dB9uskR81OzKI6341RLqheu21b-IW2SV8E132BuJqnFok5mTgPCapWxB7_g9fGfngP7Nt_DZNBJDpHAvS0OdXUsPyZdAnaAcGSWRTTKvBLMAyhwZPQXd44poEo"
              alt="Crispy cookie cups styled with hot coffee being poured from copper pot"
              className="w-full h-80 object-cover"
            />
          </div>

          <div className="space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Chapter 02 • Zero Waste Philosophy
            </span>
            <h2 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface leading-snug">
              Over 500 Billion Disposable Cups Are Discarded Annually
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Most disposable paper coffee cups are coated with thin polyethylene plastic liners, making recycling nearly impossible. They end up in oceans and landfills for centuries.
            </p>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Cup2Eat removes the waste equation completely: your cup IS the snack. When you finish your coffee, you enjoy a freshly baked cookie vessel that was protecting your drink moments ago.
            </p>

            <button
              onClick={onExploreCatalogue}
              className="mt-2 inline-flex items-center gap-2 bg-primary hover:bg-[#344218] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md"
            >
              <span>Explore Tasting Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl border border-[#DFD8BF] p-8 sm:p-12 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-primary">
              Got Questions?
            </span>
            <h3 className="font-headline-lg text-2xl sm:text-3xl font-bold text-on-surface">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="divide-y divide-[#F2EEDB] max-w-3xl mx-auto pt-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="py-4">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full text-left flex items-center justify-between gap-4 font-bold text-sm text-on-surface hover:text-primary transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-primary shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-on-surface-variant shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed pl-1">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
