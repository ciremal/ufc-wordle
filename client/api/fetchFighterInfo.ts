export const getAllFighters = async () => {
  try {
    const res = await fetch("https://ufc-api.vercel.app/fighters");
    return await res.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch fighters");
  }
};
