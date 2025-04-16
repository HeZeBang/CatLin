import { useEffect, useRef, useState } from "react";
import { HomeworkItem, HwItem } from "../components/HomeworkUtils";
import { AccountType, LoadHomework, LoadUsername } from "../components/Utils";
import { Link } from "react-router";
import { Button } from "nes-ui-react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useLoading } from "../context/LoadingContext";

export default function Landing() {
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>([])
  const [firstUse, setFirstUse] = useState(true)
  const [dueSplit, setDueSplit] = useState(0);
  const [drawerTop, setDrawerTop] = useState("unset")
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const { setIsLoading } = useLoading()

  const { unityProvider, isLoaded, unload } = useUnityContext({
    loaderUrl: "unity/demo/demo.loader.js",
    dataUrl: "unity/demo/demo.data.br",
    frameworkUrl: "unity/demo/demo.framework.js.br",
    codeUrl: "unity/demo/demo.wasm.br",
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      console.log("Unity loaded")
      setDrawerTop("calc(-9em + 100vh)")
      window.scrollTo(0, 0)
    }
    setIsLoading(!isLoaded)
  }, [isLoaded])

  useEffect(() => {
    return () => {
      unload();
    };
  }, [unload]);

  useEffect(() => {
    var hwTemp = [] as HomeworkItem[]
    Object.values(AccountType).forEach((type) => {
      if (LoadUsername(type)) setFirstUse(false)
      hwTemp = [...hwTemp, ...LoadHomework(type)]
    })
    hwTemp.sort((a, b) => b.due - a.due)
    setHomeworks(hwTemp)
    setDueSplit(Date.now() / 1000 - 7 * 24 * 60 * 60)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [dueSplit])

  return (
    <>
      <Unity unityProvider={unityProvider} className='fixed w-full h-full m-0 top-0 left-0 z-0' />
      <div className="w-full h-auto overflow-scroll drawer flex items-center justify-start flex-col z-10 px-5"
        style={{
          // marginTop: "calc(-9em + 100vh)",
          marginTop: drawerTop,
          minHeight: "100vh",
          transition: "margin-top 1s cubic-bezier(0.3, 0, 0.5, 1)",
        }}
      >
        <div className="nes-ui-toolbar -mx-5 w-full mb-5 mt-2"
          style={{
            minHeight: "2em",
          }}>
          <span className="text-xl w-full justify-center">TODOs</span>
        </div>
        <div ref={topRef} />
        <div className="flex gap-3 items-center justify-center flex-col w-full max-w-md">
          {firstUse ? (
            <div className="flex flex-col gap-3 mt-5 items-center justify-center">
              <h1 className="text-5xl sm:text-6xl flex">=<span className="animate-bounce">^</span>·.·<span className="animate-bounce">^</span>=</h1>
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
                .filter(item => !item.submitted)
                .length == 0 && (
                  <div className="flex flex-col gap-5 mt-5 items-center justify-center">
                    <h1 className="text-4xl sm:text-6xl flex"><span className="animate-bounce">¯\_</span>(ツ)<span className="animate-bounce">_/¯</span></h1>
                    <span className="text-base sm:text-xl">你似乎已经把作业全写完了呢！</span>
                  </div>
                )}
              {(
                homeworks
                  .filter(item => item.due >= dueSplit)
                  // .filter(item => !item.submitted)
                  .map((hw, index) => (
                    <HwItem
                      key={`${hw.course}-s${hw.title}`}
                      course={hw.course}
                      title={hw.title}
                      submitted={hw.submitted}
                      due={hw.due}
                      url={hw.url}
                      index={index}
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
      </div>
    </>
  )
}