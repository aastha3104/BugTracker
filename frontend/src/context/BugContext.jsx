import { createContext, useContext, useState } from "react";

const BugContext = createContext();

const initialBugs = [
  {
    id: "BUG-001",
    title: "Login button not working",
    priority: "High",
    severity: "Critical",
    status: "Open",
  },
  {
    id: "BUG-002",
    title: "Dashboard loading slowly",
    priority: "Medium",
    severity: "Major",
    status: "In Progress",
  },
  {
    id: "BUG-003",
    title: "Password validation issue",
    priority: "High",
    severity: "Major",
    status: "Resolved",
  },
];

export function BugProvider({ children }) {
  const [bugs, setBugs] = useState(() => {
    const savedBugs = localStorage.getItem("bugs");

    return savedBugs ? JSON.parse(savedBugs) : initialBugs;
  });

  // ADD BUG
  const addBug = (newBug) => {
    const updatedBugs = [
      ...bugs,
      {
        ...newBug,
        id: `BUG-${String(bugs.length + 1).padStart(3, "0")}`,
      },
    ];

    setBugs(updatedBugs);
    localStorage.setItem("bugs", JSON.stringify(updatedBugs));
  };

  // UPDATE BUG
  const updateBug = (id, updatedData) => {
    const updatedBugs = bugs.map((bug) =>
      bug.id === id
        ? {
            ...bug,
            ...updatedData,
          }
        : bug
    );

    setBugs(updatedBugs);
    localStorage.setItem("bugs", JSON.stringify(updatedBugs));
  };

  // DELETE BUG
  const deleteBug = (id) => {
    const updatedBugs = bugs.filter((bug) => bug.id !== id);

    setBugs(updatedBugs);
    localStorage.setItem("bugs", JSON.stringify(updatedBugs));
  };

  return (
    <BugContext.Provider
      value={{
        bugs,
        addBug,
        updateBug,
        deleteBug,
      }}
    >
      {children}
    </BugContext.Provider>
  );
}

export function useBugs() {
  return useContext(BugContext);
}