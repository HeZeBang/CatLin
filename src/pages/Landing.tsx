import { PixelBorder } from "nes-ui-react";

export default function Landing() {
  return (
    <div className="flex gap-3 items-center justify-center flex-col w-full max-w-md">
      <PixelBorder doubleRoundCorners className="w-full">
        <button className="nes-ui-icon-btn nes-ui-btn-success nes-ui-is-size-medium w-full">
          <div className="p-2 flex gap-3 items-center w-full">
            <div className="flex-1 flex flex-col items-start">
              <span className="text-xl">CourseName</span>
              <span>HomeworkName</span>
            </div>
            <div className="flex items-end flex-col">
              <div className="flex gap-1">
                <span className="text-4xl">3<sup className="text-sm">d</sup></span>
                <span className="text-4xl">2<sup className="text-sm">h</sup></span>
                <span className="text-4xl">1<sup className="text-sm">m</sup></span>
              </div>
              <span>Due: 2025/02/14 00:00</span>
            </div>
          </div>
        </button>
      </PixelBorder>
    </div>
  )
}