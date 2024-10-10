import ComingSoonPage from "@/components/comingSoonPage";

export default function Home() {
  return (
    <ComingSoonPage 
      launchDate={new Date('2024-11-15')} // Example prop
      customFeatures={[/* custom features */]} // Example prop
    />
  );
}