import GuessTable from "@/components/GuessTable";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center my-6 mx-45">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-5xl font-bold">UFClue</h1>
        <h2 className="text-lg">A UFC Fighter guessing game</h2>
        <div className="border border-black mt-3 w-full"></div>
      </div>
      <div className="py-20 w-[90%] flex justify-between">
        <input
          className="bg-white w-[60%] py-3 px-4"
          placeholder="Guess The Fighter"
        ></input>
        <div className="flex gap-4">
          <button className="border py-3 px-10 text-xl">Help</button>
          <button className="border py-3 px-10 text-xl">About</button>
        </div>
      </div>
      <div className="mt-20 w-[90%]">
        <GuessTable />
      </div>
    </div>
  );
}
