// app.js
async function loadData() {
  const res = await fetch("./src/data.json");
  return await res.json();
}

// Overall Progress rendering
function createModuleStep(module) {
  const li = document.createElement("li");
  li.classList.add("progress-step");

  if (module.status === "complete") li.classList.add("is-complete");
  if (module.status === "active") {
    li.classList.add("is-active");
    li.setAttribute("aria-current", "step");
  }

  li.innerHTML = `
    <div class="progress-text">
      <!-- <span>${module.title}</span> -->
    </div>
  `;

  return li;
}

// Chapter listing rendering
function createChapterStep(chapter) {
  const li = document.createElement("li");
  li.classList.add("progress-step");

  if (chapter.status === "complete") li.classList.add("is-complete");
  if (chapter.status === "active") li.classList.add("is-active");

  // If there is a "text" member of the "lessons" array then put the text below the chapter.
  const lessonTextHtml = Array.isArray(chapter.lessons)
    ? chapter.lessons
        .filter(lesson => lesson && lesson.text)
        .map(lesson => `<p>${lesson.text}</p>`)
        .join("")
    : "";

  li.innerHTML = `
    <div class="progress-text">
      <h5>${chapter.title}</h5>
      ${lessonTextHtml}
    </div>
  `;

  return li;
}

function renderTimeline(data) {
  // Clear the existing timeline content before rebuilding it.
  const container = document.getElementById("timeline");
  container.innerHTML = "";

  // Use all modules except the welcome module for the overall progress tracker.
  const modules = data.modules.filter(module => module.id !== "00");

  // Build the top summary section for overall progress.
  const overviewSection = document.createElement("section");
  overviewSection.className = "overall-progress";

  // Add the heading for the overall progress summary.
  const heading = document.createElement("h2");
  heading.textContent = "Overall Progress";
  overviewSection.appendChild(heading);

  // Create the horizontal tracker that shows each module's status.
  const overviewList = document.createElement("ol");
  overviewList.className = "progress-tracker progress-tracker--marker-square";

  // Add one list item per module, styled from its JSON status.
  modules.forEach(module => {
    overviewList.appendChild(createModuleStep(module));
  });

  // Append the overall progress tracker to the page.
  overviewSection.appendChild(overviewList);
  container.appendChild(overviewSection);

  // add a heading for the detailed tracker section
  const detailHeading = document.createElement("h2");
  detailHeading.textContent = "Detailed Progress";
  container.appendChild(detailHeading);

  // add text that says, "If you want to skip to the active lesson, click the link below." followed by a link to the #current lesson.
  const currentLessonText = document.createElement("p");
  currentLessonText.innerHTML = "If you want to skip to the active lesson, click the link below.";
  container.appendChild(currentLessonText);

  const currentLessonLink = document.createElement("a");
  currentLessonLink.href = "#current";
  currentLessonLink.textContent = "Go to Current Lesson";
  container.appendChild(currentLessonLink);


  // Render the detailed vertical tracker for each module below the summary.
  modules.forEach(module => {
    const title = document.createElement("h3");
    title.className = "module-title";
    title.textContent = `${module.id} ${module.title}`;
    container.appendChild(title);

    const ol = document.createElement("ol");
    ol.className = "progress-tracker progress-tracker--vertical";

    // Add each chapter as a vertical progress step.
    module.chapters.forEach(chapter => {
      ol.appendChild(createChapterStep(chapter));
    });

    container.appendChild(ol);
  });
}

loadData().then(renderTimeline);
