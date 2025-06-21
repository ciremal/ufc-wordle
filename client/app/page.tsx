import ClientHome from "@/components/ClientHome";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center my-5 md:mx-45 mx-6">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-7xl font-bold">UFClue</h1>
        <h2 className="text-2xl">A UFC Fighter guessing game</h2>
        <div className="text-sm">Updated as of 06-15-2025</div>
        <div className="border border-[var(--borderColor)] mt-3 w-full"></div>
      </div>
      <ClientHome />
    </div>
  );
}
