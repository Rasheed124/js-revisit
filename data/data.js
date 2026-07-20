let passagesData = {};

export async function loadPassages() {
  const response = await fetch("../data.json");

  if (!response.ok) {
    throw new Error("Failed to load passages.");
  }

  passagesData = await response.json();

  return passagesData;
}

export { passagesData };
