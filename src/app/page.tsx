"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import ServiceCard from "../components/ServiceCard";
import CTA from "../components/CTA";
import SectionWrapper from "../components/SectionWrapper";
import ProblemAgitation from "../components/ProblemAgitation";
import Transformation from "../components/Transformation";
import Testimonials from "../components/Testimonials";
import PricingTable from "../components/PricingTable";
import AboutSection from "../components/AboutSection";
import AccordionFAQ from "../components/AccordionFAQ";
import Navigation from "../components/Navigation";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className={`fixed top-0 left-0 w-full bg-white z-50 transition-all duration-300 ${isScrolled ? 'shadow-md py-2' : 'py-4 md:py-6'}`}>
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <a href="#" className={`text-2xl font-bold z-50 flex items-center transition-all duration-300 ${isScrolled ? 'scale-90' : ''}`}>
              <span className="text-[#B9FF66] mr-1">&gt;</span>Precision Data
            </a>
            <Navigation 
              items={[
                { label: 'Home', href: '#' },
                { label: 'Testimonials', href: '#testimonials' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'About', href: '#about' },
                { label: 'FAQ', href: '#faq' },
                { label: 'Contact', href: '#contact' },
              ]}
            />
            <a href="#pricing" className={`hidden md:block btn btn-primary transition-all duration-300 ${isScrolled ? 'py-2 px-5 text-sm' : 'py-2.5 px-6'}`}>Get Started</a>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-24"></div>

      {/* Hero Section - Enhanced with stronger value prop and better visuals */}
      <SectionWrapper>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6">Target the Right Homeowners Every Time with Zillow Data.</h1>
            <p className="text-xl text-gray-700 mb-8">
              Instantly enrich your mailing lists with Zillow's real estate data, helping you segment audiences and deliver targeted offers based on home values, ownership status, and more.
            </p>
            <div className="flex flex-col gap-4">
              <a href="#pricing" className="inline-flex items-center justify-center px-8 py-4 bg-[#B9FF66] text-black font-medium rounded-lg hover:bg-opacity-90 transition-colors w-fit">
                Get Your Free Sample
              </a>
              
              <div className="flex flex-col gap-4 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-gray-700 italic">"By using the data to quickly create three segments, donations went from $9,000 in the previous year's mailing to $22,000 - an astonishing 144% increase!"</p>
                <p className="font-medium">— Meredith Poling, MBA, Vice President | Propeller Consulting</p>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] rounded-3xl overflow-hidden border border-gray-200">
            {/* Video demo of Zillow data enrichment */}
            <div className="absolute inset-0 w-full h-full overflow-hidden bg-black" id="videoContainer">
              {/* Video content - will be replaced with different URLs based on status */}
              <div id="videoWrapper" className="absolute" style={{
                top: '-35%',
                left: '-7%',
                width: '114%',
                height: '170%',
                overflow: 'hidden',
              }}>
                <iframe
                  id="videoIframe"
                  key="videoIframe"
                  src="https://customer-cajhg5znip2cupqy.cloudflarestream.com/70491eacc189fde49eda273e5fa59e8b/iframe?preload=true&autoplay=true&muted=1&loop=1&poster=https%3A%2F%2Fcustomer-cajhg5znip2cupqy.cloudflarestream.com%2F70491eacc189fde49eda273e5fa59e8b%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600&controls=true"
                  style={{
                    border: 'none',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    transform: 'scale(1.2)'
                  }}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen={true}
                ></iframe>
              </div>
              
              {/* Using native Cloudflare Stream controls instead of custom ones */}
              
              {/* Using native Cloudflare Stream controls */}
              
            </div>
          </div>
        </div>
      </SectionWrapper>
      
      {/* Problem Agitation Section */}
      <SectionWrapper background="light" id="problem">
        <ProblemAgitation 
          heading="The Traditional Marketing Struggle"
          subheading="Many businesses waste resources on generic marketing approaches that fail to deliver consistent results."
          painPoints={[
            {
              title: "Start with broad targeting",
              description: "Mail generic offers without clear demographic insights."
            },
            {
              title: "Low response rates",
              description: "Recipients find offers irrelevant, leading to poor engagement."
            },
            {
              title: "Wasted marketing budget",
              description: "Spend unnecessarily on ineffective mailings to uninterested audiences."
            },
            {
              title: "Repeat the cycle",
              description: "Frustration leads to repeating the process, hoping for better results without improving data usage."
            }
          ]}
        />
        <div className="text-center mt-8 mb-[-8]">
          <p className="text-3xl font-medium">There is a better way ↓</p>
        </div>
      </SectionWrapper>
      
      {/* Transformation Section */}
      <SectionWrapper id="solution">
        <Transformation 
          heading="Transform Your Direct Mail with Zillow Data"
          subheading="Leverage property insights to create more targeted, effective campaigns that deliver measurable results."
          benefits={[
            {
              title: "Better Targeting",
              description: "Precisely segment your audience by enriching your existing address data with detailed Zillow real estate insights and demographic characteristics, ensuring your direct mail campaigns reach the most receptive audience."
            },
            {
              title: "Enhanced ROI on Marketing Spend",
              description: "Reduce wasted marketing dollars by strategically targeting leads based on accurate home-value and demographic insights."
            },
            {
              title: "In-depth Customer Understanding",
              description: "Uncover detailed demographic and real estate profiles of your audience, allowing personalized communication and stronger engagement."
            }
          ]}
          illustrationTitle="How Zillow Data Transforms Your Campaigns"
          illustrationCaption="Watch how raw address data becomes targeted, high-performing direct mail campaigns through Zillow's property insights"
        />
      </SectionWrapper>

      {/* Social Proof - Testimonials Section */}
      <SectionWrapper background="light" id="testimonials">
        <Testimonials 
          heading="What Our Clients Say"
          subheading="Real results from businesses using our Zillow data enrichment services."
          testimonials={[
            {
              quote: "Peter's Zillow data scraper has been a game-changer for our real estate business. It's incredibly efficient and allows us to quickly gather the data we need to make informed decisions.",
              highlight: "The time we've saved has been invaluable. Highly recommend it!",
              name: "Seth Choate",
              title: "Founder",
              company: "Apex Home Advisors and Keller Williams Real Estate",
              image: "/images/social-media-illustration.png",
              rating: 5
            },
            {
              quote: "As a consultant specializing in nonprofit fundraising, I'm always on the lookout for cost-effective ways to help my clients maximize their campaign results. While wealth screening is the go-to solution in our industry, its high cost can be a barrier.",
              highlight: "By using the data to quickly create three segments, donations went from $9,000 in the previous year's mailing to $22,000 - an astonishing 144% increase!",
              name: "Meredith Poling, MBA",
              title: "Vice President",
              company: "Propeller Consulting",
              image: "/images/browser-window-illustration.png",
              rating: 5
            },
            {
              quote: "We've been using this real estate data service for our direct mail campaigns for over two months now. The ROI has been so significant that we've made it a core part of our marketing strategy.",
              name: "Marketing Director",
              title: "Law Firm",
              company: "Premium Client",
              image: "/images/search-illustration.png",
              rating: 5
            }
          ]}
          endorsements={[]}
        />
      </SectionWrapper>
      
      {/* Pricing Section */}
      <SectionWrapper id="pricing">
        <PricingTable 
          heading="Transparent Pricing"
          subheading="Choose the plan that fits your direct mail campaign needs."
          tiers={[
            {
              name: "Starter",
              description: "Perfect for small businesses beginning with targeted direct mail",
              price: {
                monthly: 697,
                annually: 7667,
              },
              features: [
                { text: "20,000 records per month", included: true },
                { text: "4-hour turnaround during business hours", included: true },
                { text: "Home value & property data enrichment", included: true },
                { text: "Email delivery of processed files", included: true },
                { text: "API access", included: false },
                { text: "Custom integrations", included: false },
              ],
              buttonText: "Get Started",
              highlighted: false,
            },
            {
              name: "Growth",
              description: "For businesses scaling their direct mail campaigns with data enrichment",
              price: {
                monthly: 1297,
                annually: 14267,
              },
              features: [
                { text: "40,000 records per month", included: true },
                { text: "2-hour turnaround during business hours", included: true },
                { text: "Enhanced property & demographic data", included: true },
                { text: "Email delivery of processed files", included: true },
                { text: "Advanced segmentation templates", included: true },
                { text: "API access", included: false },
                { text: "Custom integrations", included: false },
              ],
              buttonText: "Get Started",
              highlighted: true,
              popular: true,
            },
            {
              name: "Enterprise",
              description: "For high-volume mailers requiring API integration and custom solutions",
              price: {
                monthly: 2997,
                annually: 32967,
              },
              features: [
                { text: "100,000 records per month", included: true },
                { text: "1-hour priority processing", included: true },
                { text: "Complete property & neighborhood data", included: true },
                { text: "Direct API integration", included: true },
                { text: "Custom targeting strategy", included: true },
                { text: "Dedicated account manager", included: true },
                { text: "White-labeled reporting", included: true },
              ],
              buttonText: "Contact Us",
              highlighted: false,
            }
          ]}
          guaranteeText="Need flexibility? Try our pay-as-you-go option at just $0.05 per record with no monthly commitment."
        />
      </SectionWrapper>

      {/* About Us Section */}
      <SectionWrapper id="about">
        <AboutSection 
          heading="Our Story & Mission"
          story="Founded in 2022 by Peter Correia, this service began with a simple observation: real estate investors were making critical decisions without access to comprehensive property data. What started as a tool for investors quickly evolved when I discovered businesses were wasting thousands on untargeted direct mail campaigns. As a data enthusiast with a passion for efficiency, I couldn't stand seeing marketing dollars thrown away on generic lists."
          mission="Our mission is to democratize access to premium real estate data, making sophisticated targeting accessible to businesses of all sizes. We're transforming how companies approach direct mail by eliminating guesswork and replacing it with data-driven precision."
          founderImage="/about_us_image.jpeg"
          founderName="Peter Correia"
          founderRole="Founder & Data Specialist"
          differentiators={[
            {
              title: "Data Obsession",
              description: "We live and breathe property data, constantly refining our enrichment process to extract the most valuable insights for your campaigns."
            },
            {
              title: "ROI-Focused Approach",
              description: "Every feature we develop addresses one question: Will this help our clients generate more revenue from their direct mail campaigns?"
            },
            {
              title: "Rapid Implementation",
              description: "We believe in speed without sacrificing quality. Your data is enriched and returned within hours, not days or weeks."
            }
          ]}
          team={[]}
        />
      </SectionWrapper>
      
      {/* FAQ Section */}
      <SectionWrapper background="light" id="faq" className="py-20">
        <AccordionFAQ 
          heading="Frequently Asked Questions"
          subheading="Get answers to common questions about our Zillow data enrichment services."
          faqs={[
            {
              question: "Why should I pay for Zillow data enrichment when I can already buy standard homeowner lists or data from other providers?",
              answer: (
                <p>
                  Unlike basic homeowner lists or conventional data providers, Zillow-enriched data provides up-to-date property valuations, rent estimates, and detailed housing insights. This extra layer of precision helps you segment and target prospects more accurately, resulting in improved conversion rates and reduced marketing waste. By leveraging real-time valuations instead of static, generic lists, you gain a competitive edge in crafting high-impact campaigns.
                </p>
              )
            },
            {
              question: "How accurate is Zillow's Zestimate data? Won't relying on inaccurate valuations hurt my marketing effectiveness?",
              answer: (
                <p>
                  Zillow's Zestimate typically boasts a median error rate of about 2–7% (depending on the market). While no automated valuation can be perfect, these accuracy levels are generally sufficient for effective marketing segmentation. To alleviate concerns, we offer both a free trial period and a money-back guarantee, allowing you to validate the performance and accuracy before committing long-term.
                </p>
              )
            },
            {
              question: "If this data is truly effective, won't my competitors use it too, diluting my advantage?",
              answer: (
                <p>
                  Access to enriched data is only part of the equation—your results ultimately hinge on how you use that information in your campaigns. Every marketer's execution strategy, messaging, and creative approach are unique. For additional peace of mind, we also limit the number of clients we partner with in the same geographic or industry segment, maintaining exclusivity and ensuring you continue to stand out.
                </p>
              )
            },
            {
              question: "I'm concerned about data privacy and compliance. How do I know this Zillow data enrichment service won't put my business at risk?",
              answer: (
                <p>
                  Our enrichment process uses publicly accessible property data from Zillow, focusing on addresses and real estate details—not sensitive personal information. We strictly adhere to all relevant privacy regulations and maintain robust data management practices. This ensures that you remain fully compliant while benefiting from the added value of enriched property insights.
                </p>
              )
            },
            {
              question: "How will Zillow-enriched data actually improve my direct mail response rate or ROI? Can you quantify the impact?",
              answer: (
                <p>
                  By focusing your outreach on more accurately valued properties, you can tailor your messaging and offers to each segment, improving overall response and conversion rates. While exact results vary, case studies have shown increases as high as 144% for certain campaigns. For further confidence, we offer a free month or trial period, along with a money-back guarantee, so you can measure ROI directly without risk.
                </p>
              )
            },
            {
              question: "Is it complicated to integrate this data with my existing CRM or direct marketing tools?",
              answer: (
                <p>
                  We provide the enriched data in universally compatible formats (such as CSV or Excel) that most CRMs and marketing platforms can import seamlessly. Our onboarding resources include step-by-step tutorials and dedicated support to ensure a smooth implementation, so you can start benefiting from the enriched insights with minimal disruption.
                </p>
              )
            },
            {
              question: "How do your subscription or pay-per-use pricing models work? Will I risk overspending or being locked into a contract?",
              answer: (
                <p>
                  We offer flexible monthly subscriptions and pay-per-use options tailored to your marketing volume. Transparent pricing and clear usage estimates help you select the best fit for your budget, and you can cancel or adjust your plan anytime without penalties. Additionally, our money-back guarantee ensures you never pay for results you don't see.
                </p>
              )
            }
          ]}
        />
      </SectionWrapper>
      
      {/* CTA Section */}
      <SectionWrapper id="contact" className="py-16 md:py-24">
        <CTA 
          title="Ready to transform your direct mail with Zillow data?"
          description="Schedule a free strategy call to learn how our data enrichment services can boost your campaign results."
          buttonText="Book Your Free Strategy Call"
          imageSrc="/images/cta-illustration.png"
          imageAlt="Contact us illustration with decorative elements"
        />
      </SectionWrapper>

      {/* Footer */}
      <footer className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="text-2xl font-bold mb-6 flex items-center">
                <span className="text-[#B9FF66] mr-1">&gt;</span>Precision Data
              </div>
              <p className="text-gray-700 mb-4">Zillow data enrichment for targeted direct mail campaigns.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#about" className="text-gray-700 hover:text-primary transition-colors flex items-center"><span className="mr-2 text-xs">›</span>About Us</a></li>
                <li><a href="#testimonials" className="text-gray-700 hover:text-primary transition-colors flex items-center"><span className="mr-2 text-xs">›</span>Testimonials</a></li>
                <li><a href="#pricing" className="text-gray-700 hover:text-primary transition-colors flex items-center"><span className="mr-2 text-xs">›</span>Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-6">Resources</h4>
              <ul className="space-y-4">
                <li><a href="#contact" className="text-gray-700 hover:text-primary transition-colors flex items-center"><span className="mr-2 text-xs">›</span>Book a Strategy Call</a></li>
                <li><a href="#faq" className="text-gray-700 hover:text-primary transition-colors flex items-center"><span className="mr-2 text-xs">›</span>FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-300 pt-8 text-center md:text-left md:flex md:justify-between md:items-center text-gray-600">
            <p>© {new Date().getFullYear()} Precision Data. All rights reserved.</p>
            <div className="mt-4 md:mt-0 space-x-6">
              <a href="/terms-of-use" target="_blank" className="text-gray-600 hover:text-primary transition-colors">Terms of Use</a>
              <a href="/privacy-policy" target="_blank" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
