import { useLocation, useParams } from "react-router";

export default function NotFound() {
  let params = useParams()
  let location = useLocation()
  return (
    <div className="flex gap-3 items-center justify-center flex-col w-full max-w-md">
      <h1 className="text-5xl sm:text-8xl">404</h1>
      <h2 className="text-2xl py-3">{"(੭ ᐕ)੭？"} 您真的来对地儿了吗？</h2>
      <span className="text-wrap whitespace-normal break-all">
        Technical Details:
        <br /> <br />
        URL: {window.location.href}
        <br />
        Params: {JSON.stringify(params)}
        <br />
        Location: {JSON.stringify(location)}
      </span>
    </div>
  )
}