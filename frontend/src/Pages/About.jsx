import { Code } from "@mantine/core";

export default function About() {
  const codeForPreviousDemo = `
        <h1>This is just a text to let you know about the project</h1>
        <p>This is just a text to let you know about the project</p>`;
  return (
    <div>
      <Code block>{codeForPreviousDemo}</Code>;
    </div>
  );
}
