import { RealtimeDashboard } from "@/features/realtime/ui/RealtimeDashboard";

export const metadata = { title: "Real-time | FSD App" };

export default function RealtimePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">🔌 WebSockets + Redux</h1>
      <p className="text-gray-500 text-sm mb-5">
        Real-time дані через WebSocket Middleware
      </p>
      <RealtimeDashboard />
    </div>
  );
}
