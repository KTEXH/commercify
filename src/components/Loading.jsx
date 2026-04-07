import Group from "./assets/Group"

export const Loading = () => {
    return (
        <div className="fixed inset-0 bg-zinc-950 flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <Group className="w-10 h-10 opacity-90" />
                <div className="absolute inset-0 blur-xl bg-white/20 rounded-full" />
            </div>
            <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                    <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                    />
                ))}
            </div>
        </div>
    )
}
