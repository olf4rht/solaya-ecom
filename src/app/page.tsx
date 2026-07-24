import Navbar from "@/components/Navbar";
import IndustryShowcase from "@/components/IndustryShowcase";

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Navbar />
      <IndustryShowcase />
    </div>
  );
}
