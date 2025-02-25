import { useEffect, useState } from "react";
import { HomeworkItem, HwItem } from "../components/HomeworkUtils";
import { AccountType, LoadHomework, LoadUsername } from "../components/Utils";
import { Link } from "react-router";

export default function Landing() {
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>([])
  const [firstUse, setFirstUse] = useState(true)

  useEffect(() => {
    var hwTemp = [] as HomeworkItem[]
    Object.values(AccountType).forEach((type) => {
      if (LoadUsername(type)) setFirstUse(false)
      hwTemp = [...hwTemp, ...LoadHomework(type)]
    })
    hwTemp.sort((a, b) => a.due - b.due)
    setHomeworks(hwTemp)
  }, [])

  return (
    <div className="flex gap-3 items-center justify-center flex-col w-full max-w-md">
      {homeworks
        .filter(item => item.due == Date.now() / 1000 - 7 * 24 * 60 * 60)
        .length == 0 && firstUse ? (
        <div className="flex flex-col gap-3 mt-5 items-center justify-center">
          <h1 className="text-6xl">=^·.·^=</h1>
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
        <div className="flex flex-col gap-5 mt-5 items-center justify-center">
          <h1 className="text-6xl">{'¯\\_(ツ)_/¯'}</h1>
          <span className="text-xl">你似乎已经把作业全写完了呢！</span>
        </div>
      )
      }
      {homeworks
        .filter(item => item.due == Date.now() / 1000 - 7 * 24 * 60 * 60)
        .map((hw, index) => (
          <HwItem
            key={index}
            course={hw.course}
            title={hw.title}
            submitted={hw.submitted}
            due={hw.due}
            url={hw.url}
          />
        ))}
    </div>
  )
}