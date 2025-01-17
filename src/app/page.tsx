import ChessGame from "./components/chessGame";

export default function Home() {
  return (
    <main className="w-full min-h-screen relative bg-slate-950 text-slate-50 selection:bg-lime-500 scroll-smooth">
      <div className="container mx-auto p-4">
        <ChessGame />
      </div>
    </main>
  );
}
