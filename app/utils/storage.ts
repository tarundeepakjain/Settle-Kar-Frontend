import AsyncStorage from "@react-native-async-storage/async-storage";

const GROUPS_KEY = "groups";

export async function getGroups() {
  try {
    const json = await AsyncStorage.getItem(GROUPS_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error("Error fetching groups", error);
    return [];
  }
}

export async function saveGroups(groups: any[]) {
  try {
    await AsyncStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
  } catch (error) {
    console.error("Error saving groups", error);
  }
}

export async function updateGroupExpenses(groupId: string, newExpenses: any[]) {
  try {
    const groups = await getGroups();
    const updated = groups.map((g: any) =>
      g.id === groupId ? { ...g, expenses: newExpenses } : g
    );
    await saveGroups(updated);
    return updated;
  } catch (error) {
    console.error("Error updating expenses", error);
  }
}
