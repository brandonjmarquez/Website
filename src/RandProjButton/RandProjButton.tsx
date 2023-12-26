import React, { useEffect } from "react";

const RandProjButton = () => {
  useEffect(() => {})

  const colProjLinks = () => {
    const projElem = document.getElementById("projects");
    let projectLinks = [""];

    if(projElem) {
      projectLinks = Array.from(projElem?.querySelectorAll("a"))
        .filter((elem) => !elem.href.includes("https://github.com/") && elem.className === "proj-link")
        .map((elem) => elem.href);
    }
    if(projectLinks?.length > 0) window.open(projectLinks[Math.round(Math.random() * projectLinks.length)]);
  }

  return (
    <div>
      <button type="button" className="nav-item" onClick={colProjLinks}>Go to a random project of mine!</button>
    </div>
  );
}

export default RandProjButton;