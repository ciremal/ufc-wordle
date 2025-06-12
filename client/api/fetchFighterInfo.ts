import fs from "fs";

export const getAllFighters = async () => {
  try {
    const res = await fetch("https://ufc-api.vercel.app/fighters");
    // const res = await fetch("/ufc.json");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch fighters");
  }
};
