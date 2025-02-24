import { A, Badge, BadgeSplitted, Button, Checkbox, IconButton, Input, Radio } from "nes-ui-react";
import { SVGProps } from "react";


export default function gallery() {
  return (
    <div className="flex gap-3 items-center justify-center flex-col">
      <Button className="text-xl">Button / 按钮</Button>
      <A className="text-xl text-inherit" href="#">Link</A>
      <Badge text="Badge - SmallText" backgroundColor="warning" className="m-auto w-[200px]"/>
      <BadgeSplitted textLeft="Badge" text="Splitted" backgroundColor="success" className="text-xl m-3"/>
      <IconButton color="success">
        <Android className="w-10 h-10"/>
        <span className="text-2xl">Android</span>
      </IconButton>
      <div className="flex gap-3 text-lg">
        <Radio name="radio" value="1" label="Radio Checked" checked={true}/>
        <Radio name="radio" value="2" label="Radio Uncheked"/>
      </div>
      <div className="flex gap-3 text-lg">
        <Checkbox label="Checkbox Checked" checked={true}/>
        <Checkbox label="Checkbox Unchecked"/>
      </div>
      <Input type="text" color="warning" className="text-md bg-inherit" value="Input"/>
    </div>
  )
}

export function Android(props: SVGProps<SVGSVGElement>) {
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
        d="M2 5h2v2H2zm4 4H4V7h2zm2 0H6v2H4v2H2v6h20v-6h-2v-2h-2V9h2V7h2V5h-2v2h-2v2h-2V7H8zm0 0h8v2h2v2h2v4H4v-4h2v-2h2zm2 4H8v2h2zm4 0h2v2h-2z"
      ></path>
    </svg>
  )
}
