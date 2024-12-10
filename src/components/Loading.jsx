import Group from "./assets/Group"

export const Loading = () => {
    return(
        <div className="relative w-screen h-screen">
  <div className="absolute inset-0 flex items-center justify-center">
    <Group className="w-20 h-20" />
  </div>
</div>
    )
}