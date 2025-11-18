import EulogyViewer from "./EulogyViewer";

export default function Page({ searchParams }: { searchParams?: { url?: string } }) {
  const url = searchParams?.url ?? null;

  return (
      <div className=" mx-auto">
        <EulogyViewer initialUrl={url} />
      </div>
  );
}
