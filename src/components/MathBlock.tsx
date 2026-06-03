import katex from 'katex';

export function MathBlock({ latex }: { latex: string }) {
  const html = katex.renderToString(latex, { throwOnError: false, displayMode: true });
  return <div className="math" dangerouslySetInnerHTML={{ __html: html }} />;
}
