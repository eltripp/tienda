import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [65, 78, 84, 90, 120, 140, 160];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Insights</p>
        <h1 className="font-heading text-3xl text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-400">Visualiza tendencias de ventas, tickets y recurrencia.</p>
      </div>
      <Card className="border-slate-900/70 bg-slate-950/60">
        <CardHeader>
          <CardTitle className="text-lg text-slate-100">Ingresos semanales (MM CLP)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-56 items-end gap-4">
            {data.map((value, index) => (
              <div key={index} className="flex flex-1 flex-col justify-end">
                <div
                  className="rounded-t-2xl bg-gradient-to-t from-emerald-500/30 to-sky-500/40"
                  style={{ height: `${value}px` }}
                />
                <p className="mt-2 text-center text-xs text-slate-500">S{index + 1}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
