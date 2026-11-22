import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface Post {
  id: string;
  title: string;
  summary: string;
  label: string;
  author: string;
  published: string;
  url: string;
  image: string;
  tags?: string[];
}

export interface Blog8Props {
  heading?: string;
  description?: string;
  posts?: Post[];
  onSelectPost?: (post: Post) => void;
}

const DEFAULT_POSTS: Post[] = [
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
  },
];

const Blog8 = ({
  heading = "The Build-Smart Blog",
  description = "Expert guides, spatial checklists, and architectural technology breakdowns to help homeowners, builders, and architects build without regrets or expensive on-site rework.",
  posts = DEFAULT_POSTS,
  onSelectPost,
}: Blog8Props) => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-14 md:gap-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C47B52]/40 bg-[#C47B52]/10 text-[#C47B52] text-xs font-mono uppercase tracking-widest mb-4">
            Architectural Insights & Spatial Knowledge
          </div>
          <h2 className="mx-auto mb-6 text-pretty text-3xl font-semibold md:text-4xl lg:text-5xl lg:max-w-3xl text-white font-serif">
            {heading}
          </h2>
          <p className="mx-auto max-w-2xl text-[#A5A7A4] md:text-lg leading-relaxed">
            {description}
          </p>
        </div>

        <div className="w-full grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="order-last border-0 bg-transparent shadow-none sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2 group"
            >
              <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12">
                <div className="sm:col-span-5">
                  <div className="mb-4 md:mb-6">
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wider text-[#A5A7A4] md:gap-3 lg:gap-4">
                      {post.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-[#C47B52]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl text-white group-hover:text-[#EED77A] transition-colors">
                    <a
                      href={post.url}
                      onClick={(e) => {
                        if (onSelectPost) {
                          e.preventDefault();
                          onSelectPost(post);
                        }
                      }}
                      className="hover:underline"
                    >
                      {post.title}
                    </a>
                  </h3>
                  <p className="mt-4 text-[#A5A7A4] md:mt-5 leading-relaxed text-sm md:text-base">
                    {post.summary}
                  </p>
                  <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8">
                    <span className="text-white/90 font-medium">{post.author}</span>
                    <span className="text-[#A5A7A4]">•</span>
                    <span className="text-[#A5A7A4]">
                      {post.published}
                    </span>
                  </div>
                  <div className="mt-6 flex items-center space-x-2 md:mt-8">
                    <button
                      type="button"
                      onClick={() => onSelectPost?.(post)}
                      className="inline-flex items-center font-semibold text-[#C47B52] hover:text-[#EED77A] hover:underline md:text-base transition-colors cursor-pointer"
                    >
                      <span>Read more</span>
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
                <div className="order-first sm:order-last sm:col-span-5">
                  <div
                    onClick={() => onSelectPost?.(post)}
                    className="block cursor-pointer"
                  >
                    <div className="aspect-[16/9] overflow-clip rounded-xl border border-white/15 bg-black/40 shadow-xl group/img">
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover/img:scale-105 group-hover/img:opacity-85"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Blog8 };
