import ClientHome from "@/components/ClientHome";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center my-10 mx-45">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-5xl font-bold">UFClue</h1>
        <h2 className="text-lg">A UFC Fighter guessing game</h2>
        <div className="border border-black mt-3 w-full"></div>
      </div>
      <ClientHome />
    </div>
  );
}
