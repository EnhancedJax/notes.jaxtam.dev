import fs from "fs";
import path from "path";
import CourseFiles from "./CourseFiles.client";

export default function CourseFilesWrapper({
  className,
}: {
  className?: string;
}) {
  const sortedFiles = getSortedFiles();

  return <CourseFiles className={className} sortedFiles={sortedFiles} />;
}

function getSortedFiles() {
  const directoryPath = path.join(process.cwd(), "content/notes");
  const jsonFiles: any[] = [];

  function readDirectory(directory: string) {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        readDirectory(fullPath);
      } else if (file === "meta.json") {
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const jsonData = JSON.parse(fileContents);
        if (jsonData.title) {
          jsonFiles.push(jsonData);
        }
      }
    });
  }

  readDirectory(directoryPath);

  return jsonFiles.sort((a, b) => {
    const [yearA, seasonA] = a.semester.split(" ");
    const [yearB, seasonB] = b.semester.split(" ");

    if (yearA !== yearB) {
      return parseInt(yearA) - parseInt(yearB);
    }

    return seasonA === "Spring" ? -1 : 1;
  });
}
