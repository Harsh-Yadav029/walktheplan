import React, { useState, useMemo } from 'react';
import { Search, Sparkles, MessageCircle, ArrowRight, X, Clock, Calendar, User, Share2, CheckCircle2, ChevronRight } from 'lucide-react';
import { useRouter } from '../lib/router';
import { Blog8, type Post } from '../components/ui/blog8';
import { BUSINESS_CONTACT, buildWhatsAppUrl } from '../lib/bookingLogic';

interface FullArticle extends Post {
  readTime?: string;
  content: {
    intro: string;
    keyPoints: { title: string; desc: string }[];
    architectTip: string;
    conclusion: string;
  };
}

const ALL_ARTICLES: FullArticle[] = [
  {
    id: "post-1",
    title: "10 Costly Floor Plan Mistakes You Can Only Catch in 1:1 Scale",
    summary:
      "From claustrophobic kitchen work triangles to door swing collisions, blind corridor corners, and window sill misalignments—here are the most critical architectural blueprint oversights caught during true-scale studio projections.",
    label: "Floor Plan Mistakes",
    author: "Parth Khanna",
    published: "18 Feb 2026",
    url: "#post-1",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    tags: ["Floor Plan Mistakes", "Spatial Engineering", "1:1 Scale"],
    readTime: "6 min read",
    content: {
      intro: "Paper blueprints and CAD drawings present a two-dimensional illusion of space. When clients look at a 12' × 14' bedroom on a computer monitor, it invariably feels generous. Yet in real physical reality, wardrobe depths, bedside table swings, and door clearances eat away up to 40% of usable circulation area.",
      keyPoints: [
        {
          title: "Door Swing Collisions",
          desc: "Main bedroom doors opening straight into wardrobe shutters or ensuite bathroom entrances, creating daily domestic friction."
        },
        {
          title: "The Cramped Kitchen Work Triangle",
          desc: "Placing the refrigerator too close to the island counter, blocking refrigerator door opening when another person is cooking."
        },
        {
          title: "Blind Corridor Turns",
          desc: "Corridors narrower than 3'6\" that make moving furniture or carrying suitcases virtually impossible without gouging walls."
        },
        {
          title: "Electrical Switches Trapped Behind Opened Doors",
          desc: "Light switches placed behind door swings that force you into dark rooms before reaching for the light panel."
        }
      ],
      architectTip: "At Walk The Plan, we use wheeled real-scale modular furniture. Roll the king bed and sofa into place on the projected floor plan before locking in masonry work.",
      conclusion: "Fixing a CAD line during a 1:1 studio walkthrough takes 30 seconds. Tearing down a brick wall after RCC slab curing costs weeks and lakhs in rework."
    }
  },
  {
    id: "post-2",
    title: "The Financial Reality of Blueprint Revision vs. On-Site Demolition",
    summary:
      "Knocking down a newly cast RCC beam or moving plumbing lines costs lakhs and delays construction by months. Discover how Indian homeowners and developers save up to ₹4,50,000 per floor with a 2-hour projection session.",
    label: "Cost Savings",
    author: "Walk The Plan Studio Team",
    published: "12 Feb 2026",
    url: "#post-2",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    tags: ["Cost Savings", "Construction Economics", "Budgeting"],
    readTime: "5 min read",
    content: {
      intro: "Demolition in modern high-end construction is not merely noisy—it is catastrophic to budget adherence, waterproofing integrity, and structural warranties. Shifting an already plumbed bathroom wastes masonry, re-waterproofing, tile work, and contractor downtime.",
      keyPoints: [
        {
          title: "Plumbing Rerouting Costs",
          desc: "Relocating waste pipes through cured RCC floor cores averages ₹65,000–₹1,20,000 and compromises slab waterproofing."
        },
        {
          title: "Masonry Rebuilding & Plaster Waste",
          desc: "Demolishing an 8-inch brick wall generates debris hauling charges and costs ₹45,000 per 100 sq.ft to re-erect."
        },
        {
          title: "Contractor Schedule Slippage",
          desc: "Each major structural modification delays electrical conduits and HVAC by 3 to 6 weeks."
        }
      ],
      architectTip: "Our ₹40,000 (2-Hour Studio Projection) pays for itself tenfold by eliminating even one mid-construction wall shift.",
      conclusion: "Spatial validation is the cheapest insurance policy you can buy for your home construction project."
    }
  },
  {
    id: "post-3",
    title: "Why 3D Computer Renders Lie About Room Proportions & Circulation",
    summary:
      "Wide-angle lenses in architectural 3D software artificially inflate small master bedrooms and living rooms. True 1:1 projection bridges the visual gap between 2D paper blueprints and real-world human ergonomics.",
    label: "Spatial Engineering",
    author: "Ar. Vikram Malhotra",
    published: "05 Feb 2026",
    url: "#post-3",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    tags: ["Spatial Engineering", "Architectural VR", "Circulation"],
    readTime: "7 min read",
    content: {
      intro: "Architectural rendering engines use virtual camera focal lengths equivalent to 18mm or 24mm ultra-wide lenses. While this makes renders look magazine-ready, it distorts depth perception and exaggerates room size by up to 35%.",
      keyPoints: [
        {
          title: "The Virtual Lens Distortion",
          desc: "A 10-foot ceiling in a 3D perspective looks grand; in human eye field-of-view, it can feel restrictive with heavy false ceilings."
        },
        {
          title: "Circulation Comfort vs Static Shots",
          desc: "Renderings capture static beauty; they don't let you experience walking past a dining chair while someone is seated."
        },
        {
          title: "Physical Scale Reality Check",
          desc: "Our projection studios display 1:1 laser lines with millimeter accuracy, matching your actual site slab dimensions."
        }
      ],
      architectTip: "Stand inside the projected master bedroom with your partner. Stretch your arms, check the walkway between bed end and TV console.",
      conclusion: "3D renders are for aesthetics; 1:1 scale projection is for living ergonomics."
    }
  },
  {
    id: "post-4",
    title: "Vastu & Layout Validation: Aligning Energy Flow and Sightlines",
    summary:
      "Ensure northeast entrances, kitchen agni corners, and master bedroom stability feel intuitively harmonious in physical space. Walk the thresholds with family elders and your Vastu consultant simultaneously.",
    label: "Vastu & Layout",
    author: "Spatial Design Team",
    published: "28 Jan 2026",
    url: "#post-4",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    tags: ["Vastu Validation", "Energy Flow", "Floor Plans"],
    readTime: "4 min read",
    content: {
      intro: "Vastu compliance is often debated in families when blueprints are on paper. When family members cannot visualize cardinal orientation in real space, compromise becomes contentious.",
      keyPoints: [
        {
          title: "Northeast Entrance Sightlines",
          desc: "Validating that main door sightlines do not directly peer into guest washrooms or service quarters."
        },
        {
          title: "Kitchen Agni Alignment",
          desc: "Verifying the cook's east-facing orientation while testing cooking island ergonomic reach."
        },
        {
          title: "Pooja Room Sanctity & Proximity",
          desc: "Ensuring the prayer space maintains serene spatial separation from heavy plumbing shafts."
        }
      ],
      architectTip: "Invite your family elder and Vastu expert to the studio. Walking the projected compass grid builds instant family consensus.",
      conclusion: "When everyone experiences the layout together, approvals take 1 hour instead of weeks of back-and-forth arguments."
    }
  },
  {
    id: "post-5",
    title: "Duplex & Luxury Villa Design: Testing Bare-Shell Height & Staircase Ratios",
    summary:
      "Double-height ceilings and cantilevered floating staircases look breathtaking on paper but can create awkward dead zones underneath. How bare-shell 1:1 walkthroughs validate structural volume before casting slabs.",
    label: "Luxury Villas",
    author: "Parth Khanna",
    published: "20 Jan 2026",
    url: "#post-5",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    tags: ["Duplex Design", "Bare-Shell Review", "Luxury Homes"],
    readTime: "8 min read",
    content: {
      intro: "Multi-level homes present spatial challenges that 2D floor plans fail to convey—specifically stair tread-to-riser comfort, mezzanine sightlines, and double-height acoustic reflection.",
      keyPoints: [
        {
          title: "Stair Landing Clearances",
          desc: "Preventing awkward head-bump hazards beneath intermediate landing turns on duplex staircases."
        },
        {
          title: "Double-Height Living Scale",
          desc: "Experiencing whether the vertical void feels cavernous or pleasantly proportioned to furniture grouping."
        },
        {
          title: "Private vs Public Zoning",
          desc: "Walking the boundary between formal guest lounges and private family suites across floor transitions."
        }
      ],
      architectTip: "Our 3D wall projection feature extrudes bare-shell vertical heights so you can test head clearances in real space.",
      conclusion: "A luxury villa is an investment of a lifetime; validate every cubic foot before pouring the foundation."
    }
  }
];

