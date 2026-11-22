import { Blog8, type Post, type Blog8Props } from "@/components/ui/blog8";

const demoData = {
  heading: "Blog Posts",
  description:
    "Discover the latest insights and tutorials about modern web development, UI design, and component-driven architecture.",
  posts: [
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
      tags: ["Floor Plan Mistakes", "Spatial Engineering"],
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
      tags: ["Cost Savings", "Construction Economics"],
    },
  ],
};

function Blog8Demo() {
  return <Blog8 {...demoData} />;
}

export { Blog8, Blog8Demo, type Post, type Blog8Props };
