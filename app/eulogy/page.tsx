import EulogyViewer from "./EulogyViewer";

export default function Page({ searchParams }: { searchParams?: { url?: string } }) {
  const url = searchParams?.url ?? null;

  return (
    <main className="py-12">
      <div className=" mx-auto lg:px-6">
        <EulogyViewer initialUrl={url} />
      </div>
    </main>
  );
}