const CATEGORIES = ["All", "Floor Plan Mistakes", "Cost Savings", "Spatial Engineering", "Vastu & Layout", "Luxury Villas"];

export function BlogPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeArticle, setActiveArticle] = useState<FullArticle | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync hash deep link if user opens /blog#post-1
  React.useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const targetId = window.location.hash.replace("#", "");
      const matched = ALL_ARTICLES.find((a) => a.id === targetId || a.url === window.location.hash);
      if (matched) {
        setActiveArticle(matched);
      }
    }
  }, [router.hash]);

  const handleOpenArticle = (article: FullArticle) => {
    setActiveArticle(article);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, '', '#' + article.id);
    }
  };

  const handleCloseArticle = () => {
    setActiveArticle(null);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Filter articles based on category and live keyword search
  const filteredArticles = useMemo(() => {
    return ALL_ARTICLES.filter((article) => {
      const matchesCategory =
        selectedCategory === "All" ||
        article.label.toLowerCase() === selectedCategory.toLowerCase() ||
        article.tags?.some((t) => t.toLowerCase() === selectedCategory.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query) ||
        article.tags?.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const whatsappHref = buildWhatsAppUrl(
    BUSINESS_CONTACT.phoneRaw,
    "Hello Walk The Plan! I was reading your architectural blog and would like to inquire about booking a 1:1 scale walkthrough session for my floor plan."
  );

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="relative w-full bg-[#181A1B] text-[#F2EDE5] min-h-screen pt-28 pb-16 selection:bg-[#C47B52]/30 selection:text-white">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#C47B52]/10 via-[#EED77A]/5 to-transparent blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A5A7A4]">
          <button
            type="button"
            onClick={() => router.navigate("/")}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-[#C47B52]" />
          <span className="text-[#EED77A]">Architectural Blog & Guides</span>
        </nav>

        {/* Search & Filter Bar */}
        <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-8">
          {/* Keyword Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A5A7A4]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, floor plan tips, keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#141516]/90 text-sm text-white placeholder-[#787A77] focus:outline-none focus:border-[#C47B52] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A5A7A4] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${isActive
                      ? "bg-[#C47B52] text-black font-semibold shadow-md shadow-[#C47B52]/20"
                      : "bg-white/5 text-[#A5A7A4] hover:bg-white/10 hover:text-white border border-white/5"
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty Search Fallback */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 border border-white/10 rounded-2xl bg-[#141516]/50 p-8">
            <h3 className="text-xl font-serif text-white mb-2">No matching architectural guides found</h3>
            <p className="text-sm text-[#A5A7A4] mb-6">
              We couldn't find any articles matching "{searchQuery}" under the "{selectedCategory}" category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-5 py-2 rounded-lg bg-[#C47B52] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#d88d63] transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Blog8 Component Integration */
          <Blog8
            heading="The Build-Smart Blog"
            description="Expert guides, spatial checklists, and architectural technology breakdowns to help homeowners, builders, and architects build without regrets or expensive on-site rework."
            posts={filteredArticles}
            onSelectPost={(post) => {
              const full = ALL_ARTICLES.find((a) => a.id === post.id);
              if (full) handleOpenArticle(full);
            }}
          />
        )}

        {/* Bottom High-Conversion Studio Booking Banner */}
        <div className="mt-20 relative overflow-hidden rounded-3xl border border-[#C47B52]/30 bg-gradient-to-br from-[#1b1c1e] via-[#141516] to-[#0d0e10] p-8 md:p-14 text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C47B52]/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C47B52]/40 bg-[#C47B52]/10 text-[#C47B52] text-xs font-mono uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            1:1 Architectural Blueprint Verification
          </div>

          <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white mb-4 max-w-2xl mx-auto leading-tight">
            Have an Architectural Blueprint or Floor Plan Ready?
          </h3>

          <p className="text-sm sm:text-base text-[#A5A7A4] max-w-xl mx-auto mb-8 leading-relaxed">
            Test drive your layout at full 1:1 true scale before starting construction. Walk through bedrooms, kitchen, and living areas with 100% spatial certainty across our studios in Gurugram, Dehradun, Varanasi, Hyderabad, and Madurai.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => router.navigate("/services")}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C47B52] text-black text-sm font-bold uppercase tracking-wider hover:bg-[#d88d63] transition-all transform hover:scale-105 shadow-lg shadow-[#C47B52]/20 cursor-pointer"
            >
              <span>Explore Services & Book Slot</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 text-[#25D366] text-sm font-semibold hover:bg-[#25D366]/20 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp (+91 97110 22075)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Article Detail Modal */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={handleCloseArticle}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-[#141516] border border-white/15 rounded-2xl p-6 sm:p-10 shadow-2xl my-8 max-h-[90vh] overflow-y-auto text-left"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseArticle}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Article Header */}
            <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
              <span className="rounded-md border border-[#C47B52]/40 bg-[#C47B52]/10 px-2.5 py-1 font-mono text-[#C47B52] uppercase font-semibold">
                {activeArticle.label}
              </span>
              <span className="text-[#A5A7A4] inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activeArticle.readTime}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-4 leading-tight">
              {activeArticle.title}
            </h2>

            <div className="flex items-center justify-between text-xs text-[#A5A7A4] pb-6 mb-6 border-b border-white/10">
              <span className="inline-flex items-center gap-1.5 text-white/90">
                <User className="w-3.5 h-3.5 text-[#C47B52]" /> By {activeArticle.author}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Published {activeArticle.published}
              </span>
            </div>

            {/* Article Hero Image */}
            <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 mb-8">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Body */}
            <div className="space-y-6 text-[#CBD5E1] text-sm sm:text-base leading-relaxed">
              <p className="text-base sm:text-lg font-medium text-white/95 leading-relaxed">
                {activeArticle.content.intro}
              </p>

              <h4 className="text-lg font-serif font-bold text-[#EED77A] mt-6">
                Critical Blueprint Review Checkpoints:
              </h4>

              <div className="grid gap-4">
                {activeArticle.content.keyPoints.map((pt, i) => (
                  <div key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex items-start gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-[#C47B52] shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-white text-sm">{pt.title}</h5>
                      <p className="text-xs sm:text-sm text-[#A5A7A4] mt-1">{pt.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Architect Tip Callout */}
              <div className="rounded-xl border border-[#C47B52]/40 bg-[#C47B52]/10 p-5 text-sm text-[#F2EDE5]">
                <strong className="text-[#C47B52] block font-mono text-xs uppercase tracking-wider mb-1">
                  Architect's Studio Tip
                </strong>
                {activeArticle.content.architectTip}
              </div>

              <p className="font-semibold text-white pt-2">
                {activeArticle.content.conclusion}
              </p>
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 text-xs font-medium text-[#A5A7A4] hover:text-white transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#C47B52]" />
                {copiedLink ? "Link Copied!" : "Share Article Link"}
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCloseArticle();
                  router.navigate("/services");
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C47B52] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#d88d63] transition-colors cursor-pointer"
              >
                <span>Book 1:1 Walkthrough</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default BlogPage;
