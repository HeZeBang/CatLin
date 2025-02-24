import { PixelBorder } from "nes-ui-react";
import Nyan from "../assets/nyan.webp";

export default function Landing() {
  return (
    <div className="flex gap-3 items-center justify-center flex-col">
      <h1 className="text-5xl sm:text-8xl">CatLin</h1>
      <h2 className="text-2xl py-3">=＾● ⋏ ●＾=</h2>
      <p className="text-xl">
        让 CatLin 陪伴你的每一天！
      </p>
      <PixelBorder doubleSize doubleRoundCorners>
        <img src={Nyan} alt="Nyan Cat" className="w-full h-full"/>
      </PixelBorder>
    </div>
  )
}