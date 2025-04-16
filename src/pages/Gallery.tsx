// import { A, Badge, BadgeSplitted, Button, Checkbox, IconButton, Input, Radio } from "nes-ui-react";
import { PixelBorder, Progress } from "nes-ui-react";
import { SVGProps } from "react";

interface Cat {
  avatar: string,
  name: string,
  description?: string,
  happiness: number,
  hunger: number,
  owned: boolean
}

const dummyCats = [
  {
    avatar: "black",
    name: "煤炭",
    happiness: 0.5,
    hunger: 0.2,
    owned: true,
    description: "好黑啊，像煤炭一样"
  },
  {
    avatar: "xl",
    name: "豆沙包",
    happiness: 0.8,
    hunger: 0.6,
    owned: false,
    description: "味道怎么样呢～"
  },
  {
    avatar: "orange",
    name: "胖橘",
    happiness: 0.8,
    hunger: 0.1,
    owned: true,
  },
  {
    avatar: "blue",
    name: "蓝猫",
    happiness: 0.1,
    hunger: 0.9,
  },
  {
    avatar: "pattern",
    name: "花岗岩",
    happiness: 0.7,
    hunger: 0.3,
    owned: false,
  },
  {
    avatar: "white",
    name: "白猫",
    happiness: 0.9,
    hunger: 0.4,
    owned: true,
  },
  {
    avatar: "gray",
    name: "灰猫",
    happiness: 0.6,
    hunger: 0.5,
    owned: false,
  },
  {
    avatar: "yellow",
    name: "罗勒",
    happiness: 0.8,
    hunger: 0.2,
    owned: true,
    description: "是男孩子哦"
  }
] as Cat[]

export default function Gallery() {
  return (
    <div className="columns-1 sm:columns-2 md:columns-4 justify-center gap-4 p-4 min-h-fit">
      {dummyCats.map((item, index) =>
        <PixelBorder doubleRoundCorners className="w-full mb-2 break-inside-avoid" index={index}
          style={{
            opacity: item.owned ? 1 : 0.4
          }}
        >
          <div className="flex flex-row sm:flex-col justify-center items-center active:scale-95">
            <img src={`/avatars/${item.avatar}.png`} className="max-w-28 m-5"
            />
            <div className="flex flex-col mx-2 my-2">
              <p className="text-2xl flex align-middle">{item.name}{item.owned ? "" : "（未获得）"}</p>
              {item.description && <span className="text-base opacity-80">{item.description}</span>}
              <div className="text-md flex justify-center items-center">
                <span className="flex-auto min-w-[3.5em] text-nowrap">心情</span>
                <Progress value={item.happiness}
                  style={{
                    maxHeight: "10px"
                  }} />
              </div>
              <div className="text-md flex justify-center items-center">
                <span className="flex-auto min-w-[3.5em] text-nowrap">饱食度</span>
                <Progress value={item.hunger}
                  style={{
                    maxHeight: "10px"
                  }} />
              </div>
            </div>
          </div>
        </PixelBorder>
      )
      }
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
