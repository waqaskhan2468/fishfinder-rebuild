/** Emits a JSON-LD block. Kept separate from lib/schema.ts so that file
 *  stays plain TypeScript with no JSX. */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
