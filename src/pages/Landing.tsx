import { useEffect, useRef, useState } from "react";
import { HomeworkItem, HwItem } from "../components/HomeworkUtils";
import { AccountType, LoadHomework, LoadUsername } from "../components/Utils";
import { Link } from "react-router";
import { Button } from "nes-ui-react";

export default function Landing() {
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>([])
  const [firstUse, setFirstUse] = useState(true)
  const [dueSplit, setDueSplit] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    var hwTemp = [] as HomeworkItem[]
    Object.values(AccountType).forEach((type) => {
      if (LoadUsername(type)) setFirstUse(false)
      hwTemp = [...hwTemp, ...LoadHomework(type)]
    })
    hwTemp.sort((a, b) => a.due - b.due)
    setHomeworks(hwTemp)
    setDueSplit(Date.now() / 1000 - 7 * 24 * 60 * 60)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [dueSplit])

  return (
    <div className="flex gap-3 items-center justify-center flex-col w-full max-w-md">
      {firstUse ? (
        <div className="flex flex-col gap-3 mt-5 items-center justify-center">
          <h1 className="text-5xl sm:text-6xl flex">=<span className="animate-bounce">^</span>·.·<span className="animate-bounce">^</span>=</h1>
          <span className="animate-pulse">·</span>
          <span className="text-2xl">欢迎来到 CatLin ！</span>
          <span className="text-base mb-5">完成作业也可如此有趣！</span>
          <span className="text-base">
            快到
            {' '}
            <Link to="/settings" className="text-blue-500 animate-pulse">设置页</Link>
            {' '}
            关联作业账户吧！</span>
        </div>
      ) : (
        <>
          {homeworks
            .filter(item => item.due >= dueSplit)
            .length == 0 ? (
            <div className="flex flex-col gap-5 mt-5 items-center justify-center">
              <h1 className="text-4xl sm:text-6xl flex"><span className="animate-bounce">¯\_</span>(ツ)<span className="animate-bounce">_/¯</span></h1>
              <span className="text-base sm:text-xl">你似乎已经把作业全写完了呢！</span>
            </div>
          ) : (
            homeworks
              .filter(item => item.due >= dueSplit)
              .map((hw, _) => (
                <HwItem
                  key={`${hw.course}-s${hw.title}`}
                  course={hw.course}
                  title={hw.title}
                  submitted={hw.submitted}
                  due={hw.due}
                  url={hw.url}
                />
              ))
          )}
          <div className="flex gap-3 items-center justify-center">
            <Button
              onClick={() => { setDueSplit(due => due - 7 * 24 * 60 * 60) }}
              className="text-nowrap"
            >
              -↓-
            </Button>
            <span>截至 {new Date(dueSplit * 1000).toLocaleString()}</span>
            <Button
              onClick={() => { setDueSplit(due => Math.min(Date.now() / 1000, due + 7 * 24 * 60 * 60)) }}
              className="text-nowrap"
            >
              -↑-
            </Button>
          </div>
          <div ref={bottomRef} />
        </>
      )}
    </div>
  )
}