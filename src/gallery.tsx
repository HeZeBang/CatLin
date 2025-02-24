import { A, Badge, BadgeSplitted, BlockText, Button } from "nes-ui-react";

export default function gallery() {
  return (
    <div className="flex gap-3 items-center justify-center flex-col">
      <Button className="text-xl">Button</Button>
      <A className="text-xl text-inherit" href="#">Link</A>
      <Badge text="Badge - SmallText" backgroundColor="warning" className="m-auto w-[200px]"/>
      <BadgeSplitted textLeft="Badge" text="Splitted" backgroundColor="success" className="text-xl m-3"/>
      <BlockText text="BlockText"/>

    </div>
  )
}