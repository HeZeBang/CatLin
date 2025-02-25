import { SVGProps } from "react";

export function Moon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M6 2h8v2h-2v2h-2V4H6zM4 6V4h2v2zm0 10H2V6h2zm2 2H4v-2h2zm2 2H6v-2h2zm10 0v2H8v-2zm2-2v2h-2v-2zm-2-4h2v4h2v-8h-2v2h-2zm-6 0v2h6v-2zm-2-2h2v2h-2zm0 0V6H8v6z"
      ></path>
    </svg>
  )
}

export function Sun(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M13 3h-2v2h2zm4 2h2v2h-2zm-6 6h2v2h-2zm-8 0h2v2H3zm18 0h-2v2h2zM5 5h2v2H5zm14 14h-2v-2h2zm-8 2h2v-2h-2zm-4-2H5v-2h2zM9 7h6v2H9zm0 8H7V9h2zm0 0v2h6v-2h2V9h-2v6z"
      ></path>
    </svg>
  )
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M4 6h16v2H4zm0 5h16v2H4zm16 5H4v2h16z"
      ></path>
    </svg>
  )
}

export function Hourglass(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M18 2H6v6h2v2h2v4H8v2H6v6h12v-6h-2v-2h-2v-4h2V8h2zm-2 6h-2v2h-4V8H8V4h8zm-2 6v2h2v4H8v-4h2v-2z"
      ></path>
    </svg>
  )
}